-- ============================================================
-- TATARING CATERING — Seed Data (Development)
-- Jalankan SETELAH 001_initial_schema.sql
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- SITE CONFIG
-- ────────────────────────────────────────────────────────────
INSERT INTO site_config (key, value) VALUES
  ('admin_whatsapp',    '628123456789'),
  ('default_max_slots', '3'),
  ('operational_hours', 'Senin–Sabtu 08.00–17.00 WIB'),
  ('address',           'Jl. Sisingamangaraja No. 88, Medan, Sumatera Utara');


-- ────────────────────────────────────────────────────────────
-- PACKAGES
-- ────────────────────────────────────────────────────────────
INSERT INTO packages (slug, name, description, category, price_per_portion, min_portion, max_portion, contents, images, badge, is_active) VALUES
(
  'paket-pesta-adat-lengkap',
  'Paket Pesta Adat Lengkap',
  'Paket all-in untuk pesta adat Batak yang autentik. Mencakup hidangan wajib mulai dari saksang, arsik, hingga na niura — semua dibuat dengan resep turun-temurun.',
  'pesta_adat',
  95000,
  50, 500,
  '["Saksang Babi / Daging Sapi", "Arsik Ikan Mas", "Na Niura", "Dali ni Horbo", "Lomok-lomok", "Nasi Putih", "Sambal Andaliman", "Air Mineral"]',
  ARRAY[
    'https://picsum.photos/seed/pesta-adat-1/800/600',
    'https://picsum.photos/seed/pesta-adat-2/800/600',
    'https://picsum.photos/seed/pesta-adat-3/800/600'
  ],
  'best_seller',
  true
),
(
  'paket-wedding-premium',
  'Paket Wedding Premium',
  'Paket pernikahan adat Batak prestisius. Lengkap dengan hidangan utama, lauk pendamping, dan dessert tradisional. Cocok untuk 100–500 tamu undangan.',
  'wedding',
  120000,
  100, 500,
  '["Saksang Spesial", "Arsik Ikan Mas Jumbo", "Na Niura", "Dali ni Horbo", "Manuk Napinadar", "Tanggo-tanggo", "Nasi Aron", "Sambal Andaliman", "Teh Talua", "Kue Itak"]',
  ARRAY[
    'https://picsum.photos/seed/wedding-1/800/600',
    'https://picsum.photos/seed/wedding-2/800/600',
    'https://picsum.photos/seed/wedding-3/800/600'
  ],
  'best_seller',
  true
),
(
  'paket-arisan-marga',
  'Paket Arisan Marga',
  'Sajian hangat untuk pertemuan arisan marga. Menu pilihan yang menghadirkan cita rasa rumahan — pas untuk 20–100 orang dengan budget terjangkau.',
  'arisan',
  75000,
  20, 100,
  '["Saksang Ayam", "Sayur Daun Ubi Tumbuk", "Ikan Asin Simba", "Nasi Putih", "Sambal Tomat", "Kerupuk Andaliman"]',
  ARRAY[
    'https://picsum.photos/seed/arisan-1/800/600',
    'https://picsum.photos/seed/arisan-2/800/600'
  ],
  'promo',
  true
),
(
  'paket-birthday-batak',
  'Paket Birthday Batak',
  'Rayakan ulang tahun dengan sentuhan Batak yang meriah! Paket spesial dengan dekorasi meja makan bertema budaya dan menu pilihan anak muda.',
  'birthday',
  85000,
  20, 200,
  '["Ayam Goreng Andaliman", "Mie Gomak", "Na Niura Mini", "Nasi Putih", "Es Cincau Hijau", "Kue Ulang Tahun Dekorasi Ulos"]',
  ARRAY[
    'https://picsum.photos/seed/birthday-1/800/600',
    'https://picsum.photos/seed/birthday-2/800/600'
  ],
  'new',
  true
),
(
  'paket-kantor-pilihan',
  'Paket Kantor Pilihan',
  'Solusi catering meeting dan acara kantor. Praktis, tepat waktu, dan tetap autentik. Tersedia dalam box atau prasmanan mini.',
  'kantor',
  65000,
  20, 300,
  '["Nasi Kotak dengan Ayam Goreng / Ikan Bakar", "Sayur Tumis", "Sambal Andaliman", "Kerupuk", "Buah Potong", "Air Mineral"]',
  ARRAY[
    'https://picsum.photos/seed/kantor-1/800/600',
    'https://picsum.photos/seed/kantor-2/800/600'
  ],
  NULL,
  true
),
(
  'paket-custom-hemat',
  'Paket Custom Hemat',
  'Buat paket sesuai kebutuhanmu. Pilih menu, tentukan porsi, kami sesuaikan dengan budget. Konsultasi gratis via WhatsApp!',
  'custom',
  55000,
  20, 1000,
  '["Menu sesuai request customer", "Konsultasi menu gratis", "Fleksibel porsi & budget"]',
  ARRAY[
    'https://picsum.photos/seed/custom-1/800/600'
  ],
  NULL,
  true
);


-- ────────────────────────────────────────────────────────────
-- ADD-ONS
-- ────────────────────────────────────────────────────────────
INSERT INTO addons (name, description, price, is_active) VALUES
  ('Sambal Matah Extra',      'Sambal matah segar dengan campuran andaliman khas Batak', 15000, true),
  ('Tuak Dingin (per botol)', 'Minuman tradisional Batak, dingin segar untuk pesta adat', 25000, true),
  ('Kue-kue Tradisional',     'Paket kue Batak: itak, pohul-pohul, dan sasagun — cocok untuk acara adat', 35000, true),
  ('Extra Nasi (per 10 porsi)','Tambahan nasi putih untuk porsi lebih', 10000, true),
  ('Dessert Buah Potong',     'Buah segar potong aneka pilihan, segar & instagrammable', 20000, true);


-- ────────────────────────────────────────────────────────────
-- TESTIMONIALS
-- ────────────────────────────────────────────────────────────
INSERT INTO testimonials (customer_name, customer_photo, event_type, rating, review, is_published, created_at) VALUES
(
  'Hotma Sitanggang',
  'https://picsum.photos/seed/hotma/200/200',
  'wedding',
  5,
  'Mantap kali! Saksang nya persis kayak buatan inang di kampung. Tamu-tamu bilang ini catering terenak yang pernah mereka rasain. Mauliate TATARING!',
  true,
  NOW() - INTERVAL '30 days'
),
(
  'Riani Nababan',
  'https://picsum.photos/seed/riani/200/200',
  'pesta_adat',
  5,
  'Horas! Paket Pesta Adat Lengkap bener-bener lengkap dan autentik. Tepat waktu, porsi pas, dan rasa andaliman-nya juara. Highly recommended!',
  true,
  NOW() - INTERVAL '25 days'
),
(
  'Biston Pardede',
  'https://picsum.photos/seed/biston/200/200',
  'arisan',
  5,
  'Sudah 3x pakai TATARING buat arisan marga kami. Selalu konsisten enak dan pelayanan ramah. Kami pasti akan pesan lagi!',
  true,
  NOW() - INTERVAL '20 days'
),
(
  'Yanti Siregar',
  'https://picsum.photos/seed/yanti/200/200',
  'birthday',
  5,
  'Birthday party adik saya jadi berkesan banget! Menu Batak-nya cocok di lidah semua tamu, young dan old. Dekorasi meja makannya cantik juga!',
  true,
  NOW() - INTERVAL '18 days'
),
(
  'Martunas Lumban Tobing',
  'https://picsum.photos/seed/martunas/200/200',
  'kantor',
  4,
  'Pesan untuk meeting kantor 50 orang. Delivery on time, nasi kotaknya lengkap dan enak. Ada sedikit kendala di jadwal awal tapi langsung direspons cepat.',
  true,
  NOW() - INTERVAL '15 days'
),
(
  'Desi Manullang',
  'https://picsum.photos/seed/desi/200/200',
  'wedding',
  5,
  'Na niura dan arsik di pernikahan kami jadi highlight malam itu. Banyak tamu yang nanya cateringnya dari mana. TATARING memang tidak mengecewakan!',
  true,
  NOW() - INTERVAL '12 days'
),
(
  'Sahala Panggabean',
  'https://picsum.photos/seed/sahala/200/200',
  'pesta_adat',
  5,
  'Dali ni horbo-nya! Susah cari catering yang bisa buat dali ni horbo seenak ini di Medan. TATARING tahu betul cita rasa Batak yang sesungguhnya.',
  true,
  NOW() - INTERVAL '10 days'
),
(
  'Tiona Sihombing',
  'https://picsum.photos/seed/tiona/200/200',
  'birthday',
  4,
  'Paket Birthday Batak-nya unik dan beda dari catering biasa. Teman-teman saya yang non-Batak pun suka banget sama mie gomak dan ayam andaliman-nya.',
  true,
  NOW() - INTERVAL '7 days'
),
(
  'Jefri Tampubolon',
  'https://picsum.photos/seed/jefri/200/200',
  'arisan',
  5,
  'Respon admin cepet, harga transparan, makanan enak. Trifecta sempurna buat catering! Arisan marga kami selalu happy pakai TATARING.',
  true,
  NOW() - INTERVAL '5 days'
),
(
  'Novita Hutasoit',
  'https://picsum.photos/seed/novita/200/200',
  'kantor',
  5,
  'Tim kantor kami sudah langganan TATARING untuk semua event. Kualitasnya konsisten dan selalu ada inovasi menu baru. Salut!',
  true,
  NOW() - INTERVAL '2 days'
);


-- ────────────────────────────────────────────────────────────
-- GALLERY
-- ────────────────────────────────────────────────────────────
INSERT INTO gallery (image_url, caption, event_type, event_date, display_order) VALUES
  ('https://picsum.photos/seed/gal-wed-1/1200/800', 'Pernikahan Hotma & Riani — 300 tamu, Medan Convention Center', 'wedding',    '2026-04-15', 1),
  ('https://picsum.photos/seed/gal-wed-2/1200/800', 'Wedding adat lengkap dengan sajian saksang spesial', 'wedding',             '2026-04-15', 2),
  ('https://picsum.photos/seed/gal-adat-1/1200/800','Pesta Adat Margondang — 200 tamu, Kecamatan Sibolga', 'pesta_adat',         '2026-03-22', 3),
  ('https://picsum.photos/seed/gal-adat-2/1200/800','Sajian prasmanan pesta adat: saksang, arsik, dali ni horbo', 'pesta_adat',  '2026-03-22', 4),
  ('https://picsum.photos/seed/gal-arisan-1/1200/800','Arisan Marga Pardede — 80 tamu, Medan Kota', 'arisan',                   '2026-04-05', 5),
  ('https://picsum.photos/seed/gal-bday-1/1200/800','Birthday Party Desi — 50 tamu, tema Batak Modern', 'birthday',             '2026-04-20', 6),
  ('https://picsum.photos/seed/gal-kantor-1/1200/800','Corporate Lunch PT Simorangkir — 120 box', 'kantor',                     '2026-05-01', 7),
  ('https://picsum.photos/seed/gal-food-1/1200/800','Na niura — detail plating untuk wedding premium', 'wedding',               '2026-04-15', 8),
  ('https://picsum.photos/seed/gal-food-2/1200/800','Arsik ikan mas dalam penyajian tradisional', 'pesta_adat',                 '2026-03-22', 9),
  ('https://picsum.photos/seed/gal-food-3/1200/800','Setup prasmanan outdoor untuk 250 tamu', 'wedding',                       '2026-02-14', 10);


-- ────────────────────────────────────────────────────────────
-- MENU STORIES
-- ────────────────────────────────────────────────────────────
INSERT INTO menu_stories (slug, title, hero_image, excerpt, body, is_published) VALUES
(
  'filosofi-saksang',
  'Saksang: Lebih dari Sekadar Masakan',
  'https://picsum.photos/seed/story-saksang/1200/600',
  'Di balik setiap porsi saksang tersimpan filosofi mendalam tentang kebersamaan dan rasa syukur masyarakat Batak Toba.',
  '## Asal-usul Saksang

Saksang bukan sekadar masakan — ia adalah simbol. Dalam setiap acara adat Batak, mulai dari pernikahan hingga upacara kematian, saksang hadir sebagai tanda penghormatan dan kebersamaan.

Terbuat dari daging yang dimasak bersama darah dan aneka rempah seperti andaliman, kunyit, dan jahe, saksang memiliki cita rasa yang kaya dan khas — tidak bisa ditemukan di tempat lain.

## Makna Filosofis

Dalam tradisi Batak, saksang yang dihidangkan dalam pesta adat memiliki makna simbolis: persatuan keluarga besar (marga) dan penerimaan anggota baru ke dalam komunitas.

## Di TATARING

Kami membuat saksang dengan resep turun-temurun dari inang kami di Samosir. Setiap bumbu dipilih dengan cermat, dimasak dengan api kecil dalam waktu lama untuk menghasilkan cita rasa yang tidak bisa kamu temukan di sembarang tempat.',
  true
),
(
  'arsik-ikan-mas',
  'Arsik: Kesederhanaan yang Agung',
  'https://picsum.photos/seed/story-arsik/1200/600',
  'Ikan mas yang dimasak dengan kunyit, andaliman, dan rempah khas Tapanuli — arsik adalah bukti bahwa kesederhanaan bisa menjadi karya seni.',
  '## Tentang Arsik

Arsik adalah salah satu masakan ikonik Batak Toba. Ikan mas yang segar dimasak dengan bumbu kuning — kunyit, bawang, kemiri, dan yang paling khas: andaliman (merica Batak).

Proses memasaknya unik: dimulai dengan bara api besar, lalu dikecilkan perlahan hingga kuah menyusut dan bumbu meresap sempurna ke dalam ikan.

## Rempah Andaliman

Andaliman adalah bintang di balik arsik. Rempah langka yang hanya tumbuh di dataran tinggi Tapanuli ini memberikan sensasi kebas yang khas — berbeda dari merica biasa.

## Di Acara Adat

Dalam tradisi Batak, arsik disajikan utuh (ikan tidak dipotong) sebagai simbol keutuhan dan keberkahan.',
  true
),
(
  'dali-ni-horbo',
  'Dali ni Horbo: Keju Asli Batak',
  'https://picsum.photos/seed/story-dali/1200/600',
  'Banyak yang tidak tahu bahwa Batak punya "keju" sendiri. Dali ni Horbo adalah susu kerbau yang difermentasi hingga mengeras — gurih, creamy, dan penuh tradisi.',
  '## Apa itu Dali ni Horbo?

Dali ni Horbo secara harfiah berarti "susu kerbau" dalam bahasa Batak. Ini adalah olahan susu kerbau yang dipanaskan hingga mengental dan mengeras, menciptakan tekstur mirip tofu atau paneer.

## Proses Pembuatan

Susu kerbau segar dipanaskan dalam kuali tanah liat, diaduk perlahan sambil ditambahkan sedikit asam. Proses ini membutuhkan kesabaran dan keahlian — tidak bisa terburu-buru.

## Rasa dan Penyajian

Dali ni Horbo memiliki rasa gurih susu yang kuat dengan tekstur kenyal. Biasa disajikan dengan kecap manis dan cabe rawit, atau dimasak dalam kuah arsik.',
  true
);


-- ────────────────────────────────────────────────────────────
-- BLOG POSTS (draft)
-- ────────────────────────────────────────────────────────────
INSERT INTO blog_posts (slug, title, category, thumbnail, excerpt, body, author_name, read_time_minutes, meta_title, meta_description, is_published, published_at) VALUES
(
  'filosofi-saksang-tradisi-batak',
  'Filosofi Saksang dalam Tradisi Batak',
  'budaya',
  'https://picsum.photos/seed/blog-saksang/1200/630',
  'Saksang bukan sekadar masakan — ia adalah simbol kebersamaan dan rasa syukur yang telah diwariskan selama ratusan tahun dalam budaya Batak.',
  '# Filosofi Saksang dalam Tradisi Batak

Pernahkah kamu bertanya-tanya mengapa saksang selalu hadir di setiap pesta adat Batak?

## Lebih dari Sekadar Makanan

Dalam masyarakat Batak, makanan bukan hanya soal perut. Setiap hidangan yang disajikan dalam acara adat menyimpan makna dan pesan tersendiri...

[Konten lengkap akan ditambahkan oleh admin]',
  'Tim TATARING',
  5,
  'Filosofi Saksang dalam Tradisi Batak | TATARING CATERING',
  'Pelajari makna filosofis di balik saksang — hidangan wajib pesta adat Batak yang penuh simbolisme dan cerita.',
  true,
  NOW() - INTERVAL '10 days'
),
(
  'tips-memilih-paket-catering-pesta-adat',
  '5 Tips Memilih Paket Catering untuk Pesta Adat Batak',
  'tips_event',
  'https://picsum.photos/seed/blog-tips/1200/630',
  'Pesta adat Batak yang sukses dimulai dari pilihan catering yang tepat. Ini 5 hal yang wajib kamu perhatikan sebelum pesan.',
  '# 5 Tips Memilih Paket Catering untuk Pesta Adat Batak

Merencanakan pesta adat Batak bukan perkara mudah. Selain mempersiapkan prosesi adat, urusan makanan jadi salah satu hal yang paling krusial...

## 1. Pastikan Menunya Autentik

Catering yang baik untuk pesta adat harus menyediakan menu-menu wajib: saksang, arsik, na niura, dan dali ni horbo...

[Konten lengkap akan ditambahkan oleh admin]',
  'Tim TATARING',
  7,
  '5 Tips Memilih Catering Pesta Adat Batak | TATARING',
  'Panduan lengkap memilih catering untuk pesta adat Batak — dari keaslian menu hingga kapasitas porsi dan ketepatan waktu.',
  true,
  NOW() - INTERVAL '7 days'
),
(
  'menu-wajib-pernikahan-batak',
  '7 Menu Wajib di Acara Pernikahan Batak',
  'budaya',
  'https://picsum.photos/seed/blog-wedding/1200/630',
  'Pernikahan Batak tanpa menu lengkap rasanya kurang afdal. Ini 7 hidangan yang wajib hadir di pesta pernikahan adat Batak.',
  '# 7 Menu Wajib di Acara Pernikahan Batak

Pernikahan adat Batak adalah salah satu perayaan terbesar dan paling sakral. Dan makanan adalah bagian yang tidak terpisahkan dari perayaan ini...

[Konten lengkap akan ditambahkan oleh admin]',
  'Tim TATARING',
  6,
  '7 Menu Wajib Pernikahan Batak | TATARING CATERING',
  'Daftar lengkap hidangan wajib di pesta pernikahan adat Batak beserta makna filosofis di balik setiap sajian.',
  true,
  NOW() - INTERVAL '3 days'
),
(
  'mengenal-andaliman-merica-batak',
  'Mengenal Andaliman, Si Merica Ajaib dari Tapanuli',
  'budaya',
  'https://picsum.photos/seed/blog-andaliman/1200/630',
  'Andaliman adalah rempah langka yang hanya tumbuh di dataran tinggi Tapanuli. Inilah rahasia di balik cita rasa khas masakan Batak yang tidak tertandingi.',
  '# Mengenal Andaliman, Si Merica Ajaib dari Tapanuli

Kalau kamu pernah makan masakan Batak dan merasakan sensasi kebas-segar yang unik di lidah, itulah andaliman bekerja...

[Konten lengkap akan ditambahkan oleh admin]',
  'Tim TATARING',
  5,
  'Andaliman Merica Batak Tapanuli | TATARING CATERING',
  'Kenali andaliman, rempah khas Tapanuli yang menjadi rahasia kelezatan masakan Batak — dari sejarah hingga cara penggunaannya.',
  false,
  NULL
),
(
  'cara-hitung-porsi-catering-100-tamu',
  'Cara Mudah Hitung Porsi Catering untuk 100+ Tamu',
  'tips_event',
  'https://picsum.photos/seed/blog-porsi/1200/630',
  'Jangan sampai kurang atau malah kebanyakan! Ini rumus praktis menghitung porsi catering yang tepat untuk eventmu.',
  '# Cara Mudah Hitung Porsi Catering untuk 100+ Tamu

Salah satu kebingungan terbesar saat merencanakan event adalah: berapa porsi yang harus dipesan?...

[Konten lengkap akan ditambahkan oleh admin]',
  'Tim TATARING',
  4,
  'Cara Hitung Porsi Catering | TATARING CATERING',
  'Rumus praktis menghitung porsi catering yang tepat agar tidak kurang dan tidak mubazir — panduan untuk 50 hingga 1000 tamu.',
  false,
  NULL
);


-- ────────────────────────────────────────────────────────────
-- AVAILABILITY (contoh data: beberapa tanggal ke depan)
-- ────────────────────────────────────────────────────────────
INSERT INTO availability (date, max_slots, booked_slots, is_blocked, block_reason) VALUES
  -- Tanggal hampir penuh
  (CURRENT_DATE + 7,  3, 2, false, NULL),
  (CURRENT_DATE + 14, 3, 2, NULL,  NULL),
  (CURRENT_DATE + 21, 3, 2, NULL,  NULL),
  -- Tanggal fully booked
  (CURRENT_DATE + 8,  3, 3, false, NULL),
  (CURRENT_DATE + 15, 3, 3, false, NULL),
  -- Tanggal blocked (libur)
  (CURRENT_DATE + 10, 3, 0, true, 'Libur Nasional'),
  (CURRENT_DATE + 25, 3, 0, true, 'Internal Event'),
  -- Tanggal dengan 1 booking
  (CURRENT_DATE + 5,  3, 1, false, NULL),
  (CURRENT_DATE + 12, 3, 1, false, NULL),
  (CURRENT_DATE + 30, 3, 1, false, NULL),
  (CURRENT_DATE + 45, 3, 1, false, NULL);
