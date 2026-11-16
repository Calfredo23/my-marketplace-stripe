-- Remove rows created by the local Playwright suite.
-- Supabase blocks direct deletes from storage.objects; the tiny E2E image
-- stays in the bucket as an orphan unless you remove it from the dashboard.
-- The listing delete cascades its messages.

delete from public.listings
where email = 'e2e@themarket.test';
