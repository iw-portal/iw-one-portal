import { supabase } from "../lib/supabase";

export async function getPackages() {
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("is_active", true);

  if (error) throw error;

  return data || [];
}
