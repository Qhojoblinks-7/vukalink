-- 1. Confirm the organization exists (should return a row)
SELECT * FROM public.organizations WHERE id = '17bc521b-5be4-4542-9cc9-7014e3ea6589';

-- 2. Confirm the company exists for this organization (should return a row)
SELECT * FROM public.companies WHERE organization_id = '17bc521b-5be4-4542-9cc9-7014e3ea6589';

-- 3. Insert the user-organization mapping (replace with your real user UUID)
INSERT INTO public.user_organizations (user_id, organization_id)
VALUES ('your_real_user_uuid', '17bc521b-5be4-4542-9cc9-7014e3ea6589')
ON CONFLICT (user_id) DO NOTHING;

-- 4. Test SELECT as the user (should only see companies for this org)
-- Set role and user context (replace with your real user UUID)
SET SESSION AUTHORIZATION 'authenticated';
SET LOCAL "request.jwt.claims.sub" = 'your_real_user_uuid';
SELECT * FROM public.companies;

-- 5. Test INSERT as the user (should only allow org 17bc521b-5be4-4542-9cc9-7014e3ea6589)
SET LOCAL "request.jwt.claims.sub" = 'your_real_user_uuid';
INSERT INTO public.companies (name, organization_id) VALUES ('Company A2', '17bc521b-5be4-4542-9cc9-7014e3ea6589');
-- This should fail:
INSERT INTO public.companies (name, organization_id) VALUES ('Company B2', 'some_other_org_uuid');

-- 6. Test UPDATE/DELETE as the user (should only allow own org)
UPDATE public.companies SET name = 'Updated A' WHERE organization_id = '17bc521b-5be4-4542-9cc9-7014e3ea6589';
DELETE FROM public.companies WHERE organization_id = 'some_other_org_uuid'; -- Should fail
