-- Test queries for multi-tenancy RLS setup
-- 1. Insert organizations
INSERT INTO public.organizations (name) VALUES ('Org A') RETURNING id;
INSERT INTO public.organizations (name) VALUES ('Org B') RETURNING id;

-- 2. Insert users (replace with real auth.users IDs)
-- Example: INSERT INTO auth.users (id, email) VALUES ('user_a_uuid', 'a@example.com');
-- Example: INSERT INTO auth.users (id, email) VALUES ('user_b_uuid', 'b@example.com');

-- 3. Map users to organizations
INSERT INTO public.user_organizations (user_id, organization_id) VALUES ('user_a_uuid', 'org_a_uuid');
INSERT INTO public.user_organizations (user_id, organization_id) VALUES ('user_b_uuid', 'org_b_uuid');

-- 4. Insert company-owned data
INSERT INTO public.companies (name, organization_id) VALUES ('Company A', 'org_a_uuid');
INSERT INTO public.companies (name, organization_id) VALUES ('Company B', 'org_b_uuid');

-- 5. Test SELECT as user A (should only see Company A)
-- Set role and user context (replace with real user UUID)
SET SESSION AUTHORIZATION 'authenticated';
SET LOCAL "request.jwt.claims.sub" = 'user_a_uuid';
SELECT * FROM public.companies;

-- 6. Test SELECT as user B (should only see Company B)
SET LOCAL "request.jwt.claims.sub" = 'user_b_uuid';
SELECT * FROM public.companies;

-- 7. Test INSERT as user A (should only allow org_a_uuid)
SET LOCAL "request.jwt.claims.sub" = 'user_a_uuid';
INSERT INTO public.companies (name, organization_id) VALUES ('Company A2', 'org_a_uuid');
-- This should fail:
INSERT INTO public.companies (name, organization_id) VALUES ('Company B2', 'org_b_uuid');

-- 8. Test UPDATE/DELETE as user A (should only allow own org)
UPDATE public.companies SET name = 'Updated A' WHERE organization_id = 'org_a_uuid';
DELETE FROM public.companies WHERE organization_id = 'org_b_uuid'; -- Should fail

-- Repeat similar tests for other company-owned tables.
