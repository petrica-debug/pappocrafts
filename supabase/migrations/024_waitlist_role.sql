-- Store buyer vs seller preference for waitlist signups (API already sends role).
ALTER TABLE waitlist
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'buyer';

ALTER TABLE waitlist DROP CONSTRAINT IF EXISTS waitlist_role_check;
ALTER TABLE waitlist ADD CONSTRAINT waitlist_role_check CHECK (role IN ('buyer', 'seller'));
