import type { VehicleImage } from "@/types/database";

export function sortVehicleImages(images?: VehicleImage[] | null) {
  return [...(images || [])].sort((a, b) => {
    if (a.is_main && !b.is_main) return -1;
    if (!a.is_main && b.is_main) return 1;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });
}

export function getVehicleImageUrls(vehicle: {
  folder_name?: string | null;
  main_image_url?: string | null;
  vehicle_images?: VehicleImage[] | null;
}) {
  const gallery = sortVehicleImages(vehicle.vehicle_images)
    .map((image) => image.public_url)
    .filter(Boolean);

  if (gallery.length > 0) return gallery;
  if (vehicle.main_image_url) return [vehicle.main_image_url];
  if (vehicle.folder_name) return [`/images/inventory/${vehicle.folder_name}/1.jpeg`];
  return ["https://placehold.co/1200x800/1a1a1a/555555?text=No+Image"];
}

export function getVehicleImageUrl(vehicle: {
  folder_name?: string | null;
  main_image_url?: string | null;
  vehicle_images?: VehicleImage[] | null;
}) {
  return getVehicleImageUrls(vehicle)[0];
}
