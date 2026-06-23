import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mqfygvhwdsenxuujisku.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xZnlndmh3ZHNlbnh1dWppc2t1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MjU0MjEsImV4cCI6MjA5NzAwMTQyMX0.UWIIwwFc4YVERVf0lkdAWIVTVB9xpQ9vWO-pm3P2ijU';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials are not fully configured in your .env file, using fallback credentials.');
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
