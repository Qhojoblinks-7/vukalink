-- SaaS Multi-Tenancy Schema Adjustments (No organization_id on students)

-- 1. Organizations table (keep as is)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    logo_url TEXT,
    region TEXT,
    custom_branding JSONB
);

-- 2. Add organization_id to company-owned tables only
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.internships ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.saved_opportunities ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.chats ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.company_team_members ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

-- 3. (Optional) Group chat/conversation tables
-- ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
-- ALTER TABLE public.conversation_participants ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

-- 4. (Optional) Set a default organization_id for existing rows if needed
-- UPDATE public.companies SET organization_id = '<your-org-uuid>' WHERE organization_id IS NULL;
-- Repeat for other tables as needed

-- 5. (After this) Update your RLS policies to include: AND organization_id = auth.organization_id
