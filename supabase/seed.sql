-- Rose City Beauty seed data

-- Categories
INSERT INTO categories (id, name, slug, description, is_active) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Skincare', 'skincare', 'Face and skin care products', true),
  ('10000000-0000-0000-0000-000000000002', 'Makeup', 'makeup', 'Professional makeup products', true),
  ('10000000-0000-0000-0000-000000000003', 'Body Care', 'body-care', 'Body lotions and moisturizers', true),
  ('10000000-0000-0000-0000-000000000004', 'Hair Care', 'hair-care', 'Hair oils and treatments', true),
  ('10000000-0000-0000-0000-000000000005', 'Fragrance', 'fragrance', 'Perfumes and fragrances', true);

-- Products
INSERT INTO products (id, name, slug, description, price, compare_at_price, type, category_id, sku, stock_quantity, is_active, is_featured) VALUES
  ('20000000-0000-0000-0000-000000000001', 'Rose City Daily Defence SPF50', 'rose-city-daily-defence-spf50', 'Broad-spectrum SPF50 sunscreen that protects against harsh African sun. Lightweight, non-comedogenic formula with aloe vera.', 219.00, null, 'physical', '10000000-0000-0000-0000-000000000001', 'SPF50-001', 50, true, true),
  ('20000000-0000-0000-0000-000000000002', 'Rose City Professional Makeup Brush Set', 'rose-city-professional-makeup-brush-set', 'Complete professional makeup brush set. Premium synthetic bristles for flawless application.', 349.00, null, 'physical', '10000000-0000-0000-0000-000000000002', 'BRUSH-001', 30, true, true),
  ('20000000-0000-0000-0000-000000000003', 'Rose City Shea Body Lotion', 'rose-city-shea-body-lotion', 'Rich, nourishing shea body lotion for deep hydration. Leaves skin feeling soft and smooth all day.', 159.00, null, 'physical', '10000000-0000-0000-0000-000000000003', 'LOTION-001', 40, true, true),
  ('20000000-0000-0000-0000-000000000004', 'Rose City Hyaluronic Acid Serum', 'rose-city-hyaluronic-acid-serum', 'Advanced hyaluronic acid serum for intense hydration. Plumps and smooths for a youthful glow.', 299.00, null, 'physical', '10000000-0000-0000-0000-000000000001', 'SERUM-001', 35, true, true),
  ('20000000-0000-0000-0000-000000000005', 'Rose City Argan Hair Oil', 'rose-city-argan-hair-oil', 'Pure argan oil for silky, nourished hair. Restores shine and reduces frizz for all hair types.', 189.00, null, 'physical', '10000000-0000-0000-0000-000000000004', 'HAIR-001', 45, true, true),
  ('20000000-0000-0000-0000-000000000006', 'Rose City Eau de Parfum – Free State Bloom', 'rose-city-eau-de-parfum-free-state-bloom', 'A captivating floral fragrance inspired by the Free State landscape. Notes of freesia, jasmine, and rose.', 399.00, null, 'physical', '10000000-0000-0000-0000-000000000005', 'PERFUME-001', 20, true, true);

-- Product Images (local assets)
INSERT INTO product_images (product_id, url, alt_text, position) VALUES
  ('20000000-0000-0000-0000-000000000001', '/sunscreen-300x300.jpg', 'Rose City Daily Defence SPF50', 0),
  ('20000000-0000-0000-0000-000000000002', '/makeup-brush2-300x300.jpg', 'Rose City Professional Makeup Brush Set', 0),
  ('20000000-0000-0000-0000-000000000003', '/body-lotion-300x300.jpg', 'Rose City Shea Body Lotion', 0),
  ('20000000-0000-0000-0000-000000000004', '/face-serum-300x300.jpg', 'Rose City Hyaluronic Acid Serum', 0),
  ('20000000-0000-0000-0000-000000000005', '/hair-oil-300x300.jpg', 'Rose City Argan Hair Oil', 0),
  ('20000000-0000-0000-0000-000000000006', '/perfume-300x300.jpg', 'Rose City Eau de Parfum – Free State Bloom', 0);

-- Store settings (ZAR) - upsert in case migration already created defaults
INSERT INTO store_settings (key, value) VALUES
  ('general', '{"name": "Rose City Beauty", "currency": "ZAR", "currencySymbol": "R", "taxRate": 15, "freeShippingThreshold": 500}'),
  ('payments', '{"stripe": false, "paypal": false, "cod": true}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
