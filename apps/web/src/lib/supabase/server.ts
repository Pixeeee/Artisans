import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getRequiredServerEnv } from "../env";

let serviceClient: SupabaseClient | null = null;

export function getSupabaseServiceClient() {
  if (!serviceClient) {
    serviceClient = createClient(
      getRequiredServerEnv("NEXT_PUBLIC_SUPABASE_URL"),
      getRequiredServerEnv("SUPABASE_SERVICE_ROLE_KEY"),
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );
  }

  return serviceClient;
}
