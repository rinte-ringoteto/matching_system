import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://url_need_to_be_changed.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'key_need_to_be changed';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);