-- ==========================================
-- SKRIP MIGRASI DATABASE SUPABASE (NexaPOS)
-- ==========================================
-- Jalankan skrip SQL di bawah ini di dalam SQL Editor Supabase Anda untuk menambahkan
-- kolom 'stock', 'min_stock', dan 'is_active' ke dalam tabel 'products'.
-- 
-- Link SQL Editor Supabase Anda:
-- https://supabase.com/dashboard/project/_/sql

-- 1. Tambahkan kolom 'stock' jika belum ada
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock numeric DEFAULT 50;

-- 2. Tambahkan kolom 'min_stock' jika belum ada
ALTER TABLE products ADD COLUMN IF NOT EXISTS min_stock numeric DEFAULT 10;

-- 3. Tambahkan kolom 'is_active' jika belum ada
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- 4. Opsional: Update nilai baris produk yang sudah ada agar tidak NULL
UPDATE products SET stock = 50 WHERE stock IS NULL;
UPDATE products SET min_stock = 10 WHERE min_stock IS NULL;
UPDATE products SET is_active = true WHERE is_active IS NULL;
