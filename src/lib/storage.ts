import { supabase } from "./supabase";

const BUCKET_NAME = "vehicle-images";

/**
 * Uploads an image file to the Supabase Storage bucket.
 * Automatically generates a unique filename to prevent collisions.
 * 
 * @param file The Javascript File object (from an <input type="file">)
 * @param folderName Optional folder name inside the bucket (e.g. "toyota-fielder")
 * @returns The full public URL of the uploaded image
 */
export async function uploadImage(file: File, folderName: string = "general"): Promise<string> {
    try {
        // Create a unique file name using timestamp and random string
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${folderName}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error("Error uploading image:", uploadError);
            throw uploadError;
        }

        // Retrieve public URL
        const { data } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (error) {
        console.error("Error in uploadImage:", error);
        throw error;
    }
}

/**
 * Deletes an image from the Supabase Storage bucket using its public URL.
 * 
 * @param publicUrl The full public URL string
 */
export async function deleteImage(publicUrl: string): Promise<void> {
    try {
        // Extract the file path relative to the bucket from the public URL
        // Example URL: https://[project-id].supabase.co/storage/v1/object/public/vehicle-images/folder/123.jpg
        const match = publicUrl.match(new RegExp(`${BUCKET_NAME}/(.*)`));
        if (!match || match.length < 2) {
            console.warn("Could not parse file path from URL:", publicUrl);
            return;
        }

        const filePath = match[1];

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([filePath]);

        if (error) {
            console.error("Error removing image from bucket:", error);
            throw error;
        }
    } catch (error) {
        console.error("Error in deleteImage:", error);
        throw error;
    }
}
