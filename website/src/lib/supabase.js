import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://rvcronfsjghrpskywlwh.supabase.co";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_gbhc1x0xUwD6A8Xw126Wng_JPZuyecc";

export const supabase = createClient(supabaseUrl, supabaseKey);
