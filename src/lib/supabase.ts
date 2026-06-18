export type SiteConfig = {
  id: string;
  whatsapp_number: string;
  whatsapp_default_message: string;
  business_name: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_postal_code: string;
  address_neighborhood: string;
  google_maps_url: string;
  google_maps_embed_url: string;
  instagram_url: string | null;
  meta_pixel_id: string | null;
  ga4_measurement_id: string | null;
  gtm_id: string | null;
  google_ads_conversion_id: string | null;
  google_ads_conversion_label: string | null;
  reference_landmark: string;
  reference_distance: string;
  hero_title: string | null;
  hero_subtitle: string | null;
  menu_description: string | null;
  menu_schedule_text: string | null;
  updated_at: string;
};

export type SiteImage = {
  id: string;
  slot_key: string;
  storage_path: string | null;
  alt_text: string | null;
  url: string;
  updated_at: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  image_slot_key: string | null;
  category: string;
  active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type Promotion = {
  id: string;
  active: boolean;
  title: string;
  headline: string;
  description: string;
  badge_text: string;
  eligibility_text: string;
  cta_button_text: string;
  whatsapp_message_template: string;
  updated_at: string;
};

export type Testimonial = {
  id: string;
  author_name: string;
  author_context: string | null;
  content: string;
  rating: number | null;
  source: string | null;
  display_order: number;
  active: boolean;
  created_at: string;
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type UrgentBanner = {
  id: string;
  active: boolean;
  text: string;
  link_url: string | null;
  updated_at: string;
};

export type OperatingHour = {
  id: string;
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  closed: boolean;
  label: string | null;
  updated_at: string;
};

export type HolidayOverride = {
  id: string;
  override_date: string;
  closed: boolean;
  custom_open_time: string | null;
  custom_close_time: string | null;
  custom_label: string | null;
  created_at: string;
};

export type CouponClaimed = {
  id: string;
  coupon_code: string;
  promotion_id: string | null;
  claimed_at: string;
  validated_at: string | null;
  notes: string | null;
  session_id: string | null;
  referrer: string | null;
  user_agent: string | null;
  source_cta: string | null;
};
