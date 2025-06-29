-- RLS policies for all company-owned tables using user_organizations mapping

-- INTERNSHIPS
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Org members can select internships" ON public.internships;
CREATE POLICY "Org members can select internships" ON public.internships FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can insert internships" ON public.internships;
CREATE POLICY "Org members can insert internships" ON public.internships FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can update internships" ON public.internships;
CREATE POLICY "Org members can update internships" ON public.internships FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can delete internships" ON public.internships;
CREATE POLICY "Org members can delete internships" ON public.internships FOR DELETE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));

-- APPLICATIONS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Org members can select applications" ON public.applications;
CREATE POLICY "Org members can select applications" ON public.applications FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can insert applications" ON public.applications;
CREATE POLICY "Org members can insert applications" ON public.applications FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can update applications" ON public.applications;
CREATE POLICY "Org members can update applications" ON public.applications FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can delete applications" ON public.applications;
CREATE POLICY "Org members can delete applications" ON public.applications FOR DELETE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));

-- SAVED OPPORTUNITIES
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Org members can select saved_opportunities" ON public.saved_opportunities;
CREATE POLICY "Org members can select saved_opportunities" ON public.saved_opportunities FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can insert saved_opportunities" ON public.saved_opportunities;
CREATE POLICY "Org members can insert saved_opportunities" ON public.saved_opportunities FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can update saved_opportunities" ON public.saved_opportunities;
CREATE POLICY "Org members can update saved_opportunities" ON public.saved_opportunities FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can delete saved_opportunities" ON public.saved_opportunities;
CREATE POLICY "Org members can delete saved_opportunities" ON public.saved_opportunities FOR DELETE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));

-- CHATS
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Org members can select chats" ON public.chats;
CREATE POLICY "Org members can select chats" ON public.chats FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can insert chats" ON public.chats;
CREATE POLICY "Org members can insert chats" ON public.chats FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can update chats" ON public.chats;
CREATE POLICY "Org members can update chats" ON public.chats FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can delete chats" ON public.chats;
CREATE POLICY "Org members can delete chats" ON public.chats FOR DELETE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));

-- MESSAGES
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Org members can select messages" ON public.messages;
CREATE POLICY "Org members can select messages" ON public.messages FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can insert messages" ON public.messages;
CREATE POLICY "Org members can insert messages" ON public.messages FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can update messages" ON public.messages;
CREATE POLICY "Org members can update messages" ON public.messages FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can delete messages" ON public.messages;
CREATE POLICY "Org members can delete messages" ON public.messages FOR DELETE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));

-- NOTIFICATIONS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Org members can select notifications" ON public.notifications;
CREATE POLICY "Org members can select notifications" ON public.notifications FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can insert notifications" ON public.notifications;
CREATE POLICY "Org members can insert notifications" ON public.notifications FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can update notifications" ON public.notifications;
CREATE POLICY "Org members can update notifications" ON public.notifications FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can delete notifications" ON public.notifications;
CREATE POLICY "Org members can delete notifications" ON public.notifications FOR DELETE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));

-- COMPANY TEAM MEMBERS
ALTER TABLE public.company_team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Org members can select company_team_members" ON public.company_team_members;
CREATE POLICY "Org members can select company_team_members" ON public.company_team_members FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can insert company_team_members" ON public.company_team_members;
CREATE POLICY "Org members can insert company_team_members" ON public.company_team_members FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can update company_team_members" ON public.company_team_members;
CREATE POLICY "Org members can update company_team_members" ON public.company_team_members FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));
DROP POLICY IF EXISTS "Org members can delete company_team_members" ON public.company_team_members;
CREATE POLICY "Org members can delete company_team_members" ON public.company_team_members FOR DELETE USING (EXISTS (SELECT 1 FROM public.user_organizations uo WHERE uo.user_id = auth.uid() AND uo.organization_id = organization_id));

-- (Optional) Repeat for conversations, conversation_participants if you use them
