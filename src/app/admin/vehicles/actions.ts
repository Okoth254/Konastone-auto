'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveVehicle(formData: FormData) {
  const supabase = await createClient();
  
  const id = formData.get('id') as string;
  const isNew = id === 'new';

  // For a new vehicle, we need an ID upfront to create the storage folder
  // We'll use a pre-generated UUID if new, or the existing ID if editing
  const vehicleId = isNew ? crypto.randomUUID() : id;

  // --- 1. Validate the requested publishing state before storage writes ---
  let mainImageUrl = formData.get('main_image_url') as string | null;
  const galleryFiles = formData.getAll('gallery_images') as File[];
  const mainImageIndex = parseInt(formData.get('main_image_index') as string || '0');
  const deletedImageIds = (formData.get('deleted_image_ids') as string || '').split(',').filter(Boolean);
  const existingImageOrder = (formData.get('existing_image_order') as string || '').split(',').filter(Boolean);
  const saveIntent = formData.get('save_intent') === 'draft' ? 'draft' : 'publish';
  const requestedStatusRaw = formData.get('status') as 'draft' | 'available' | 'sold' | 'in_transit' | 'reserved';
  const requestedStatus = saveIntent === 'draft'
    ? 'draft'
    : requestedStatusRaw === 'draft'
      ? 'available'
      : requestedStatusRaw;
  const requestedFeatured = saveIntent === 'draft' ? false : formData.get('is_featured') === 'on';
  const realGalleryFiles = galleryFiles.filter((file) => file && file.size > 0);

  const databaseMinimumFields = [
    formData.get('make'),
    formData.get('model'),
    formData.get('year'),
    formData.get('price'),
  ].every((value) => String(value || '').trim().length > 0);

  if (!databaseMinimumFields) {
    const errorPath = isNew ? '/admin/vehicles/edit/new?vehicleError=draft_incomplete' : `/admin/vehicles/edit/${vehicleId}?vehicleError=draft_incomplete`;
    redirect(errorPath);
  }

  const retainedImageCount = existingImageOrder.filter((imageId) => !deletedImageIds.includes(imageId)).length;
  const finalImageCountBeforeUpload = retainedImageCount + realGalleryFiles.length + (mainImageUrl && retainedImageCount === 0 && realGalleryFiles.length === 0 ? 1 : 0);
  const requiredFields = [
    formData.get('make'),
    formData.get('model'),
    formData.get('year'),
    formData.get('price'),
    formData.get('mileage'),
    formData.get('fuel_type'),
    formData.get('transmission'),
  ].every((value) => String(value || '').trim().length > 0);

  const requiresPublicReadiness = requestedStatus === 'available' || requestedStatus === 'in_transit' || requestedFeatured;
  if (requiresPublicReadiness && (!requiredFields || finalImageCountBeforeUpload === 0)) {
    const errorPath = isNew ? '/admin/vehicles/edit/new?vehicleError=publish_incomplete' : `/admin/vehicles/edit/${vehicleId}?vehicleError=publish_incomplete`;
    redirect(errorPath);
  }

  // Upload each new gallery file to Supabase Storage
  const newlyUploadedImages: { storage_path: string; public_url: string }[] = [];

  for (const file of realGalleryFiles) {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const storagePath = `${vehicleId}/${fileName}`; // organized per vehicle

    const { error: uploadError } = await supabase.storage
      .from('vehicles')
      .upload(storagePath, file);

    if (uploadError) {
      console.error('Image upload error:', uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage.from('vehicles').getPublicUrl(storagePath);
    newlyUploadedImages.push({ storage_path: storagePath, public_url: urlData.publicUrl });
  }

  // Set main image URL from the newly uploaded images if provided
  if (newlyUploadedImages.length > 0 && !mainImageUrl) {
    const mainIdx = Math.min(mainImageIndex, newlyUploadedImages.length - 1);
    mainImageUrl = newlyUploadedImages[mainIdx].public_url;
  }

  // --- 2. Save/Update core vehicle data ---
  const vehicleData: Record<string, unknown> = {
    make: formData.get('make') as string,
    model: formData.get('model') as string,
    year: parseInt(formData.get('year') as string),
    mileage: parseInt((formData.get('mileage') as string) || '0'),
    vin: formData.get('vin') as string,
    body_style: formData.get('body_style') as string,
    body_type: formData.get('body_style') as string,
    exterior_color: formData.get('exterior_color') as string,
    color: formData.get('exterior_color') as string,
    fuel_type: formData.get('fuel_type') as string,
    engine_type: formData.get('engine_type') as string,
    power: formData.get('power') as string,
    transmission: formData.get('transmission') as string,
    drivetrain: formData.get('drivetrain') as string,
    drive_type: formData.get('drivetrain') as string,
    description: formData.get('description') as string,
    tags: (formData.get('tags') as string || '').split(',').map((tag) => tag.trim()).filter(Boolean),
    price: parseFloat((formData.get('price') as string).replace(/,/g, '')),
    status: requestedStatus,
    is_featured: requestedFeatured && requestedStatus === 'available',
    folder_name: vehicleId, // Use vehicleId as the folder name going forward
  };

  // Only set main_image_url if we have one (don't overwrite with null)
  if (mainImageUrl) {
    vehicleData.main_image_url = mainImageUrl;
  }

  let saveError;
  if (isNew) {
    const { error } = await supabase.from('vehicles').insert([{ id: vehicleId, ...vehicleData }]);
    saveError = error;
  } else {
    const { error } = await supabase.from('vehicles').update(vehicleData).eq('id', vehicleId);
    saveError = error;
  }

  if (saveError) {
    console.error('Error saving vehicle:', saveError);
    throw new Error('Failed to save vehicle data');
  }

  await supabase.from('admin_audit_log').insert({
    action: isNew ? 'vehicle_created' : 'vehicle_updated',
    entity_type: 'vehicle',
    entity_id: vehicleId,
    summary: `${isNew ? 'Created' : 'Updated'} ${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`,
  }).then(() => undefined);

  // --- 3. Insert new images into vehicle_images table ---
  if (newlyUploadedImages.length > 0) {
    const newImageSortStart = existingImageOrder.length;
    const imageRecords = newlyUploadedImages.map((img, idx) => ({
      vehicle_id: vehicleId,
      storage_path: img.storage_path,
      public_url: img.public_url,
      is_main: img.public_url === mainImageUrl,
      sort_order: newImageSortStart + idx,
    }));

    const { error: imgInsertError } = await supabase.from('vehicle_images').insert(imageRecords);
    if (imgInsertError) {
      console.error('Error inserting image records:', imgInsertError);
      // Non-fatal: vehicle was saved, just log the error
    }
  }

  // --- 4. Delete removed images ---
  if (deletedImageIds.length > 0) {
    // Fetch storage paths before deleting
    const { data: toDelete } = await supabase
      .from('vehicle_images')
      .select('storage_path')
      .in('id', deletedImageIds);

    if (toDelete && toDelete.length > 0) {
      const paths = toDelete.map(img => img.storage_path).filter((path): path is string => Boolean(path));
      if (paths.length > 0) {
        await supabase.storage.from('vehicles').remove(paths);
      }
    }

    await supabase.from('vehicle_images').delete().in('id', deletedImageIds);
  }

  // --- 5. Update is_main flag if the main image was changed ---
  if (mainImageUrl && !isNew) {
    await supabase.from('vehicle_images').update({ is_main: false }).eq('vehicle_id', vehicleId);
    await supabase.from('vehicle_images').update({ is_main: true }).eq('vehicle_id', vehicleId).eq('public_url', mainImageUrl);
    await supabase.from('vehicles').update({ main_image_url: mainImageUrl }).eq('id', vehicleId);
  }

  // --- 6. Persist re-ordered existing image positions ---
  if (existingImageOrder.length > 0) {
    await Promise.all(
      existingImageOrder.map((imageId, idx) =>
        supabase
          .from('vehicle_images')
          .update({ sort_order: idx })
          .eq('id', imageId)
          .eq('vehicle_id', vehicleId)
      )
    );
  }

  revalidatePath('/admin/vehicles');
  revalidatePath('/');
  revalidatePath('/inventory');
  revalidatePath(`/vehicle/${vehicleId}`);
  redirect(`/admin/vehicles/edit/${vehicleId}?saved=1`);
}

export async function deleteVehicle(id: string) {
  const supabase = await createClient();

  const { data: vehicle } = await supabase
    .from('vehicles')
    .select('year, make, model')
    .eq('id', id)
    .single();

  const { data: images, error: imageFetchError } = await supabase
    .from('vehicle_images')
    .select('storage_path')
    .eq('vehicle_id', id);

  if (imageFetchError) {
    console.error('Error preparing vehicle deletion:', imageFetchError);
    redirect(`/admin/vehicles/edit/${id}?vehicleError=delete_prepare_failed`);
  }

  await supabase.from('admin_audit_log').insert({
    action: 'vehicle_delete_attempted',
    entity_type: 'vehicle',
    entity_id: id,
    summary: `Delete requested for ${vehicle?.year || ''} ${vehicle?.make || ''} ${vehicle?.model || ''}`.trim(),
  }).then(() => undefined);

  if (images && images.length > 0) {
    const paths = images.map(img => img.storage_path).filter((path): path is string => Boolean(path));
    if (paths.length > 0) {
      const { error: storageError } = await supabase.storage.from('vehicles').remove(paths);
      if (storageError) {
        console.error('Error removing vehicle images from storage:', storageError);
        redirect(`/admin/vehicles/edit/${id}?vehicleError=delete_storage_failed`);
      }
    }
  }

  const { error } = await supabase.from('vehicles').delete().eq('id', id);

  if (error) {
    console.error('Error deleting vehicle:', error);
    redirect(`/admin/vehicles/edit/${id}?vehicleError=delete_failed`);
  }

  await supabase.from('admin_audit_log').insert({
    action: 'vehicle_deleted',
    entity_type: 'vehicle',
    entity_id: id,
    summary: `Deleted ${vehicle?.year || ''} ${vehicle?.make || ''} ${vehicle?.model || ''}`.trim(),
  }).then(() => undefined);

  revalidatePath('/admin/vehicles');
  revalidatePath('/');
  revalidatePath('/inventory');
  revalidatePath(`/vehicle/${id}`);
  redirect('/admin/vehicles?vehicleAction=deleted');
}

export async function updateVehicleCatalogueState(
  id: string,
  updates: {
    status?: 'draft' | 'available' | 'sold' | 'in_transit' | 'reserved';
    is_featured?: boolean;
  },
  redirectTo?: string,
) {
  const supabase = await createClient();

  const vehicleData: Record<string, unknown> = {};
  if (updates.status) vehicleData.status = updates.status;
  if (typeof updates.is_featured === 'boolean') vehicleData.is_featured = updates.is_featured;

  if (Object.keys(vehicleData).length === 0) return;

  if (updates.status === 'available' || updates.status === 'in_transit' || updates.is_featured === true) {
    const [{ data: vehicle }, { count: imageCount }] = await Promise.all([
      supabase.from('vehicles').select('make, model, year, price, mileage, fuel_type, transmission').eq('id', id).single(),
      supabase.from('vehicle_images').select('*', { count: 'exact', head: true }).eq('vehicle_id', id),
    ]);
    const ready = vehicle && vehicle.make && vehicle.model && vehicle.year && vehicle.price && vehicle.mileage !== null && vehicle.fuel_type && vehicle.transmission && (imageCount || 0) > 0;
    if (!ready) {
      if (redirectTo) {
        const separator = redirectTo.includes('?') ? '&' : '?';
        redirect(`${redirectTo}${separator}vehicleError=publish_incomplete`);
      }
      throw new Error('Vehicle needs complete public details and at least one image before it can be available or featured.');
    }
  }

  if (updates.status && updates.status !== 'available') {
    vehicleData.is_featured = false;
  }

  const { error } = await supabase.from('vehicles').update(vehicleData).eq('id', id);

  if (error) {
    console.error('Error updating vehicle catalogue state:', error);
    throw new Error('Failed to update vehicle catalogue state');
  }

  await supabase.from('admin_audit_log').insert({
    action: 'vehicle_state_changed',
    entity_type: 'vehicle',
    entity_id: id,
    summary: `Vehicle state updated: ${JSON.stringify(updates)}`,
  }).then(() => undefined);

  revalidatePath('/admin/vehicles');
  revalidatePath(`/admin/vehicles/${id}`);
  revalidatePath('/');
  revalidatePath('/inventory');
  revalidatePath(`/vehicle/${id}`);

  if (redirectTo) {
    redirect(redirectTo);
  }
}
