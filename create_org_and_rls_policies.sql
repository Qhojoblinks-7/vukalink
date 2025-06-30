-- CONVERSATIONS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org members can select conversations" ON public.conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can insert conversations" ON public.conversations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can update conversations" ON public.conversations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can delete conversations" ON public.conversations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );

-- CONVERSATION PARTICIPANTS
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org members can select conversation_participants" ON public.conversation_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can insert conversation_participants" ON public.conversation_participants
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can update conversation_participants" ON public.conversation_participants
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can delete conversation_participants" ON public.conversation_participants
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );

-- Drop and recreate RLS policies for conversations and conversation_participants
DROP POLICY IF EXISTS "Org members can select conversations" ON public.conversations;
CREATE POLICY "Org members can select conversations" ON public.conversations FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can insert conversations" ON public.conversations;
CREATE POLICY "Org members can insert conversations" ON public.conversations FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can update conversations" ON public.conversations;
CREATE POLICY "Org members can update conversations" ON public.conversations FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can delete conversations" ON public.conversations;
CREATE POLICY "Org members can delete conversations" ON public.conversations FOR DELETE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));

DROP POLICY IF EXISTS "Org members can select conversation_participants" ON public.conversation_participants;
CREATE POLICY "Org members can select conversation_participants" ON public.conversation_participants FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can insert conversation_participants" ON public.conversation_participants;
CREATE POLICY "Org members can insert conversation_participants" ON public.conversation_participants FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can update conversation_participants" ON public.conversation_participants;
CREATE POLICY "Org members can update conversation_participants" ON public.conversation_participants FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can delete conversation_participants" ON public.conversation_participants;
CREATE POLICY "Org members can delete conversation_participants" ON public.conversation_participants FOR DELETE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
-- 1. Create an organization
INSERT INTO public.organizations (name, logo_url, region, custom_branding)
VALUES ('Acme Corp', 'https://example.com/logo.png', 'Nairobi', '{"theme":"blue"}')
RETURNING id;

-- 2. Create a user_organizations mapping table
CREATE TABLE IF NOT EXISTS public.user_organizations (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  organization_id uuid REFERENCES public.organizations(id)
);

-- 3. RLS Policies for company-owned tables using mapping table
-- Example for companies table:
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org members can select companies" ON public.companies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can insert companies" ON public.companies
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can update companies" ON public.companies
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can delete companies" ON public.companies
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );

-- INTERNSHIPS
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org members can select internships" ON public.internships
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can insert internships" ON public.internships
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can update internships" ON public.internships
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can delete internships" ON public.internships
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );

-- APPLICATIONS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org members can select applications" ON public.applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can insert applications" ON public.applications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can update applications" ON public.applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can delete applications" ON public.applications
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );

-- SAVED OPPORTUNITIES
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org members can select saved_opportunities" ON public.saved_opportunities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can insert saved_opportunities" ON public.saved_opportunities
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can update saved_opportunities" ON public.saved_opportunities
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can delete saved_opportunities" ON public.saved_opportunities
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );

-- CHATS
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org members can select chats" ON public.chats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can insert chats" ON public.chats
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can update chats" ON public.chats
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can delete chats" ON public.chats
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );

-- MESSAGES
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org members can select messages" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can insert messages" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can update messages" ON public.messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can delete messages" ON public.messages
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );

-- NOTIFICATIONS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org members can select notifications" ON public.notifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can update notifications" ON public.notifications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can delete notifications" ON public.notifications
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );

-- COMPANY TEAM MEMBERS
ALTER TABLE public.company_team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Org members can select company_team_members" ON public.company_team_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can insert company_team_members" ON public.company_team_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can update company_team_members" ON public.company_team_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );
CREATE POLICY "Org members can delete company_team_members" ON public.company_team_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_organizations uo
      WHERE uo.user_id = auth.uid()
        AND uo.organization_id = organization_id
    )
  );

-- Drop and recreate RLS policies for all company-owned tables using user_organizations mapping
-- This script will drop each policy if it exists, then create it. No DO blocks are used.

-- COMPANIES
DROP POLICY IF EXISTS "Org members can select companies" ON public.companies;
CREATE POLICY "Org members can select companies" ON public.companies FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can insert companies" ON public.companies;
CREATE POLICY "Org members can insert companies" ON public.companies FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can update companies" ON public.companies;
CREATE POLICY "Org members can update companies" ON public.companies FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can delete companies" ON public.companies;
CREATE POLICY "Org members can delete companies" ON public.companies FOR DELETE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));

-- INTERNSHIPS
DROP POLICY IF EXISTS "Org members can select internships" ON public.internships;
CREATE POLICY "Org members can select internships" ON public.internships FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can insert internships" ON public.internships;
CREATE POLICY "Org members can insert internships" ON public.internships FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can update internships" ON public.internships;
CREATE POLICY "Org members can update internships" ON public.internships FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can delete internships" ON public.internships;
CREATE POLICY "Org members can delete internships" ON public.internships FOR DELETE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));

-- APPLICATIONS
DROP POLICY IF EXISTS "Org members can select applications" ON public.applications;
CREATE POLICY "Org members can select applications" ON public.applications FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can insert applications" ON public.applications;
CREATE POLICY "Org members can insert applications" ON public.applications FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can update applications" ON public.applications;
CREATE POLICY "Org members can update applications" ON public.applications FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can delete applications" ON public.applications;
CREATE POLICY "Org members can delete applications" ON public.applications FOR DELETE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));

-- SAVED OPPORTUNITIES
DROP POLICY IF EXISTS "Org members can select saved_opportunities" ON public.saved_opportunities;
CREATE POLICY "Org members can select saved_opportunities" ON public.saved_opportunities FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can insert saved_opportunities" ON public.saved_opportunities;
CREATE POLICY "Org members can insert saved_opportunities" ON public.saved_opportunities FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can update saved_opportunities" ON public.saved_opportunities;
CREATE POLICY "Org members can update saved_opportunities" ON public.saved_opportunities FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can delete saved_opportunities" ON public.saved_opportunities;
CREATE POLICY "Org members can delete saved_opportunities" ON public.saved_opportunities FOR DELETE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));

-- CHATS
DROP POLICY IF EXISTS "Org members can select chats" ON public.chats;
CREATE POLICY "Org members can select chats" ON public.chats FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can insert chats" ON public.chats;
CREATE POLICY "Org members can insert chats" ON public.chats FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can update chats" ON public.chats;
CREATE POLICY "Org members can update chats" ON public.chats FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can delete chats" ON public.chats;
CREATE POLICY "Org members can delete chats" ON public.chats FOR DELETE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));

-- MESSAGES
DROP POLICY IF EXISTS "Org members can select messages" ON public.messages;
CREATE POLICY "Org members can select messages" ON public.messages FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can insert messages" ON public.messages;
CREATE POLICY "Org members can insert messages" ON public.messages FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can update messages" ON public.messages;
CREATE POLICY "Org members can update messages" ON public.messages FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can delete messages" ON public.messages;
CREATE POLICY "Org members can delete messages" ON public.messages FOR DELETE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));

-- NOTIFICATIONS
DROP POLICY IF EXISTS "Org members can select notifications" ON public.notifications;
CREATE POLICY "Org members can select notifications" ON public.notifications FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can insert notifications" ON public.notifications;
CREATE POLICY "Org members can insert notifications" ON public.notifications FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can update notifications" ON public.notifications;
CREATE POLICY "Org members can update notifications" ON public.notifications FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can delete notifications" ON public.notifications;
CREATE POLICY "Org members can delete notifications" ON public.notifications FOR DELETE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));

-- COMPANY TEAM MEMBERS
DROP POLICY IF EXISTS "Org members can select company_team_members" ON public.company_team_members;
CREATE POLICY "Org members can select company_team_members" ON public.company_team_members FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can insert company_team_members" ON public.company_team_members;
CREATE POLICY "Org members can insert company_team_members" ON public.company_team_members FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can update company_team_members" ON public.company_team_members;
CREATE POLICY "Org members can update company_team_members" ON public.company_team_members FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can delete company_team_members" ON public.company_team_members;
CREATE POLICY "Org members can delete company_team_members" ON public.company_team_members FOR DELETE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));

-- (Optional) Repeat for conversations, conversation_participants if you use them
