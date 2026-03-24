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

  // --- 1. Handle all image uploads ---
  let mainImageUrl = formData.get('main_image_url') as string | null;
  const galleryFiles = formData.getAll('gallery_images') as File[];
  const mainImageIndex = parseInt(formData.get('main_image_index') as string || '0');
  const deletedImageIds = (formData.get('deleted_image_ids') as string || '').split(',').filter(Boolean);

  // Upload each new gallery file to Supabase Storage
  const newlyUploadedImages: { storage_path: string; public_url: string }[] = [];

  for (const file of galleryFiles) {
    if (!file || file.size === 0) continue;
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
    vin: formData.get('vin') as string,
    body_style: formData.get('body_style') as string,
    exterior_color: formData.get('exterior_color') as string,
    engine_type: formData.get('engine_type') as string,
    power: formData.get('power') as string,
    transmission: formData.get('transmission') as string,
    drivetrain: formData.get('drivetrain') as string,
    price: parseFloat((formData.get('price') as string).replace(/,/g, '')),
    status: formData.get('status') as 'available' | 'sold' | 'in_transit' | 'reserved',
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

  // --- 3. Insert new images into vehicle_images table ---
  if (newlyUploadedImages.length > 0) {
    const imageRecords = newlyUploadedImages.map((img, idx) => ({
      vehicle_id: vehicleId,
      storage_path: img.storage_path,
      public_url: img.public_url,
      is_main: img.public_url === mainImageUrl,
      sort_order: idx,
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
      const paths = toDelete.map(img => img.storage_path);
      await supabase.storage.from('vehicles').remove(paths);
    }

    await supabase.from('vehicle_images').delete().in('id', deletedImageIds);
  }

  // --- 5. Update is_main flag if the main image was changed ---
  if (mainImageUrl && !isNew) {
    await supabase.from('vehicle_images').update({ is_main: false }).eq('vehicle_id', vehicleId);
    await supabase.from('vehicle_images').update({ is_main: true }).eq('vehicle_id', vehicleId).eq('public_url', mainImageUrl);
    await supabase.from('vehicles').update({ main_image_url: mainImageUrl }).eq('id', vehicleId);
  }

  revalidatePath('/admin/vehicles');
  revalidatePath('/inventory');
  revalidatePath(`/vehicle/${vehicleId}`);
  redirect('/admin/vehicles');
}

export async function deleteVehicle(id: string) {
  const supabase = await createClient();

  // 1. Fetch all storage paths for this vehicle's images
  const { data: images } = await supabase
    .from('vehicle_images')
    .select('storage_path')
    .eq('vehicle_id', id);

  // 2. Delete from Supabase Storage
  if (images && images.length > 0) {
    const paths = images.map(img => img.storage_path);
    await supabase.storage.from('vehicles').remove(paths);
  }

  // 3. Delete vehicle (cascade deletes vehicle_images rows via FK)
  const { error } = await supabase.from('vehicles').delete().eq('id', id);

  if (error) {
    console.error('Error deleting vehicle:', error);
    throw new Error('Failed to delete vehicle');
  }

  revalidatePath('/admin/vehicles');
  revalidatePath('/inventory');
  redirect('/admin/vehicles');
}
