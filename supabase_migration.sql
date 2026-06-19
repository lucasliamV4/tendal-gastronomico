-- ============================================================
-- Migration: Add editable text columns to site_config
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================

-- 1. Add new text columns with defaults matching current hardcoded values
ALTER TABLE site_config
  ADD COLUMN IF NOT EXISTS hero_title TEXT DEFAULT 'Almoço e tranquilidade na Lapa: brasa, ambiente arborizado e chopp artesanal próprio.',
  ADD COLUMN IF NOT EXISTS hero_subtitle TEXT DEFAULT 'Dentro do Centro Cultural Tendal da Lapa. Carne grelhada no charbroiler, arroz que muda toda semana, e um patio pra voce comer sem pressa.',
  ADD COLUMN IF NOT EXISTS menu_description TEXT DEFAULT 'Nosso tradicional Prato Feito acompanha arroz branco soltinho, feijão temperado com aquele gostinho caseiro, salada fresca, legumes salteados na manteiga e a proteína da sua escolha. Tudo preparado com ingredientes selecionados e o inconfundível sabor da brasa!',
  ADD COLUMN IF NOT EXISTS menu_schedule_text TEXT DEFAULT 'PF servido de terça a sexta, das 11h30 às 15h.';

-- 2. Enable RLS on all relevant tables (if not already enabled)
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;

-- 3. PUBLIC READ policies (anyone can read the site content)
-- Drop first to avoid "already exists" errors, then recreate
DROP POLICY IF EXISTS "Public can read site_config" ON site_config;
CREATE POLICY "Public can read site_config"
  ON site_config FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can read site_images" ON site_images;
CREATE POLICY "Public can read site_images"
  ON site_images FOR SELECT
  USING (true);

-- 4. BLOCK all writes from anon role (no one can modify via public API key)
-- Only service_role or authenticated admin users can write.

-- Remove any existing permissive write policies that might exist
DROP POLICY IF EXISTS "Allow insert site_config" ON site_config;
DROP POLICY IF EXISTS "Allow update site_config" ON site_config;
DROP POLICY IF EXISTS "Allow delete site_config" ON site_config;
DROP POLICY IF EXISTS "Allow insert site_images" ON site_images;
DROP POLICY IF EXISTS "Allow update site_images" ON site_images;
DROP POLICY IF EXISTS "Allow delete site_images" ON site_images;

-- Drop existing authenticated policies to avoid conflicts
DROP POLICY IF EXISTS "Authenticated can insert site_config" ON site_config;
DROP POLICY IF EXISTS "Authenticated can update site_config" ON site_config;
DROP POLICY IF EXISTS "Authenticated can insert site_images" ON site_images;
DROP POLICY IF EXISTS "Authenticated can update site_images" ON site_images;
DROP POLICY IF EXISTS "Authenticated can delete site_images" ON site_images;

-- Create restrictive write policies: only authenticated users can write
CREATE POLICY "Authenticated can insert site_config"
  ON site_config FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update site_config"
  ON site_config FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can insert site_images"
  ON site_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update site_images"
  ON site_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete site_images"
  ON site_images FOR DELETE
  TO authenticated
  USING (true);

-- 5. Storage: ensure the site-images bucket exists and is public for reads
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('site-images', 'site-images', true, 52428800)
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 52428800;

-- Storage policies for the site-images bucket
-- Drop first, then recreate
DROP POLICY IF EXISTS "Public read site-images" ON storage.objects;
CREATE POLICY "Public read site-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-images');

DROP POLICY IF EXISTS "Auth upload site-images" ON storage.objects;
CREATE POLICY "Auth upload site-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-images');

DROP POLICY IF EXISTS "Auth update site-images" ON storage.objects;
CREATE POLICY "Auth update site-images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-images');

DROP POLICY IF EXISTS "Auth delete site-images" ON storage.objects;
CREATE POLICY "Auth delete site-images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-images');

-- ============================================================
-- TESTEMUNHOS SECTION — add config columns
-- ============================================================
ALTER TABLE site_config
  ADD COLUMN IF NOT EXISTS testemunhos_visible boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS testemunhos_title text DEFAULT 'Quem já foi',
  ADD COLUMN IF NOT EXISTS testemunhos_subtitle text DEFAULT 'O que os clientes falam.';
