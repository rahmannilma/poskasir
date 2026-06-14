-- SQL Schema for M-COFFEE POS Database Setup
-- Copy and run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql

-- 1. Table: Categories
CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  icon text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) or bypass for anonymous client access
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous read access" ON categories FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous write access" ON categories FOR ALL TO anon USING (true);

-- 2. Table: Products
CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL,
  category text REFERENCES categories(id) ON DELETE SET NULL,
  image text,
  modifiers text[] DEFAULT '{}'::text[],
  sku text,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous read access" ON products FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous write access" ON products FOR ALL TO anon USING (true);

-- 3. Table: Staff Members
CREATE TABLE IF NOT EXISTS staff_members (
  id text PRIMARY KEY,
  name text NOT NULL,
  role text,
  shift text,
  status text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous read access" ON staff_members FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous write access" ON staff_members FOR ALL TO anon USING (true);

-- 4. Table: Attendance Logs
CREATE TABLE IF NOT EXISTS attendance_logs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  date text NOT NULL,
  name text NOT NULL,
  check_in text,
  check_out text,
  status text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous read access" ON attendance_logs FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous write access" ON attendance_logs FOR ALL TO anon USING (true);

-- 5. Table: Shift Schedules
CREATE TABLE IF NOT EXISTS shift_schedules (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  staff text[] DEFAULT '{}'::text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE shift_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous read access" ON shift_schedules FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous write access" ON shift_schedules FOR ALL TO anon USING (true);

-- 6. Table: Settings
CREATE TABLE IF NOT EXISTS settings (
  id text PRIMARY KEY DEFAULT 'main',
  store_name text,
  store_address text,
  store_phone text,
  printer_ip text,
  tax_rate text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous read access" ON settings FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous write access" ON settings FOR ALL TO anon USING (true);

-- Seed Initial Settings
INSERT INTO settings (id, store_name, store_address, store_phone, printer_ip, tax_rate)
VALUES ('main', 'M-Coffee Cafe', 'Jl. Kopi Presisi No. 12, Jakarta', '0812-3456-7890', '192.168.1.250', '8')
ON CONFLICT (id) DO NOTHING;

-- 7. Table: Pending Orders
CREATE TABLE IF NOT EXISTS pending_orders (
  id text PRIMARY KEY,
  order_number text NOT NULL,
  customer_name text,
  table_number text,
  discount_percent numeric DEFAULT 0,
  items jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE pending_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous read access" ON pending_orders FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous write access" ON pending_orders FOR ALL TO anon USING (true);

-- 8. Table: Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id text PRIMARY KEY,
  customer text NOT NULL,
  time text NOT NULL,
  total numeric NOT NULL,
  method text NOT NULL,
  status text NOT NULL,
  items jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous read access" ON transactions FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous write access" ON transactions FOR ALL TO anon USING (true);
