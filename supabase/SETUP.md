# Supabase Setup Guide

## Langkah 1 — Buat Project Supabase

1. Buka [supabase.com](https://supabase.com) → New Project
2. Isi nama project: `tataring-catering`
3. Set password database (simpan baik-baik)
4. Pilih region terdekat (Singapore)
5. Tunggu project selesai dibuat (~2 menit)

## Langkah 2 — Ambil Credentials

Di dashboard Supabase → **Settings → API**:

| Variable | Lokasi |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` key (jangan di-expose ke client!) |

Copy ke file `.env.local` di root project.

## Langkah 3 — Jalankan Migration (urutan penting!)

### 001 — Schema awal
Jalankan `supabase/migrations/001_initial_schema.sql`

### 002 — Tambah kolom variants
Jalankan `supabase/migrations/002_add_variants.sql`

---

## Langkah 3b — (sudah diganti judul aslinya)

1. Di Supabase dashboard → **SQL Editor → New query**
2. Copy-paste isi file `supabase/migrations/001_initial_schema.sql`
3. Klik **Run** — pastikan tidak ada error

## Langkah 4 — Jalankan Seed Data (urutan penting!)

1. SQL Editor → New query → copy-paste `supabase/seed.sql` → **Run**
2. SQL Editor → New query → copy-paste `supabase/seed_variants.sql` → **Run**

## Langkah 5 — Buat Admin User

1. Supabase dashboard → **Authentication → Users → Add user**
2. Masukkan email & password admin
3. User ini yang akan dipakai login ke `/admin`

## Verifikasi

Setelah semua berjalan, cek di **Table Editor**:
- `packages` → harus ada 6 row
- `addons` → harus ada 5 row
- `testimonials` → harus ada 10 row
- `gallery` → harus ada 10 row
- `menu_stories` → harus ada 3 row (published)
- `blog_posts` → harus ada 5 row (3 published, 2 draft)
- `availability` → harus ada 11 row
- `site_config` → harus ada 4 row
