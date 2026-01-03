/**
 * Upload een afbeelding naar Supabase Storage
 * @param {File} file - Het bestand om te uploaden
 * @param {string} bucket - De storage bucket naam (bijv. 'apartment-images')
 * @param {string} path - Het pad binnen de bucket
 * @returns {Promise<{url: string, path: string} | {error: string}>}
 */
export async function uploadImage(
  supabase,
  file,
  bucket = "apartment-images",
  path = ""
) {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()
      .toString(36)
      .substring(2)}-${Date.now()}.${fileExt}`;
    // Upload direct in de root van de bucket (geen submap)
    const filePath = fileName;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return { error: error.message };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return { url: publicUrl, path: filePath };
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Verwijder een afbeelding van Supabase Storage
 * @param {string} path - Het pad van het bestand
 * @param {string} bucket - De storage bucket naam
 */
export async function deleteImage(supabase, path, bucket = "apartment-images") {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Krijg een geoptimaliseerde image URL
 * @param {string} url - De originele image URL
 * @param {object} options - Transform opties (width, height, quality)
 */
export function getOptimizedImageUrl(url, options = {}) {
  const { width, height, quality = 80 } = options;

  if (!url) return "";

  // Supabase image transformatie URL
  const transformParams = [];
  if (width) transformParams.push(`width=${width}`);
  if (height) transformParams.push(`height=${height}`);
  transformParams.push(`quality=${quality}`);

  return `${url}?${transformParams.join("&")}`;
}
