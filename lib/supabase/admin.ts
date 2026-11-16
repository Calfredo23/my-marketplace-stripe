import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/supabase/config";

let admin: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim();
  if (!config || !serviceKey) {
    return null;
  }
  if (!admin) {
    admin = createClient(config.url, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }
  return admin;
}
