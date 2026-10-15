-- Add new categories: Pintu and Custom
INSERT INTO categories (name, slug, description, is_active) VALUES
  ('Pintu', 'pintu', 'Pintu dan aksesoris pintu', true),
  ('Custom', 'custom', 'Produk custom sesuai permintaan', true)
ON CONFLICT (slug) DO NOTHING;

-- Note: We keep the old categories (Kamar Tidur, Ruang Kerja) in the database
-- so existing products remain valid. Admin can update product categories as needed.
