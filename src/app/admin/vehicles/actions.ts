'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveVehicle(formData: FormData) {
  const supabase = await createClient();
  
  const id = formData.get('id') as string;
  const isNew = id === 'new';

  let mainImageUrl = formData.get('main_image_url') as string;
  const imageFile = formData.get('image_file') as File | null;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('vehicles')
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error('Image upload error:', uploadError);
      throw new Error('Failed to upload vehicle image');
    }

    const { data: publicUrlData } = supabase.storage
      .from('vehicles')
      .getPublicUrl(filePath);

    mainImageUrl = publicUrlData.publicUrl;
  }

  const vehicleData = {
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
    main_image_url: mainImageUrl,
  };

  let error;
  if (isNew) {
    const { error: insertError } = await supabase.from('vehicles').insert([vehicleData]);
    error = insertError;
  } else {
    const { error: updateError } = await supabase.from('vehicles').update(vehicleData).eq('id', id);
    error = updateError;
  }

  if (error) {
    console.error('Error saving vehicle:', error);
    throw new Error('Failed to save vehicle');
  }

  revalidatePath('/admin/vehicles');
  revalidatePath('/inventory');
  redirect('/admin/vehicles');
}

export async function deleteVehicle(id: string) {
  const supabase = await createClient();

  // Optionally delete images from storage, but we'll focus on database entry first
  const { error } = await supabase.from('vehicles').delete().eq('id', id);

  if (error) {
    console.error('Error deleting vehicle:', error);
    throw new Error('Failed to delete vehicle');
  }

  revalidatePath('/admin/vehicles');
  revalidatePath('/inventory');
  redirect('/admin/vehicles');
}
