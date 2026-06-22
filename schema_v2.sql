-- SQL Schema for NexaPOS on Supabase (Schema V2)
-- Copy and run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql

-- 1. Table: Dining Tables
CREATE TABLE IF NOT EXISTS dining_tables (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  number text NOT NULL,
  status text DEFAULT 'active', -- active, inactive
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT dining_tables_owner_number_key UNIQUE (owner_id, number)
);

ALTER TABLE dining_tables ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON dining_tables FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON dining_tables FOR ALL USING (true);

-- 2. Table: Materials
CREATE TABLE IF NOT EXISTS materials (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL UNIQUE,
  stock numeric(12, 2) DEFAULT 0.00,
  unit text DEFAULT 'pcs',
  minimum_stock numeric(12, 2) DEFAULT 0.00,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON materials FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON materials FOR ALL USING (true);

-- 3. Table: Product Material (Recipe mapping)
CREATE TABLE IF NOT EXISTS product_material (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id text REFERENCES products(id) ON DELETE CASCADE,
  material_id bigint REFERENCES materials(id) ON DELETE CASCADE,
  quantity numeric(10, 2) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE product_material ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON product_material FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON product_material FOR ALL USING (true);

-- 4. Table: Customers (Loyalty Members)
CREATE TABLE IF NOT EXISTS customers (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL UNIQUE,
  points integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON customers FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON customers FOR ALL USING (true);

-- 5. Table: Profiles (Custom User Data linking to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  role text DEFAULT 'cashier', -- owner, super_admin, manager, cashier, barista
  outlet_name text DEFAULT 'Cafe Resto',
  allowed_attendance_ip text,
  qris_path text,
  attendance_method text DEFAULT 'pin',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON public.profiles FOR ALL USING (true);

-- 6. Table: Shifts
CREATE TABLE IF NOT EXISTS shifts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  end_date timestamp with time zone,
  initial_cash numeric(12, 2) NOT NULL,
  expected_cash numeric(12, 2) NOT NULL DEFAULT 0.00,
  actual_cash numeric(12, 2),
  discrepancy numeric(12, 2) DEFAULT 0.00,
  total_cash_sales numeric(12, 2) DEFAULT 0.00,
  total_qris_sales numeric(12, 2) DEFAULT 0.00,
  total_transfer_sales numeric(12, 2) DEFAULT 0.00,
  notes text,
  status text DEFAULT 'open', -- open, closed
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON shifts FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON shifts FOR ALL USING (true);

-- 7. Table: Attendances
CREATE TABLE IF NOT EXISTS attendances (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  date text NOT NULL,
  check_in text,
  check_out text,
  status text,
  ip_address text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON attendances FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON attendances FOR ALL USING (true);

-- 8. Trigger to automatically confirm email for newly registered users on Supabase
-- If the "Confirm email" toggle is missing or not visible in your Supabase dashboard,
-- run this script to automatically confirm all sign-ups at the database layer.
CREATE OR REPLACE FUNCTION public.auto_confirm_new_users()
RETURNS trigger AS $$
BEGIN
  NEW.email_confirmed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER tr_auto_confirm_new_users
BEFORE INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.auto_confirm_new_users();


