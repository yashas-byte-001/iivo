import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/*
 * Paste your Supabase project URL and public anon key into environment variables named
 * VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Do not hardcode credentials in source files.
 */
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
