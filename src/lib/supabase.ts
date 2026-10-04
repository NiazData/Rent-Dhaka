import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const SITE_IMAGES_BUCKET = "site-images";
export const OWNER_PHOTO_PATH = "owner/photo.jpg";
export const CONNECT_BUILDERS_PREFIX = "connect-builders";
