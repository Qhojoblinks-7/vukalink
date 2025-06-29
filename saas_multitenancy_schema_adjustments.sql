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

-- Profiles table (required for conversation_participants foreign key)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE, -- or just use id as the user identifier
    full_name TEXT,
    email TEXT UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
    -- Add any other fields you need
);

-- Conversation Participants Table (for group/direct chat membership)
CREATE TABLE IF NOT EXISTS public.conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_role TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- (Optional) Add organization_id if you want org-based isolation for conversations
-- ALTER TABLE public.conversation_participants ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);

-- Add index for fast lookups
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_id ON public.conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON public.conversation_participants(user_id);

-- Add foreign key constraint for clarity (if not already present)
ALTER TABLE public.conversation_participants
  ADD CONSTRAINT fk_conversation_participants_conversation
  FOREIGN KEY (conversation_id)
  REFERENCES public.conversations(id)
  ON DELETE CASCADE;

ALTER TABLE public.conversation_participants
  ADD CONSTRAINT fk_conversation_participants_user
  FOREIGN KEY (user_id)
  REFERENCES public.profiles(id)
  ON DELETE CASCADE;

-- (Optional) Add RLS policies for multi-tenancy if needed
-- Example:
-- ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY org_isolation ON public.conversation_participants USING (organization_id = auth.organization_id);
