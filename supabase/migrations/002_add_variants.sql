-- Tambah kolom variants ke tabel packages
-- Jalankan di Supabase SQL Editor setelah 001_initial_schema.sql

ALTER TABLE packages ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT NULL;

-- Struktur tiap item di array variants:
-- {
--   "id":                string   (slug-style, e.g. "hamoraon")
--   "name":              string   (nama tampil, e.g. "Paket Hamoraon")
--   "tagline":           string   (1 kalimat deskripsi singkat)
--   "price_per_portion": number   (harga per porsi untuk tier ini)
--   "contents":          string[] (list menu untuk tier ini)
--   "is_popular":        boolean  (tandai 1 tier sebagai rekomendasi)
-- }
