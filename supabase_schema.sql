-- ============================================================
-- FULL SCHEMA MIGRATION SCRIPT FOR NEW SUPABASE PROJECT
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================

-- 1. Create site_config table
CREATE TABLE IF NOT EXISTS public.site_config (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  whatsapp_number text NOT NULL DEFAULT '5511995120441',
  whatsapp_default_message text NOT NULL DEFAULT 'Olá! Gostaria de fazer um pedido.',
  business_name text NOT NULL DEFAULT 'Tendal Gastronomia',
  address_street text NOT NULL DEFAULT 'Rua Guaicurus, 1100',
  address_city text NOT NULL DEFAULT 'São Paulo',
  address_state text NOT NULL DEFAULT 'SP',
  address_postal_code text NOT NULL DEFAULT '',
  address_neighborhood text NOT NULL DEFAULT 'Lapa',
  google_maps_url text NOT NULL DEFAULT 'https://maps.google.com',
  google_maps_embed_url text NOT NULL DEFAULT '',
  instagram_url text,
  meta_pixel_id text,
  ga4_measurement_id text,
  gtm_id text,
  google_ads_conversion_id text,
  google_ads_conversion_label text,
  reference_landmark text NOT NULL DEFAULT 'Centro Cultural Tendal da Lapa',
  reference_distance text NOT NULL DEFAULT '60 metros do Poupa Tempo',
  hero_title text DEFAULT 'Almoço e tranquilidade na Lapa: brasa, ambiente arborizado e chopp artesanal próprio.',
  hero_subtitle text DEFAULT 'Dentro do Centro Cultural Tendal da Lapa. Carne grelhada no charbroiler, arroz que muda toda semana, e um patio pra voce comer sem pressa.',
  menu_description text DEFAULT 'Nosso tradicional Prato Feito acompanha arroz branco soltinho, feijão temperado com aquele gostinho caseiro, salada fresca, legumes salteados na manteiga e a proteína da sua escolha. Tudo preparado com ingredientes selecionados e o inconfundível sabor da brasa!',
  menu_schedule_text text DEFAULT 'PF servido de terça a sexta, das 11h30 às 15h.',
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Insert initial config if empty
INSERT INTO public.site_config (id) 
SELECT gen_random_uuid() 
WHERE NOT EXISTS (SELECT 1 FROM public.site_config);

-- 2. Create site_images table
CREATE TABLE IF NOT EXISTS public.site_images (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_key text NOT NULL UNIQUE,
  storage_path text,
  alt_text text,
  url text NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 3. Create menu_items table
CREATE TABLE IF NOT EXISTS public.menu_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price_cents integer NOT NULL,
  image_slot_key text,
  category text NOT NULL,
  active boolean DEFAULT true NOT NULL,
  display_order integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Insert base menu items (Proteins)
INSERT INTO public.menu_items (name, price_cents, category, display_order)
VALUES 
  ('Espetinho de Carne', 2990, 'Prato Feito', 1),
  ('Espetinho de Frango', 2990, 'Prato Feito', 2),
  ('Espetinho Misto', 2990, 'Prato Feito', 3),
  ('Espetinho de Linguiça', 2990, 'Prato Feito', 4),
  ('Filé de Frango', 2990, 'Prato Feito', 5),
  ('Contra-Filé', 3590, 'Prato Feito', 6),
  ('Bisteca Suína', 2990, 'Prato Feito', 7),
  ('Calabresa', 2990, 'Prato Feito', 8);

-- 4. Create promotions table
CREATE TABLE IF NOT EXISTS public.promotions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  active boolean DEFAULT false NOT NULL,
  title text NOT NULL,
  headline text NOT NULL,
  description text NOT NULL,
  badge_text text NOT NULL,
  eligibility_text text NOT NULL,
  cta_button_text text NOT NULL,
  whatsapp_message_template text NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Insert default promotion
INSERT INTO public.promotions (active, title, headline, description, badge_text, eligibility_text, cta_button_text, whatsapp_message_template)
VALUES (
  true, 
  'Promoção de Primeira Vez', 
  'Ganhe um brinde no seu primeiro pedido!', 
  'Na compra de qualquer prato, ganhe uma bebida grátis.', 
  'Novo Cliente', 
  'Válido apenas para o primeiro pedido por cliente.', 
  'Resgatar Brinde', 
  'Olá! Vi a promoção no site e gostaria de fazer meu primeiro pedido e resgatar o brinde.'
);

-- 5. Enable RLS on all tables
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- 6. PUBLIC READ policies (anyone can read the site content)
CREATE POLICY "Public can read site_config" ON public.site_config FOR SELECT USING (true);
CREATE POLICY "Public can read site_images" ON public.site_images FOR SELECT USING (true);
CREATE POLICY "Public can read menu_items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Public can read promotions" ON public.promotions FOR SELECT USING (true);

-- 7. RESTRICTIVE WRITE policies (only authenticated can write)
-- site_config
CREATE POLICY "Auth can update site_config" ON public.site_config FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
-- site_images
CREATE POLICY "Auth can insert site_images" ON public.site_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth can update site_images" ON public.site_images FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can delete site_images" ON public.site_images FOR DELETE TO authenticated USING (true);

-- 8. Storage bucket setup
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('site-images', 'site-images', true, 52428800)
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 52428800;

-- Storage policies for the site-images bucket
CREATE POLICY "Public read site-images" ON storage.objects FOR SELECT USING (bucket_id = 'site-images');
CREATE POLICY "Auth upload site-images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-images');
CREATE POLICY "Auth update site-images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'site-images');
CREATE POLICY "Auth delete site-images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-images');
