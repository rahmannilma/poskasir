import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials are not fully configured in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper to check if a specific table exists and is readable.
 * Returns false if the table does not exist (PostgreSQL error code 42P01).
 */
export async function checkTableExists(tableName: string): Promise<boolean> {
  try {
    const { error } = await supabase.from(tableName).select('*').limit(1);
    if (error && (error.code === '42P01' || error.message?.includes('does not exist'))) {
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Error checking table ${tableName}:`, err);
    return false;
  }
}
