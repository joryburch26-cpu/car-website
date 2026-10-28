import { supabase } from "./supabaseClient";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

// A picture must be a JPG, PNG or WebP file of at most 5 MB
export function isGoodImage(file) {
  return allowedTypes.includes(file.type) && file.size <= 5 * 1024 * 1024;
}

// Uploads a picture into the seller's own folder and returns its public address
export async function uploadImage(file, userId, kind) {
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const name = kind + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8) + "." + ext;
  const path = userId + "/" + name;

  const { error } = await supabase.storage
    .from("car-photos")
    .upload(path, file, { contentType: file.type });

  if (error) return null;

  return supabase.storage.from("car-photos").getPublicUrl(path).data.publicUrl;
}

// Deletes a picture, given its public address
export async function deleteImage(url) {
  const parts = url.split("/car-photos/");
  if (parts.length < 2) return;
  await supabase.storage.from("car-photos").remove([decodeURIComponent(parts[1])]);
}
