-- Public product submissions: contact fields for makers without seller accounts
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS submitter_email TEXT,
  ADD COLUMN IF NOT EXISTS submitter_phone TEXT;

-- Service provider listing requests (reviewed in admin; not shown on public catalog until staff creates a service)
CREATE TABLE IF NOT EXISTS public.service_listing_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  service_title TEXT NOT NULL,
  service_category TEXT NOT NULL,
  service_description TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_service_listing_requests_status_created
  ON public.service_listing_requests (status, created_at DESC);

ALTER TABLE public.service_listing_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage service_listing_requests"
  ON public.service_listing_requests
  FOR ALL
  USING (auth.role() = 'service_role');
