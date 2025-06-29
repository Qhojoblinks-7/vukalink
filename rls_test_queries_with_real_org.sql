-- Use this script to test your RLS setup with a real organization UUID

-- 1. Insert the organization (if not already present)
INSERT INTO public.organizations (id, name, created_at, logo_url, region, custom_branding)
VALUES ('17bc521b-5be4-4542-9cc9-7014e3ea6589', 'Acme Corp', '2025-06-29 15:15:56.435048+00', 'https://example.com/logo.png', 'Nairobi', '{"theme": "blue"}')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert a user (replace with a real user UUID from auth.users)
-- Example: INSERT INTO auth.users (id, email) VALUES ('your_real_user_uuid', 'user@example.com');

-- 3. Map the user to the organization
INSERT INTO public.user_organizations (user_id, organization_id)
VALUES ('your_real_user_uuid', '17bc521b-5be4-4542-9cc9-7014e3ea6589');

-- 4. Insert company-owned data
INSERT INTO public.companies (name, organization_id)
VALUES ('Company A', '17bc521b-5be4-4542-9cc9-7014e3ea6589');

-- 5. Test SELECT as the user (should only see Company A)
-- Set role and user context (replace with your real user UUID)
SET SESSION AUTHORIZATION 'authenticated';
SET LOCAL "request.jwt.claims.sub" = 'your_real_user_uuid';
SELECT * FROM public.companies;

-- 6. Test INSERT as the user (should only allow org 17bc521b-5be4-4542-9cc9-7014e3ea6589)
SET LOCAL "request.jwt.claims.sub" = 'your_real_user_uuid';
INSERT INTO public.companies (name, organization_id) VALUES ('Company A2', '17bc521b-5be4-4542-9cc9-7014e3ea6589');
-- This should fail:
INSERT INTO public.companies (name, organization_id) VALUES ('Company B2', 'some_other_org_uuid');

-- 7. Test UPDATE/DELETE as the user (should only allow own org)
UPDATE public.companies SET name = 'Updated A' WHERE organization_id = '17bc521b-5be4-4542-9cc9-7014e3ea6589';
DELETE FROM public.companies WHERE organization_id = 'some_other_org_uuid'; -- Should fail

-- Repeat similar tests for other company-owned tables as needed.
