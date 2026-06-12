import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isMobileSupabaseConfigured, mobileEnv } from "./env";

export const supabase: SupabaseClient | null = isMobileSupabaseConfigured
  ? createClient(mobileEnv.supabaseUrl, mobileEnv.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: false,
        persistSession: true,
        storage: AsyncStorage,
      },
    })
  : null;
