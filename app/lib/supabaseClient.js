import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mbhcgrbescrqzuswrpjj.supabase.co";
const supabaseKey = "sb_publishable_f4P-wthCDQjmn4NdXOSfcQ_50CAJXbY";

export const supabase = createClient(supabaseUrl, supabaseKey);