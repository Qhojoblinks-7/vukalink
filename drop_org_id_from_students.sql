-- Remove organization_id column from students table if it exists
ALTER TABLE public.students DROP COLUMN IF EXISTS organization_id;
