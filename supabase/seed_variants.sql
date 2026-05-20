-- ============================================================
-- TATARING — Seed Variants per Paket
-- Jalankan SETELAH 002_add_variants.sql
-- ============================================================
-- 3 tier Batak-flavored untuk semua paket:
--   Hamoraon  = Kemewahan/Luxury    → Premium
--   Hagabeon  = Keberkahan/Blessed  → Mid (paling populer)
--   Horas Mode = Festive + hemat    → Basic
-- ============================================================


-- ── 1. Paket Pesta Adat Lengkap ─────────────────────────────
UPDATE packages SET variants = '[
  {
    "id": "hamoraon",
    "name": "Hamoraon",
    "tagline": "Pesta maximum — ndang hea ada yang kurang!",
    "price_per_portion": 120000,
    "is_popular": false,
    "contents": [
      "Saksang Babi Spesial",
      "Arsik Ikan Mas Jumbo",
      "Na Niura",
      "Dali ni Horbo",
      "Lomok-lomok",
      "Manuk Napinadar",
      "Nasi Aron",
      "Sambal Andaliman Premium",
      "Tanggo-tanggo",
      "Teh Talua",
      "Air Mineral"
    ]
  },
  {
    "id": "hagabeon",
    "name": "Hagabeon",
    "tagline": "Pas di semua momen adat — tetap kelas!",
    "price_per_portion": 95000,
    "is_popular": true,
    "contents": [
      "Saksang Babi / Daging Sapi",
      "Arsik Ikan Mas",
      "Na Niura",
      "Dali ni Horbo",
      "Lomok-lomok",
      "Nasi Putih",
      "Sambal Andaliman",
      "Air Mineral"
    ]
  },
  {
    "id": "horas-mode",
    "name": "Horas Mode",
    "tagline": "Tetap meriah, dompet tetap senyum!",
    "price_per_portion": 75000,
    "is_popular": false,
    "contents": [
      "Saksang Ayam",
      "Arsik Ikan Mas",
      "Sayur Daun Ubi Tumbuk",
      "Nasi Putih",
      "Sambal Andaliman",
      "Air Mineral"
    ]
  }
]'::jsonb
WHERE slug = 'paket-pesta-adat-lengkap';


-- ── 2. Paket Wedding Premium ─────────────────────────────────
UPDATE packages SET variants = '[
  {
    "id": "hamoraon",
    "name": "Hamoraon",
    "tagline": "Wedding impian — semua detail sempurna!",
    "price_per_portion": 150000,
    "is_popular": false,
    "contents": [
      "Saksang Babi Spesial",
      "Arsik Ikan Mas Jumbo",
      "Na Niura Premium",
      "Dali ni Horbo",
      "Manuk Napinadar",
      "Tanggo-tanggo Spesial",
      "Nasi Aron",
      "Sambal Andaliman Premium",
      "Teh Talua",
      "Kue Itak Tradisional",
      "Air Mineral"
    ]
  },
  {
    "id": "hagabeon",
    "name": "Hagabeon",
    "tagline": "Sesuai adat, semua tamu puas — dijamin!",
    "price_per_portion": 120000,
    "is_popular": true,
    "contents": [
      "Saksang Spesial",
      "Arsik Ikan Mas",
      "Na Niura",
      "Dali ni Horbo",
      "Manuk Napinadar",
      "Nasi Aron",
      "Sambal Andaliman",
      "Teh Talua",
      "Air Mineral"
    ]
  },
  {
    "id": "horas-mode",
    "name": "Horas Mode",
    "tagline": "Wedding berkesan, budget lebih fleksibel",
    "price_per_portion": 95000,
    "is_popular": false,
    "contents": [
      "Saksang Sapi",
      "Arsik Ikan Mas",
      "Na Niura",
      "Nasi Putih",
      "Sambal Andaliman",
      "Air Mineral"
    ]
  }
]'::jsonb
WHERE slug = 'paket-wedding-premium';


-- ── 3. Paket Arisan Marga ────────────────────────────────────
UPDATE packages SET variants = '[
  {
    "id": "hamoraon",
    "name": "Hamoraon",
    "tagline": "Arisan marga jadi ajang pamer masakan Batak!",
    "price_per_portion": 95000,
    "is_popular": false,
    "contents": [
      "Saksang Babi / Sapi",
      "Arsik Ikan Mas",
      "Dali ni Horbo",
      "Sayur Daun Ubi Tumbuk",
      "Ikan Asin Simba",
      "Nasi Putih",
      "Sambal Tomat",
      "Kerupuk Andaliman",
      "Air Mineral"
    ]
  },
  {
    "id": "hagabeon",
    "name": "Hagabeon",
    "tagline": "Cukup untuk semua dongan sahuta!",
    "price_per_portion": 75000,
    "is_popular": true,
    "contents": [
      "Saksang Ayam",
      "Sayur Daun Ubi Tumbuk",
      "Ikan Asin Simba",
      "Nasi Putih",
      "Sambal Tomat",
      "Kerupuk Andaliman",
      "Air Mineral"
    ]
  },
  {
    "id": "horas-mode",
    "name": "Horas Mode",
    "tagline": "Simple tapi bikin kangen — cocok buat arisan rutin",
    "price_per_portion": 60000,
    "is_popular": false,
    "contents": [
      "Ayam Goreng Batak",
      "Sayur Daun Ubi",
      "Nasi Putih",
      "Sambal Tomat",
      "Air Mineral"
    ]
  }
]'::jsonb
WHERE slug = 'paket-arisan-marga';


-- ── 4. Paket Birthday Batak ──────────────────────────────────
UPDATE packages SET variants = '[
  {
    "id": "hamoraon",
    "name": "Hamoraon",
    "tagline": "Birthday yang satu ini bakal dikenang seumur hidup!",
    "price_per_portion": 110000,
    "is_popular": false,
    "contents": [
      "Ayam Goreng Andaliman Spesial",
      "Mie Gomak Creamy",
      "Na Niura Mini",
      "Dali ni Horbo",
      "Nasi Putih",
      "Es Cincau Hijau",
      "Kue Ulang Tahun Dekorasi Ulos Premium",
      "Air Mineral"
    ]
  },
  {
    "id": "hagabeon",
    "name": "Hagabeon",
    "tagline": "Fun Batak vibes — cocok buat semua usia!",
    "price_per_portion": 85000,
    "is_popular": true,
    "contents": [
      "Ayam Goreng Andaliman",
      "Mie Gomak",
      "Na Niura Mini",
      "Nasi Putih",
      "Es Cincau Hijau",
      "Kue Ulang Tahun Dekorasi Ulos",
      "Air Mineral"
    ]
  },
  {
    "id": "horas-mode",
    "name": "Horas Mode",
    "tagline": "Cukup buat happy — tetap ada cita rasa Bataknya!",
    "price_per_portion": 65000,
    "is_popular": false,
    "contents": [
      "Ayam Goreng Andaliman",
      "Mie Gomak",
      "Nasi Putih",
      "Es Cincau Hijau",
      "Air Mineral"
    ]
  }
]'::jsonb
WHERE slug = 'paket-birthday-batak';


-- ── 5. Paket Kantor Pilihan ──────────────────────────────────
UPDATE packages SET variants = '[
  {
    "id": "hamoraon",
    "name": "Hamoraon",
    "tagline": "Impress klien dan tim — catering kantor level up!",
    "price_per_portion": 85000,
    "is_popular": false,
    "contents": [
      "Nasi Kotak Premium (Ayam Goreng Andaliman / Ikan Bakar)",
      "Sayur Tumis Spesial",
      "Dali ni Horbo Mini",
      "Sambal Andaliman",
      "Kerupuk",
      "Buah Potong",
      "Minuman Botol",
      "Air Mineral"
    ]
  },
  {
    "id": "hagabeon",
    "name": "Hagabeon",
    "tagline": "Tepat waktu, enak, budget masuk akal",
    "price_per_portion": 65000,
    "is_popular": true,
    "contents": [
      "Nasi Kotak (Ayam Goreng / Ikan Bakar)",
      "Sayur Tumis",
      "Sambal Andaliman",
      "Kerupuk",
      "Buah Potong",
      "Air Mineral"
    ]
  },
  {
    "id": "horas-mode",
    "name": "Horas Mode",
    "tagline": "Praktis buat meeting harian — tetap ada rasa Bataknya",
    "price_per_portion": 50000,
    "is_popular": false,
    "contents": [
      "Nasi Kotak (Ayam Goreng)",
      "Sayur Tumis",
      "Kerupuk",
      "Air Mineral"
    ]
  }
]'::jsonb
WHERE slug = 'paket-kantor-pilihan';


-- ── 6. Paket Custom Hemat ────────────────────────────────────
UPDATE packages SET variants = '[
  {
    "id": "hamoraon",
    "name": "Hamoraon",
    "tagline": "Custom full — semua menu pilihan kamu, tanpa batas!",
    "price_per_portion": 100000,
    "is_popular": false,
    "contents": [
      "Menu sepenuhnya sesuai request",
      "Konsultasi menu gratis (unlimited revision)",
      "Plating premium + dekorasi meja",
      "Tim pramusaji tersedia",
      "Fleksibel porsi & budget"
    ]
  },
  {
    "id": "hagabeon",
    "name": "Hagabeon",
    "tagline": "Custom smart — hemat tanpa korban kualitas",
    "price_per_portion": 70000,
    "is_popular": true,
    "contents": [
      "Menu sesuai request (maks. 5 pilihan)",
      "Konsultasi menu gratis",
      "Penyajian standar",
      "Fleksibel porsi & budget"
    ]
  },
  {
    "id": "horas-mode",
    "name": "Horas Mode",
    "tagline": "Budget ketat? Tenang, tetap bisa pesta Batak!",
    "price_per_portion": 55000,
    "is_popular": false,
    "contents": [
      "Menu dasar pilihan dari daftar kami",
      "Konsultasi via WhatsApp",
      "Penyajian standar",
      "Minimum 20 porsi"
    ]
  }
]'::jsonb
WHERE slug = 'paket-custom-hemat';
