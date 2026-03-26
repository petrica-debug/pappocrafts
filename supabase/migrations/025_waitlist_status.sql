-- Track admin onboarding from waitlist → admin_users (buyer / product seller / service provider).
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS linked_admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL;

ALTER TABLE waitlist DROP CONSTRAINT IF EXISTS waitlist_status_check;
ALTER TABLE waitlist ADD CONSTRAINT waitlist_status_check CHECK (
  status IN (
    'pending',
    'buyer_created',
    'product_seller_created',
    'service_provider_created',
    'dismissed'
  )
);

CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status);
