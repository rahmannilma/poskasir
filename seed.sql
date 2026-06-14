-- SQL Seed Script for M-COFFEE POS Database
-- Copy and run this script in the Supabase SQL Editor to populate dummy data:
-- https://supabase.com/dashboard/project/_/sql

-- 1. Seed Categories
INSERT INTO categories (id, name, icon) VALUES
('coffee', 'Kopi', 'coffee'),
('tea', 'Teh', 'emoji_food_beverage'),
('food', 'Makanan', 'restaurant')
ON CONFLICT (id) DO NOTHING;

-- 2. Seed Products (menuItems)
INSERT INTO products (id, sku, name, category, price, image, modifiers, description) VALUES
('espresso', 'KPP-ESP', 'Espresso', 'coffee', 22000, 'https://images.pexels.com/photos/34563915/pexels-photo-34563915.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', ARRAY['Ekstra Sloki', 'Tanpa Kafein', 'Kurang Manis'], 'Ekstraksi kopi murni yang pekat dan kuat'),
('latte', 'KPP-LAT', 'Latte', 'coffee', 28000, 'https://images.pexels.com/photos/15800988/pexels-photo-15800988.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', ARRAY['Susu Gandum', 'Susu Almond', 'Ekstra Sloki', 'Vanila', 'Kurang Gula'], 'Espresso dengan susu hangat dan busa mikro lembut'),
('cappuccino', 'KPP-CAP', 'Cappuccino', 'coffee', 26000, 'https://images.pexels.com/photos/28496565/pexels-photo-28496565.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', ARRAY['Susu Gandum', 'Susu Almond', 'Ekstra Sloki', 'Kurang Gula'], 'Espresso dengan keseimbangan sempurna susu dan busa tebal'),
('flat-white', 'KPP-FTW', 'Flat White', 'coffee', 25000, 'https://images.pexels.com/photos/18281417/pexels-photo-18281417.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', ARRAY['Susu Gandum', 'Susu Almond', 'Ekstra Sloki', 'Kurang Gula'], 'Espresso ganda dengan susu bertekstur beludru halus'),
('cold-brew', 'KPP-CDB', 'Cold Brew', 'coffee', 30000, 'https://images.pexels.com/photos/38028988/pexels-photo-38028988.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', ARRAY['Vanila', 'Karamel', 'Susu Gandum', 'Kurang Es'], 'Kopi seduh dingin selama 12 jam yang halus'),
('americano', 'KPP-AME', 'Americano', 'coffee', 24000, 'https://images.pexels.com/photos/8464467/pexels-photo-8464467.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', ARRAY['Ekstra Sloki', 'Tanpa Kafein', 'Pakai Es'], 'Double shot espresso dengan air panas'),
('matcha-latte', 'TEH-MAT', 'Matcha Latte', 'tea', 32000, 'https://images.pexels.com/photos/34694990/pexels-photo-34694990.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', ARRAY['Susu Gandum', 'Susu Almond', 'Ekstra Matcha', 'Kurang Gula'], 'Teh hijau jepang organik premium dengan susu hangat'),
('chai-latte', 'TEH-CHI', 'Chai Latte', 'tea', 30000, 'https://images.pexels.com/photos/5995769/pexels-photo-5995769.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', ARRAY['Susu Gandum', 'Susu Almond', 'Ekstra Rempah', 'Kurang Gula'], 'Seduhan teh hitam dengan rempah-rempah eksotis dan susu'),
('earl-grey', 'TEH-EGY', 'Earl Grey', 'tea', 22000, 'https://images.pexels.com/photos/14415014/pexels-photo-14415014.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', ARRAY['Madu', 'Lemon', 'Susu'], 'Teh hitam dengan aroma khas jeruk bergamot'),
('almond-croissant', 'MKN-CRO', 'Kroisan Almond', 'food', 25000, 'https://images.pexels.com/photos/12176269/pexels-photo-12176269.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', ARRAY['Hangatkan'], 'Roti mentega berlapis perancis dengan isian pasta almond manis'),
('avocado-toast', 'MKN-AVO', 'Roti Panggang Alpukat', 'food', 45000, 'https://images.pexels.com/photos/27590337/pexels-photo-27590337.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', ARRAY['Tambah Telur', 'Ekstra Alpukat', 'Bebas Gluten'], 'Roti gandum panggang dengan alpukat tumbuk, lada hitam, dan chili flakes'),
('chocolate-muffin', 'MKN-MUF', 'Muffin Cokelat', 'food', 22000, 'https://images.pexels.com/photos/8017963/pexels-photo-8017963.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', ARRAY['Hangatkan'], 'Kue muffin cokelat lembut dengan taburan chocolate chips melimpah'),
('club-sandwich', 'MKN-CSW', 'Roti Lapis Club', 'food', 55000, 'https://images.pexels.com/photos/5446513/pexels-photo-5446513.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', ARRAY['Tanpa Tomat', 'Ekstra Keju', 'Bebas Gluten'], 'Sandwich tiga lapis dengan dada ayam panggang, daging asap, selada, dan mayo')
ON CONFLICT (id) DO NOTHING;

-- 3. Seed Staff Members
INSERT INTO staff_members (id, name, role, shift, status) VALUES
('STF-01', 'Marcus W.', 'Kasir Utama', 'Pagi', 'Aktif'),
('STF-02', 'Sarah K.', 'Barista', 'Pagi', 'Aktif'),
('STF-03', 'Alex T.', 'Barista', 'Sore', 'Aktif'),
('STF-04', 'Rian', 'Kasir', 'Sore', 'Aktif'),
('STF-05', 'Ani Store Manager', 'Supervisor', 'Full', 'Off')
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Shift Schedules
INSERT INTO shift_schedules (name, staff) VALUES
('Shift Pagi (07:00 - 15:00)', ARRAY['Marcus W. (Kasir)', 'Sarah K. (Barista)']),
('Shift Sore (15:00 - 23:00)', ARRAY['Rian (Kasir)', 'Alex T. (Barista)']),
('Full Time (07:00 - 18:00)', ARRAY['Ani (Supervisor / Manager)']);

-- 5. Seed Attendance Logs
INSERT INTO attendance_logs (date, name, check_in, check_out, status) VALUES
('14 Juni 2026', 'Marcus W.', '06:55', '15:05', 'Tepat Waktu'),
('14 Juni 2026', 'Sarah K.', '06:50', '15:00', 'Tepat Waktu'),
('14 Juni 2026', 'Alex T.', '15:10', '--:--', 'Terlambat (10m)'),
('14 Juni 2026', 'Rian', '14:55', '--:--', 'Tepat Waktu'),
('13 Juni 2026', 'Marcus W.', '06:58', '15:02', 'Tepat Waktu'),
('13 Juni 2026', 'Alex T.', '14:52', '23:05', 'Tepat Waktu');

-- 6. Seed Transactions
INSERT INTO transactions (id, customer, time, total, method, status, items) VALUES
('INV-2841', 'Marcus W.', 'Hari ini, 18:15', 72900, 'Tunai', 'Lunas', '[
  {
    "id": "item-1",
    "menuItem": {
      "id": "latte",
      "name": "Latte",
      "price": 28000,
      "category": "coffee"
    },
    "quantity": 2,
    "modifiers": ["Vanila"]
  },
  {
    "id": "item-2",
    "menuItem": {
      "id": "chocolate-muffin",
      "name": "Muffin Cokelat",
      "price": 22000,
      "category": "food"
    },
    "quantity": 1,
    "modifiers": ["Hangatkan"]
  }
]'::jsonb),
('INV-2840', 'Pelanggan Umum', 'Hari ini, 17:42', 55000, 'QRIS', 'Lunas', '[
  {
    "id": "item-3",
    "menuItem": {
      "id": "club-sandwich",
      "name": "Roti Lapis Club",
      "price": 55000,
      "category": "food"
    },
    "quantity": 1,
    "modifiers": []
  }
]'::jsonb),
('INV-2839', 'Ani', 'Hari ini, 16:30', 67000, 'Kartu', 'Lunas', '[
  {
    "id": "item-4",
    "menuItem": {
      "id": "matcha-latte",
      "name": "Matcha Latte",
      "price": 32000,
      "category": "tea"
    },
    "quantity": 1,
    "modifiers": ["Susu Gandum"]
  },
  {
    "id": "item-5",
    "menuItem": {
      "id": "flat-white",
      "name": "Flat White",
      "price": 25000,
      "category": "coffee"
    },
    "quantity": 1,
    "modifiers": []
  }
]'::jsonb),
('INV-2838', 'Alex T.', 'Kemarin, 20:10', 112000, 'Tunai', 'Lunas', '[]'::jsonb),
('INV-2837', 'Sarah K.', 'Kemarin, 19:05', 48000, 'QRIS', 'Lunas', '[]'::jsonb),
('INV-2836', 'Rian', '12 Juni 2026, 15:40', 95000, 'Kartu', 'Lunas', '[]'::jsonb),
('INV-2835', 'Dina', '12 Juni 2026, 12:15', 32000, 'Tunai', 'Lunas', '[]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 7. Seed Pending Orders (Meja Aktif)
INSERT INTO pending_orders (id, order_number, customer_name, table_number, discount_percent, items) VALUES
('pending-1', '2804', 'Rian', '03', 10, '[
  {
    "id": "init-1",
    "menuItem": {
      "id": "latte",
      "name": "Latte",
      "price": 28000,
      "category": "coffee"
    },
    "quantity": 2,
    "modifiers": ["Susu Gandum"],
    "notes": "Kurang Gula"
  },
  {
    "id": "init-2",
    "menuItem": {
      "id": "almond-croissant",
      "name": "Kroisan Almond",
      "price": 25000,
      "category": "food"
    },
    "quantity": 1,
    "modifiers": ["Hangatkan"]
  }
]'::jsonb),
('pending-2', '2815', 'Ani', '05', 0, '[
  {
    "id": "init-3",
    "menuItem": {
      "id": "espresso",
      "name": "Espresso",
      "price": 22000,
      "category": "coffee"
    },
    "quantity": 1,
    "modifiers": []
  },
  {
    "id": "init-4",
    "menuItem": {
      "id": "avocado-toast",
      "name": "Roti Panggang Alpukat",
      "price": 45000,
      "category": "food"
    },
    "quantity": 1,
    "modifiers": ["Tambah Telur"]
  }
]'::jsonb)
ON CONFLICT (id) DO NOTHING;
