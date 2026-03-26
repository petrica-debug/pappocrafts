-- Platform testing feedback submissions (anonymous)
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type TEXT NOT NULL CHECK (report_type IN ('bug', 'feedback', 'suggestion')),
  email TEXT,
  title TEXT,
  what_you_were_doing TEXT,
  expected_behavior TEXT,
  actual_behavior TEXT,
  url TEXT,
  severity TEXT,
  browser TEXT,
  device TEXT,
  what_you_liked TEXT,
  what_was_confusing TEXT,
  suggestions TEXT,
  ease_of_use TEXT,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage feedback"
  ON public.feedback
  FOR ALL
  USING (auth.role() = 'service_role');
