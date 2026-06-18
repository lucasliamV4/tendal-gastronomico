import { supabase } from "@/integrations/supabase/client";
import type {
  CouponClaimed,
  FAQItem,
  HolidayOverride,
  MenuItem,
  OperatingHour,
  Promotion,
  SiteConfig,
  SiteImage,
  Testimonial,
  UrgentBanner,
} from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const SITE_CONFIG_ID = "00000000-0000-0000-0000-000000000001";
const URGENT_BANNER_ID = "00000000-0000-0000-0000-000000000002";
const PROMOTION_ID = "00000000-0000-0000-0000-000000000003";

const PUBLIC_STALE = 30_000;

/* -------- site_config -------- */
export function useSiteConfigData() {
  return useQuery({
    queryKey: ["site_config"],
    staleTime: PUBLIC_STALE,
    queryFn: async (): Promise<SiteConfig> => {
      const { data, error } = await supabase
        .from("site_config")
        .select("*")
        .eq("id", SITE_CONFIG_ID)
        .single();
      if (error) throw error;
      return data as unknown as SiteConfig;
    },
  });
}

export function useUpdateSiteConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<SiteConfig>) => {
      const { id: _ignore, updated_at: _ignore2, ...rest } = patch as SiteConfig;
      const { data, error } = await supabase
        .from("site_config")
        .update(rest)
        .eq("id", SITE_CONFIG_ID)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as SiteConfig;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site_config"] }),
  });
}

/* -------- site_images -------- */
export function useSiteImages() {
  return useQuery({
    queryKey: ["site_images"],
    staleTime: PUBLIC_STALE,
    queryFn: async (): Promise<SiteImage[]> => {
      const { data, error } = await supabase.from("site_images").select("*").order("slot_key");
      if (error) throw error;
      return (data as unknown as SiteImage[]) ?? [];
    },
  });
}

export function useSiteImage(slotKey: string) {
  const { data } = useSiteImages();
  return data?.find((i) => i.slot_key === slotKey) ?? null;
}

export function useUploadSiteImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ slotKey, file }: { slotKey: string; file: File }) => {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${slotKey}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("site-images")
        .upload(path, file, { upsert: true, cacheControl: "3600" });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("site-images").getPublicUrl(path);
      const url = pub.publicUrl;

      // upsert pelo slot_key (precisa existir constraint unica). Fallback: select-then-insert/update.
      const { data: existing } = await supabase
        .from("site_images")
        .select("id")
        .eq("slot_key", slotKey)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("site_images")
          .update({ storage_path: path, url })
          .eq("slot_key", slotKey);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("site_images")
          .insert({ slot_key: slotKey, storage_path: path, url });
        if (error) throw error;
      }
      return url;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site_images"] }),
  });
}

export function useUpdateSiteImageMeta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ slotKey, alt_text }: { slotKey: string; alt_text: string }) => {
      const { error } = await supabase
        .from("site_images")
        .update({ alt_text })
        .eq("slot_key", slotKey);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site_images"] }),
  });
}

const CAROUSEL_SLOT_KEYS = [
  "menu_carousel_1",
  "menu_carousel_2",
  "menu_carousel_3",
  "menu_carousel_4",
  "menu_carousel_5",
];

export function useMenuCarouselImages() {
  const { data } = useSiteImages();
  const images = (data ?? [])
    .filter((i) => CAROUSEL_SLOT_KEYS.includes(i.slot_key))
    .sort((a, b) => a.slot_key.localeCompare(b.slot_key));
  return images;
}

export function useDeleteMenuCarouselImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (slotKey: string) => {
      // Find the existing record to get storage_path
      const { data: existing } = await supabase
        .from("site_images")
        .select("id, storage_path")
        .eq("slot_key", slotKey)
        .maybeSingle();

      if (existing?.storage_path) {
        await supabase.storage.from("site-images").remove([existing.storage_path]);
      }
      if (existing) {
        const { error } = await supabase.from("site_images").delete().eq("id", existing.id);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site_images"] }),
  });
}

/* -------- menu_items -------- */
export function useMenuItems(opts: { onlyActive?: boolean } = {}) {
  return useQuery({
    queryKey: ["menu_items", opts],
    staleTime: PUBLIC_STALE,
    queryFn: async (): Promise<MenuItem[]> => {
      let q = supabase.from("menu_items").select("*").order("display_order");
      if (opts.onlyActive) q = q.eq("active", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data as unknown as MenuItem[]) ?? [];
    },
  });
}

export function useUpsertMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: Partial<MenuItem>) => {
      if (item.id) {
        const { id, created_at: _c, updated_at: _u, ...rest } = item as MenuItem;
        const { error } = await supabase.from("menu_items").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("menu_items").insert(item as never);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["menu_items"] }),
  });
}

export function useDeleteMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("menu_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["menu_items"] }),
  });
}

/* -------- promotion -------- */
export function usePromotion() {
  return useQuery({
    queryKey: ["promotion"],
    staleTime: PUBLIC_STALE,
    queryFn: async (): Promise<Promotion> => {
      const { data, error } = await supabase
        .from("promotion")
        .select("*")
        .eq("id", PROMOTION_ID)
        .single();
      if (error) throw error;
      return data as unknown as Promotion;
    },
  });
}

export function useUpdatePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<Promotion>) => {
      const { id: _i, updated_at: _u, ...rest } = patch as Promotion;
      const { error } = await supabase.from("promotion").update(rest).eq("id", PROMOTION_ID);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["promotion"] }),
  });
}

/* -------- urgent_banner -------- */
export function useUrgentBanner() {
  return useQuery({
    queryKey: ["urgent_banner"],
    staleTime: PUBLIC_STALE,
    queryFn: async (): Promise<UrgentBanner> => {
      const { data, error } = await supabase
        .from("urgent_banner")
        .select("*")
        .eq("id", URGENT_BANNER_ID)
        .single();
      if (error) throw error;
      return data as unknown as UrgentBanner;
    },
  });
}

export function useUpdateUrgentBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<UrgentBanner>) => {
      const { id: _i, updated_at: _u, ...rest } = patch as UrgentBanner;
      const { error } = await supabase
        .from("urgent_banner")
        .update(rest)
        .eq("id", URGENT_BANNER_ID);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["urgent_banner"] }),
  });
}

/* -------- testimonials -------- */
export function useTestimonials(opts: { onlyActive?: boolean } = {}) {
  return useQuery({
    queryKey: ["testimonials", opts],
    staleTime: PUBLIC_STALE,
    queryFn: async (): Promise<Testimonial[]> => {
      let q = supabase.from("testimonials").select("*").order("display_order");
      if (opts.onlyActive) q = q.eq("active", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data as unknown as Testimonial[]) ?? [];
    },
  });
}

export function useUpsertTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: Partial<Testimonial>) => {
      if (item.id) {
        const { id, created_at: _c, ...rest } = item as Testimonial;
        const { error } = await supabase.from("testimonials").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("testimonials").insert(item as never);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["testimonials"] }),
  });
}

export function useDeleteTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["testimonials"] }),
  });
}

/* -------- faq -------- */
export function useFAQ(opts: { onlyActive?: boolean } = {}) {
  return useQuery({
    queryKey: ["faq_items", opts],
    staleTime: PUBLIC_STALE,
    queryFn: async (): Promise<FAQItem[]> => {
      let q = supabase.from("faq_items").select("*").order("display_order");
      if (opts.onlyActive) q = q.eq("active", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data as unknown as FAQItem[]) ?? [];
    },
  });
}

export function useUpsertFAQ() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: Partial<FAQItem>) => {
      if (item.id) {
        const { id, created_at: _c, updated_at: _u, ...rest } = item as FAQItem;
        const { error } = await supabase.from("faq_items").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("faq_items").insert(item as never);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faq_items"] }),
  });
}

export function useDeleteFAQ() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("faq_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faq_items"] }),
  });
}

/* -------- operating hours / overrides -------- */
export function useOperatingHours() {
  return useQuery({
    queryKey: ["operating_hours"],
    staleTime: PUBLIC_STALE,
    queryFn: async (): Promise<OperatingHour[]> => {
      const { data, error } = await supabase
        .from("operating_hours")
        .select("*")
        .order("day_of_week");
      if (error) throw error;
      return (data as unknown as OperatingHour[]) ?? [];
    },
  });
}

export function useUpdateOperatingHour() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<OperatingHour> & { id: string }) => {
      const { id, updated_at: _u, ...rest } = patch;
      const { error } = await supabase.from("operating_hours").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["operating_hours"] }),
  });
}

export function useHolidayOverrides() {
  return useQuery({
    queryKey: ["holiday_overrides"],
    staleTime: PUBLIC_STALE,
    queryFn: async (): Promise<HolidayOverride[]> => {
      const { data, error } = await supabase
        .from("holiday_overrides")
        .select("*")
        .order("override_date");
      if (error) throw error;
      return (data as unknown as HolidayOverride[]) ?? [];
    },
  });
}

export function useUpsertHolidayOverride() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: Partial<HolidayOverride>) => {
      if (item.id) {
        const { id, created_at: _c, ...rest } = item as HolidayOverride;
        const { error } = await supabase.from("holiday_overrides").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("holiday_overrides").insert(item as never);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["holiday_overrides"] }),
  });
}

export function useDeleteHolidayOverride() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("holiday_overrides").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["holiday_overrides"] }),
  });
}

/* -------- coupons -------- */
export function useCouponsClaimed(limit = 200) {
  return useQuery({
    queryKey: ["coupons_claimed", limit],
    queryFn: async (): Promise<CouponClaimed[]> => {
      const { data, error } = await supabase
        .from("coupons_claimed")
        .select("*")
        .order("claimed_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data as unknown as CouponClaimed[]) ?? [];
    },
  });
}

export function useValidateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("coupons_claimed")
        .update({ validated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["coupons_claimed"] }),
  });
}
