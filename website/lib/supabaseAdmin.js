import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL || "https://rvcronfsjghrpskywlwh.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabaseAdmin = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
);
