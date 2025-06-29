// src/services/upload.js
import { supabase } from './supabaseClient';

// Upload a file to Supabase Storage
export async function uploadFile(bucket, filePath, file) {
  const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: '3600',
    upsert: true,
  });
  if (error) throw error;
  return data;
}

// Get a public URL for a file
export function getPublicUrl(bucket, filePath) {
  const { publicURL } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return publicURL;
}
