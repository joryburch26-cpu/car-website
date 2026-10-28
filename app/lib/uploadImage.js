import { supabase } from "./supabaseClient";

// Any picture a phone can take is accepted (up to 25 MB before shrinking).
export function isGoodImage(file) {
  const looksLikeImage = file.type.startsWith("image/") || /\.(heic|heif)$/i.test(file.name);
  return looksLikeImage && file.size <= 25 * 1024 * 1024;
}

function loadImage(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

// Shrinks a photo and turns it into a normal JPG (about 200 to 500 KB).
// Phone photos (including iPhone HEIC photos) become small, light pictures.
// Returns null if the browser cannot read the picture.
export async function prepareImage(file, maxSize) {
  const loaded = await loadImage(file);
  if (!loaded) return null;

  const { img, url } = loaded;
  let width = img.naturalWidth;
  let height = img.naturalHeight;

  if (!width || !height) {
    URL.revokeObjectURL(url);
    return null;
  }

  const scale = Math.min(1, maxSize / Math.max(width, height));
  width = Math.round(width * scale);
  height = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(img, 0, 0, width, height);
  URL.revokeObjectURL(url);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
  if (!blob) return null;

  return new File([blob], "photo.jpg", { type: "image/jpeg" });
}

// Shrinks the picture, uploads it into the seller's own folder, and returns its public address
export async function uploadImage(file, userId, kind) {
  const prepared = await prepareImage(file, kind === "avatar" ? 800 : 1600);
  if (!prepared) return null;

  const name = kind + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8) + ".jpg";
  const path = userId + "/" + name;

  const { error } = await supabase.storage
    .from("car-photos")
    .upload(path, prepared, { contentType: "image/jpeg" });

  if (error) return null;

  return supabase.storage.from("car-photos").getPublicUrl(path).data.publicUrl;
}

// Deletes a picture, given its public address
export async function deleteImage(url) {
  const parts = url.split("/car-photos/");
  if (parts.length < 2) return;
  await supabase.storage.from("car-photos").remove([decodeURIComponent(parts[1])]);
}
