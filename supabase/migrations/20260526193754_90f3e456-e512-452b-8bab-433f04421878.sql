
DROP POLICY IF EXISTS "public insert coupons" ON public.coupons_claimed;

CREATE POLICY "public insert valid coupons"
ON public.coupons_claimed
FOR INSERT
TO anon, authenticated
WITH CHECK (
  promotion_id IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.promotion p
    WHERE p.id = coupons_claimed.promotion_id AND p.active = true
  )
  AND char_length(coupon_code) BETWEEN 4 AND 64
  AND (source_cta IS NULL OR char_length(source_cta) <= 64)
  AND (notes IS NULL OR char_length(notes) <= 500)
  AND (session_id IS NULL OR char_length(session_id) <= 128)
  AND (referrer IS NULL OR char_length(referrer) <= 512)
  AND (user_agent IS NULL OR char_length(user_agent) <= 512)
);

CREATE INDEX IF NOT EXISTS idx_coupons_claimed_promotion_id
ON public.coupons_claimed(promotion_id);
