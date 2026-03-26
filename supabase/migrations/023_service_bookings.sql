-- Service booking requests from public site (admin reviews; not auto-sent to provider unless you add email later)
CREATE TABLE public.service_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined', 'completed', 'cancelled')),
  provider_id TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  provider_category TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  preferred_date DATE,
  time_window_start TIME,
  time_window_end TIME,
  duration_hours NUMERIC(8, 2),
  hourly_rate_eur NUMERIC(12, 2),
  estimated_total_eur NUMERIC(12, 2),
  message TEXT,
  locale TEXT
);

CREATE INDEX service_bookings_created_at_idx ON public.service_bookings (created_at DESC);
CREATE INDEX service_bookings_status_idx ON public.service_bookings (status);

ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage service_bookings"
  ON public.service_bookings
  FOR ALL
  USING (auth.role() = 'service_role');
