import { createClient } from "@supabase/supabase-js";

// Use environment variables if available, otherwise use placeholders
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
