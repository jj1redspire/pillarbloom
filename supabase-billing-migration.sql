-- Billing columns for Stripe integration
-- Run in Supabase SQL editor → safe to run multiple times

alter table public.profiles
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text;

-- Index for webhook lookups by Stripe customer ID
create index if not exists profiles_stripe_customer_id_idx
  on public.profiles(stripe_customer_id)
  where stripe_customer_id is not null;
