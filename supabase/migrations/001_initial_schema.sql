-- ============================================================
-- TATARING CATERING — Initial Schema
-- Jalankan file ini di Supabase SQL Editor
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- HELPER: auto-update updated_at
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ────────────────────────────────────────────────────────────
-- TABLE: packages
-- ────────────────────────────────────────────────────────────
CREATE TABLE packages (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT UNIQUE NOT NULL,
  name             TEXT NOT NULL,
  description      TEXT,
  category         TEXT NOT NULL
                     CHECK (category IN ('pesta_adat','wedding','arisan','kantor','birthday','custom')),
  price_per_portion INTEGER NOT NULL CHECK (price_per_portion > 0),
  min_portion      INTEGER NOT NULL DEFAULT 20,
  max_portion      INTEGER NOT NULL DEFAULT 1000,
  contents         JSONB,   -- array of string (nama menu)
  images           TEXT[],  -- array URL foto
  badge            TEXT CHECK (badge IN ('best_seller','new','promo')),
  is_active        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER packages_updated_at
  BEFORE UPDATE ON packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "packages_public_read" ON packages
  FOR SELECT USING (is_active = true);

CREATE POLICY "packages_admin_all" ON packages
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');


-- ────────────────────────────────────────────────────────────
-- TABLE: addons
-- ────────────────────────────────────────────────────────────
CREATE TABLE addons (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  price       INTEGER NOT NULL CHECK (price >= 0),
  is_active   BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE addons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "addons_public_read" ON addons
  FOR SELECT USING (is_active = true);

CREATE POLICY "addons_admin_all" ON addons
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');


-- ────────────────────────────────────────────────────────────
-- TABLE: orders
-- ────────────────────────────────────────────────────────────
CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number     TEXT UNIQUE NOT NULL,
  customer_name    TEXT NOT NULL,
  customer_phone   TEXT NOT NULL,
  customer_email   TEXT,
  event_type       TEXT,
  event_date       DATE,
  event_time       TIME,
  package_id       UUID REFERENCES packages(id) ON DELETE SET NULL,
  portion_count    INTEGER CHECK (portion_count > 0),
  addons           JSONB,  -- array of {id, name, price}
  delivery_address TEXT,
  notes            TEXT,
  estimated_total  INTEGER,
  status           TEXT NOT NULL DEFAULT 'new'
                     CHECK (status IN ('new','contacted','confirmed','done','cancelled')),
  admin_note       TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-generate order number: TTR-YYYYMMDD-NNN
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  today_str  TEXT := TO_CHAR(NOW(), 'YYYYMMDD');
  seq        INTEGER;
BEGIN
  SELECT COUNT(*) + 1
    INTO seq
    FROM orders
   WHERE order_number LIKE 'TTR-' || today_str || '-%';

  NEW.order_number := 'TTR-' || today_str || '-' || LPAD(seq::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_public_insert" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "orders_admin_all" ON orders
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');


-- ────────────────────────────────────────────────────────────
-- TABLE: testimonials
-- ────────────────────────────────────────────────────────────
CREATE TABLE testimonials (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name   TEXT NOT NULL,
  customer_photo  TEXT,
  event_type      TEXT,
  rating          INTEGER CHECK (rating BETWEEN 1 AND 5),
  review          TEXT NOT NULL,
  is_published    BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "testimonials_public_read" ON testimonials
  FOR SELECT USING (is_published = true);

CREATE POLICY "testimonials_admin_all" ON testimonials
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');


-- ────────────────────────────────────────────────────────────
-- TABLE: gallery
-- ────────────────────────────────────────────────────────────
CREATE TABLE gallery (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url     TEXT NOT NULL,
  caption       TEXT,
  event_type    TEXT,
  event_date    DATE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gallery_public_read" ON gallery
  FOR SELECT USING (true);

CREATE POLICY "gallery_admin_all" ON gallery
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');


-- ────────────────────────────────────────────────────────────
-- TABLE: menu_stories
-- ────────────────────────────────────────────────────────────
CREATE TABLE menu_stories (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  hero_image   TEXT,
  excerpt      TEXT,
  body         TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE menu_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "menu_stories_public_read" ON menu_stories
  FOR SELECT USING (is_published = true);

CREATE POLICY "menu_stories_admin_all" ON menu_stories
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');


-- ────────────────────────────────────────────────────────────
-- TABLE: availability
-- ────────────────────────────────────────────────────────────
CREATE TABLE availability (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date         DATE UNIQUE NOT NULL,
  max_slots    INTEGER NOT NULL DEFAULT 3 CHECK (max_slots > 0),
  booked_slots INTEGER NOT NULL DEFAULT 0 CHECK (booked_slots >= 0),
  is_blocked   BOOLEAN NOT NULL DEFAULT false,
  block_reason TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT booked_not_exceed_max CHECK (booked_slots <= max_slots)
);

CREATE TRIGGER availability_updated_at
  BEFORE UPDATE ON availability
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "availability_public_read" ON availability
  FOR SELECT USING (true);

CREATE POLICY "availability_admin_all" ON availability
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');


-- ────────────────────────────────────────────────────────────
-- TABLE: blog_posts
-- ────────────────────────────────────────────────────────────
CREATE TABLE blog_posts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                TEXT UNIQUE NOT NULL,
  title               TEXT NOT NULL,
  category            TEXT NOT NULL
                        CHECK (category IN ('resep','tips_event','budaya','behind_scene','promo')),
  thumbnail           TEXT,
  excerpt             TEXT,
  body                TEXT NOT NULL DEFAULT '',
  author_name         TEXT,
  author_photo        TEXT,
  read_time_minutes   INTEGER,
  meta_title          TEXT,
  meta_description    TEXT,
  og_image            TEXT,
  is_published        BOOLEAN NOT NULL DEFAULT false,
  published_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blog_posts_public_read" ON blog_posts
  FOR SELECT USING (is_published = true AND published_at <= NOW());

CREATE POLICY "blog_posts_admin_all" ON blog_posts
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');


-- ────────────────────────────────────────────────────────────
-- TABLE: site_config
-- ────────────────────────────────────────────────────────────
CREATE TABLE site_config (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_config_public_read" ON site_config
  FOR SELECT USING (true);

CREATE POLICY "site_config_admin_all" ON site_config
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');


-- ────────────────────────────────────────────────────────────
-- INDEXES untuk performa query umum
-- ────────────────────────────────────────────────────────────
CREATE INDEX idx_packages_category   ON packages (category) WHERE is_active = true;
CREATE INDEX idx_packages_slug       ON packages (slug);
CREATE INDEX idx_orders_status       ON orders (status);
CREATE INDEX idx_orders_event_date   ON orders (event_date);
CREATE INDEX idx_availability_date   ON availability (date);
CREATE INDEX idx_blog_posts_category ON blog_posts (category) WHERE is_published = true;
CREATE INDEX idx_blog_posts_slug     ON blog_posts (slug);
CREATE INDEX idx_menu_stories_slug   ON menu_stories (slug);
