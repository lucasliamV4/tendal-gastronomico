-- Extensoes
create extension if not exists "uuid-ossp";

-- =====================================================================
-- site_config (singleton)
-- =====================================================================
create table if not exists public.site_config (
  id uuid primary key default '00000000-0000-0000-0000-000000000001'::uuid,
  whatsapp_number text not null default '5511995120441',
  whatsapp_default_message text not null default 'Ola! Vim pelo site do Tendal.',
  business_name text not null default 'Tendal Gastronomia',
  address_street text not null default 'Rua Guaicurus, 1100',
  address_city text not null default 'Sao Paulo',
  address_state text not null default 'SP',
  address_postal_code text not null default '05033-002',
  address_neighborhood text not null default 'Lapa',
  google_maps_url text not null default 'https://maps.google.com/?q=Rua+Guaicurus,+1100+-+Lapa,+Sao+Paulo+-+SP,+05033-002',
  google_maps_embed_url text not null default 'https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=Rua+Guaicurus+1100+Sao+Paulo',
  instagram_url text default 'https://instagram.com/tendalgastronomia',
  meta_pixel_id text default '',
  ga4_measurement_id text default '',
  gtm_id text default '',
  google_ads_conversion_id text default '',
  google_ads_conversion_label text default '',
  reference_landmark text not null default 'Centro Cultural Tendal da Lapa',
  reference_distance text not null default '60 metros do Poupa Tempo Lapa',
  updated_at timestamptz not null default now()
);
insert into public.site_config (id) values ('00000000-0000-0000-0000-000000000001'::uuid)
on conflict (id) do nothing;

-- =====================================================================
-- urgent_banner (singleton)
-- =====================================================================
create table if not exists public.urgent_banner (
  id uuid primary key default '00000000-0000-0000-0000-000000000002'::uuid,
  active boolean not null default false,
  text text not null default '',
  link_url text default '',
  updated_at timestamptz not null default now()
);
insert into public.urgent_banner (id) values ('00000000-0000-0000-0000-000000000002'::uuid)
on conflict (id) do nothing;

-- =====================================================================
-- promotion (singleton)
-- =====================================================================
create table if not exists public.promotion (
  id uuid primary key default '00000000-0000-0000-0000-000000000003'::uuid,
  active boolean not null default true,
  title text not null default 'Almoco com Brinde',
  headline text not null default 'Funcionario do Poupa Tempo, JUCESP ou Sub-Prefeitura?',
  description text not null default 'Mostre seu cracha e ganhe um refrigerante gratis na compra do almoco.',
  badge_text text not null default 'Promocao ativa',
  eligibility_text text not null default 'Valido para funcionarios de orgaos publicos da Lapa, mediante apresentacao de cracha funcional.',
  cta_button_text text not null default 'Quero resgatar agora',
  whatsapp_message_template text not null default 'Ola! Quero resgatar o brinde do almoco. Codigo do cupom: {coupon_code}',
  updated_at timestamptz not null default now()
);
insert into public.promotion (id) values ('00000000-0000-0000-0000-000000000003'::uuid)
on conflict (id) do nothing;

-- =====================================================================
-- menu_items
-- =====================================================================
create table if not exists public.menu_items (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text default '',
  price_cents integer not null default 2800,
  image_slot_key text default '',
  category text not null default 'PF',
  active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================================
-- operating_hours
-- =====================================================================
create table if not exists public.operating_hours (
  id uuid primary key default uuid_generate_v4(),
  day_of_week integer not null check (day_of_week between 0 and 6),
  open_time time,
  close_time time,
  closed boolean not null default false,
  label text default '',
  updated_at timestamptz not null default now(),
  unique (day_of_week, label)
);
insert into public.operating_hours (day_of_week, open_time, close_time, closed, label) values
  (0, null, null, true, 'Almoco'),
  (1, '11:30', '15:00', false, 'Almoco'),
  (2, '11:30', '15:00', false, 'Almoco'),
  (3, '11:30', '15:00', false, 'Almoco'),
  (4, '11:30', '15:00', false, 'Almoco'),
  (5, '11:30', '15:00', false, 'Almoco'),
  (6, null, null, true, 'Almoco')
on conflict (day_of_week, label) do nothing;

-- =====================================================================
-- holiday_overrides
-- =====================================================================
create table if not exists public.holiday_overrides (
  id uuid primary key default uuid_generate_v4(),
  override_date date not null unique,
  closed boolean not null default true,
  custom_label text default '',
  custom_open_time time,
  custom_close_time time,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- coupons_claimed
-- =====================================================================
create table if not exists public.coupons_claimed (
  id uuid primary key default uuid_generate_v4(),
  coupon_code text not null,
  claimed_at timestamptz not null default now(),
  source_cta text default 'unknown',
  user_agent text default '',
  referrer text default '',
  session_id text default '',
  promotion_id uuid references public.promotion(id),
  validated_at timestamptz,
  notes text default ''
);
create index if not exists idx_coupons_claimed_at on public.coupons_claimed (claimed_at desc);
create index if not exists idx_coupons_code on public.coupons_claimed (coupon_code);

-- =====================================================================
-- faq_items
-- =====================================================================
create table if not exists public.faq_items (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  display_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
insert into public.faq_items (question, answer, display_order, active) values
  ('Onde fica o Tendal Gastronomia?', 'Estamos dentro do Centro Cultural Tendal da Lapa, na Rua Guaicurus, 1100 - Lapa. A entrada fica recuada cerca de 60 metros da rua, atravessando o portao do Centro Cultural.', 1, true),
  ('Qual o horario de almoco?', 'De segunda a sexta-feira, das 11h30 as 15h.', 2, true),
  ('Tem estacionamento?', 'Sim, ha estacionamento gratuito dentro do Centro Cultural Tendal da Lapa, com vagas para clientes do restaurante.', 3, true),
  ('Aceitam cartao e Pix?', 'Sim, aceitamos todos os cartoes de credito e debito, Pix e dinheiro.', 4, true),
  ('Tem opcao vegetariana?', 'Sim, temos pelo menos uma opcao vegetariana no PF de cada dia. Pergunte ao atendente sobre o cardapio do dia.', 5, true),
  ('Como funciona a promocao do cracha?', 'Funcionarios do Poupa Tempo, JUCESP e Sub-Prefeitura da Lapa que apresentarem o cracha funcional ganham um refrigerante gratis na compra do almoco. Voce pode resgatar pelo WhatsApp clicando no botao da pagina.', 6, true),
  ('Posso fazer reserva?', 'No almoco a casa funciona por ordem de chegada, sem reservas. Para grupos acima de 6 pessoas, entre em contato pelo WhatsApp para combinarmos.', 7, true)
on conflict do nothing;

-- =====================================================================
-- testimonials
-- =====================================================================
create table if not exists public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  author_name text not null,
  author_context text default '',
  content text not null,
  rating integer default 5 check (rating between 1 and 5),
  source text default 'Google',
  display_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- site_images
-- =====================================================================
create table if not exists public.site_images (
  id uuid primary key default uuid_generate_v4(),
  slot_key text not null unique,
  url text not null default '',
  alt_text text default '',
  storage_path text default '',
  updated_at timestamptz not null default now()
);
insert into public.site_images (slot_key, alt_text) values
  ('hero_background', 'Brasa do charbroiler do Tendal'),
  ('charbroiler', 'Carne grelhada no charbroiler'),
  ('ambiente', 'Patio arborizado do Tendal'),
  ('route_video_poster', 'Como chegar ao Tendal'),
  ('logo_tendal', 'Logo Tendal Gastronomia'),
  ('logo_tria', 'Logo Cervejaria Tria'),
  ('menu_destaque_1', 'Prato do dia'),
  ('menu_destaque_2', 'Prato do dia'),
  ('menu_destaque_3', 'Prato do dia'),
  ('menu_destaque_4', 'Prato do dia')
on conflict (slot_key) do nothing;

-- =====================================================================
-- TRIGGERS updated_at
-- =====================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'site_config','urgent_banner','promotion','menu_items',
      'operating_hours','faq_items','site_images'
    ])
  loop
    execute format('drop trigger if exists trg_%s_updated_at on public.%s', t, t);
    execute format('create trigger trg_%s_updated_at before update on public.%s for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

-- =====================================================================
-- RLS
-- =====================================================================
alter table public.site_config enable row level security;
alter table public.urgent_banner enable row level security;
alter table public.promotion enable row level security;
alter table public.menu_items enable row level security;
alter table public.operating_hours enable row level security;
alter table public.holiday_overrides enable row level security;
alter table public.coupons_claimed enable row level security;
alter table public.faq_items enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_images enable row level security;

-- SELECT publico
do $$
declare t text;
begin
  for t in
    select unnest(array[
      'site_config','urgent_banner','promotion','menu_items',
      'operating_hours','holiday_overrides','faq_items','testimonials','site_images'
    ])
  loop
    execute format('drop policy if exists "public_read_%s" on public.%s', t, t);
    execute format('create policy "public_read_%s" on public.%s for select using (true)', t, t);
  end loop;
end $$;

-- WRITE para autenticado
do $$
declare t text;
begin
  for t in
    select unnest(array[
      'site_config','urgent_banner','promotion','menu_items',
      'operating_hours','holiday_overrides','faq_items','testimonials','site_images'
    ])
  loop
    execute format('drop policy if exists "auth_write_%s" on public.%s', t, t);
    execute format(
      'create policy "auth_write_%s" on public.%s for all to authenticated using (true) with check (true)',
      t, t
    );
  end loop;
end $$;

-- coupons_claimed: anon INSERT, authenticated tudo
drop policy if exists "public_insert_coupons" on public.coupons_claimed;
create policy "public_insert_coupons"
  on public.coupons_claimed for insert
  to anon, authenticated
  with check (true);

drop policy if exists "auth_all_coupons" on public.coupons_claimed;
create policy "auth_all_coupons"
  on public.coupons_claimed for all
  to authenticated
  using (true)
  with check (true);

-- =====================================================================
-- STORAGE bucket site-images
-- =====================================================================
insert into storage.buckets (id, name, public)
  values ('site-images', 'site-images', true)
  on conflict (id) do update set public = true;

drop policy if exists "public_read_site_images_bucket" on storage.objects;
create policy "public_read_site_images_bucket"
  on storage.objects for select
  using (bucket_id = 'site-images');

drop policy if exists "auth_write_site_images_bucket" on storage.objects;
create policy "auth_write_site_images_bucket"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'site-images')
  with check (bucket_id = 'site-images');