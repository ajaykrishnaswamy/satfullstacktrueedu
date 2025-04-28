import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 