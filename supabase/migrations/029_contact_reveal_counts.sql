-- Track how often visitors reveal listing phone numbers (product / service detail pages).
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS contact_reveal_count INT NOT NULL DEFAULT 0;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS contact_reveal_count INT NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.increment_listing_contact_reveal(p_kind text, p_id text)
RETURNS TABLE(out_phone text, out_count int)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(trim(p_kind)) = 'product' THEN
    RETURN QUERY
    UPDATE public.products
    SET contact_reveal_count = public.products.contact_reveal_count + 1
    WHERE id = p_id AND approval_status = 'approved'
    RETURNING public.products.phone, public.products.contact_reveal_count;
  ELSIF lower(trim(p_kind)) = 'service' THEN
    RETURN QUERY
    UPDATE public.services
    SET contact_reveal_count = public.services.contact_reveal_count + 1
    WHERE id = p_id
    RETURNING public.services.phone, public.services.contact_reveal_count;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.increment_listing_contact_reveal(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_listing_contact_reveal(text, text) TO service_role;
