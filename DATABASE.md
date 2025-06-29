-- Disable RLS on all tables initially to prevent conflicts during creation and policy application.
-- RLS will be re-enabled and policies applied further down in this script.
ALTER TABLE IF EXISTS public.students DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.internships DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.applications DISABLE ROW LEVEL SECURITY;


-- -----------------------------------------------------------
-- 1. TABLES
-- -----------------------------------------------------------

-- Table: public.students
-- Stores student profiles, linked to Supabase auth.users
CREATE TABLE public.students (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, -- Links to Supabase Auth user ID
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL, -- Should match auth.users email for consistency
    university TEXT,
    major TEXT,
    graduation_year INT,
    skills JSONB DEFAULT '[]'::jsonb, -- Store as JSONB array of strings e.g., ["React", "Python", "Communication"]
    interests JSONB DEFAULT '[]'::jsonb, -- Store as JSONB array of strings e.g., ["Fintech", "AI/ML", "Digital Marketing"]
    bio TEXT,
    resume_url TEXT, -- URL to Supabase Storage or external storage
    academic_status TEXT DEFAULT 'Enrolled', -- e.g., 'Enrolled', 'Graduating', 'Alumni'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID
);
COMMENT ON COLUMN public.students.updated_at IS 'Timestamp of last update.';
COMMENT ON COLUMN public.students.updated_by IS 'User who last updated the record.';

COMMENT ON TABLE public.students IS 'User profiles for students, linked to Supabase authentication.';

-- Table: public.companies
-- Stores company profiles, linked to Supabase auth.users for company admins
CREATE TABLE public.companies (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, -- Links to Supabase Auth user ID
    name TEXT UNIQUE NOT NULL,
    industry TEXT,
    description TEXT,
    logo_url TEXT, -- URL to Supabase Storage or external storage
    contact_person TEXT,
    contact_email TEXT UNIQUE NOT NULL, -- Should match auth.users email for the company admin
    website_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID
);
COMMENT ON COLUMN public.companies.updated_at IS 'Timestamp of last update.';
COMMENT ON COLUMN public.companies.updated_by IS 'User who last updated the record.';

COMMENT ON TABLE public.companies IS 'Profiles for companies offering internships, linked to Supabase authentication.';

-- Table: public.internships
-- Stores details about internship opportunities posted by companies
CREATE TABLE public.internships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    skills_required JSONB DEFAULT '[]'::jsonb, -- e.g., ["JavaScript", "SQL", "Problem Solving"]
    location TEXT, -- e.g., 'Accra, Ghana', 'Remote', 'Hybrid'
    duration_weeks INT,
    start_date DATE,
    end_date DATE,
    is_paid BOOLEAN DEFAULT FALSE,
    academic_credit_eligible BOOLEAN DEFAULT FALSE,
    application_deadline DATE,
    status TEXT DEFAULT 'Open', -- e.g., 'Open', 'Closed', 'Filled'
    posted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID
);
COMMENT ON COLUMN public.internships.updated_at IS 'Timestamp of last update.';
COMMENT ON COLUMN public.internships.updated_by IS 'User who last updated the record.';

COMMENT ON TABLE public.internships IS 'Details of internship opportunities posted by companies.';

-- Table: public.applications
-- Records student applications to internships
CREATE TABLE public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    internship_id UUID NOT NULL REFERENCES public.internships(id) ON DELETE CASCADE,
    cover_letter_text TEXT,
    status TEXT DEFAULT 'Submitted', -- e.g., 'Submitted', 'Viewed', 'Interviewing', 'Offer', 'Rejected'
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID,
    UNIQUE (student_id, internship_id) -- Ensures a student can apply to an internship only once
);
COMMENT ON COLUMN public.applications.updated_at IS 'Timestamp of last update.';
COMMENT ON COLUMN public.applications.updated_by IS 'User who last updated the record.';

COMMENT ON TABLE public.applications IS 'Records of student applications to internships.';


-- -----------------------------------------------------------
-- 1A. SAVED OPPORTUNITIES TABLE
-- -----------------------------------------------------------
CREATE TABLE public.saved_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    internship_id UUID NOT NULL REFERENCES public.internships(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID,
    UNIQUE (student_id, internship_id)
);
COMMENT ON COLUMN public.saved_opportunities.updated_at IS 'Timestamp of last update.';
COMMENT ON COLUMN public.saved_opportunities.updated_by IS 'User who last updated the record.';

COMMENT ON TABLE public.saved_opportunities IS 'Tracks internships bookmarked by students.';


-- -----------------------------------------------------------
-- 1B. CHATS & MESSAGES TABLES
-- -----------------------------------------------------------
CREATE TABLE public.chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID,
    last_message_at TIMESTAMPTZ
);
COMMENT ON COLUMN public.chats.updated_at IS 'Timestamp of last update.';
COMMENT ON COLUMN public.chats.updated_by IS 'User who last updated the record.';
-- -----------------------------------------------------------
-- AUDIT LOG TABLE & TRIGGER
-- -----------------------------------------------------------
CREATE TABLE public.audit_log (
    id BIGSERIAL PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    changed_data JSONB,
    changed_by UUID,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.audit_log IS 'Tracks all changes to key tables for auditing.';

-- Enable RLS for audit_log table
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Only allow access to the audit log for the service_role (backend only)
CREATE POLICY "Allow service_role to read audit log"
  ON public.audit_log
  FOR SELECT
  TO service_role
  USING (true);

-- No SELECT/INSERT/UPDATE/DELETE policies for authenticated/anon users
-- This ensures audit logs are only accessible to backend/admins.

CREATE OR REPLACE FUNCTION public.log_audit() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_log (table_name, record_id, action, changed_data, changed_by)
  VALUES (TG_TABLE_NAME, COALESCE(NEW.id, OLD.id), TG_OP, row_to_json(COALESCE(NEW, OLD)), COALESCE(NEW.updated_by, OLD.updated_by, auth.uid()));
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER audit_students
  AFTER INSERT OR UPDATE OR DELETE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.log_audit();
CREATE TRIGGER audit_companies
  AFTER INSERT OR UPDATE OR DELETE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.log_audit();
CREATE TRIGGER audit_internships
  AFTER INSERT OR UPDATE OR DELETE ON public.internships
  FOR EACH ROW EXECUTE FUNCTION public.log_audit();
CREATE TRIGGER audit_applications
  AFTER INSERT OR UPDATE OR DELETE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.log_audit();
CREATE TRIGGER audit_saved_opportunities
  AFTER INSERT OR UPDATE OR DELETE ON public.saved_opportunities
  FOR EACH ROW EXECUTE FUNCTION public.log_audit();
CREATE TRIGGER audit_chats
  AFTER INSERT OR UPDATE OR DELETE ON public.chats
  FOR EACH ROW EXECUTE FUNCTION public.log_audit();

COMMENT ON TABLE public.chats IS 'Chat sessions between students and companies.';

CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL, -- Can be student or company user
    sender_role TEXT NOT NULL CHECK (sender_role IN ('student', 'company')),
    content TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE
);

COMMENT ON TABLE public.messages IS 'Messages exchanged in chats.';


-- -----------------------------------------------------------
-- 1C. NOTIFICATIONS TABLE
-- -----------------------------------------------------------
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Can be student or company user
    user_role TEXT NOT NULL CHECK (user_role IN ('student', 'company')),
    type TEXT NOT NULL, -- e.g., 'application_status', 'message', etc.
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.notifications IS 'User notifications for various events.';


-- -----------------------------------------------------------
-- 1D. COMPANY TEAM MANAGEMENT TABLE
-- -----------------------------------------------------------
CREATE TABLE public.company_team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member', -- e.g., 'admin', 'member'
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ
);

COMMENT ON TABLE public.company_team_members IS 'Links company users to companies for team management.';


-- -----------------------------------------------------------
-- 2. FUNCTIONS
-- -----------------------------------------------------------

-- Function: public.create_student_profile_on_signup
-- This function will be called by a Supabase Database Hook when a new user signs up.
-- It automatically creates a corresponding student profile entry.
CREATE OR REPLACE FUNCTION public.create_student_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.students (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), -- Uses full_name from auth metadata if available, else email
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.create_student_profile_on_signup() IS 'Creates a new student profile in the students table upon new user signup.';


-- Optional Function: public.create_company_profile_on_signup
-- Uncomment and adapt if you implement a distinct company signup flow that also creates an auth.user entry
/*
CREATE OR REPLACE FUNCTION public.create_company_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Assuming you differentiate company signups via user metadata, e.g., role='company_admin'
  IF NEW.raw_user_meta_data->>'role' = 'company_admin' THEN
    INSERT INTO public.companies (id, name, contact_email)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'company_name', NEW.email),
      NEW.email
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
COMMENT ON FUNCTION public.create_company_profile_on_signup() IS 'Creates a new company profile upon new company admin signup.';
*/


-- -----------------------------------------------------------
-- 3. TRIGGERS (Configured via Supabase Dashboard for auth.users)
-- -----------------------------------------------------------

-- IMPORTANT: You CANNOT create triggers directly on 'auth.users' via SQL.
-- Instead, you must configure a Database Hook in the Supabase Dashboard.

-- MANUAL STEP FOR AUTH HOOK:
-- After running this script:
-- 1. Go to your Supabase Project Dashboard.
-- 2. Navigate to 'Database' -> 'Hooks'.
-- 3. Click 'Register new hook' or similar.
-- 4. Configure the hook:
--    - Hook Type: 'auth.users'
--    - Event: 'INSERT'
--    - Function: Select 'public.create_student_profile_on_signup' from the dropdown.
--    - Give it a name (e.g., 'on_new_student_signup').
-- This will automatically call the function when a new user signs up.

-- If you implement create_company_profile_on_signup, you would create another hook for it
-- with a condition based on user metadata (e.g., 'role'='company_admin').


-- -----------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
--    - Once RLS is ENABLED, no one can access the table unless a policy explicitly allows it.
-- -----------------------------------------------------------

-- Enable RLS for all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_team_members ENABLE ROW LEVEL SECURITY;

--
-- RLS Policies for public.students table
--
-- Authenticated users (students) can view their own profile
CREATE POLICY "Students can view their own profile" ON public.students
FOR SELECT TO authenticated
USING (id = auth.uid());

-- Authenticated users (students) can update their own profile
CREATE POLICY "Students can update their own profile" ON public.students
FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());


--
-- RLS Policies for public.companies table
--
-- Authenticated users (companies) can view their own profile
CREATE POLICY "Companies can view their own profile" ON public.companies
FOR SELECT TO authenticated
USING (id = auth.uid());

-- Authenticated users (companies) can update their own profile
CREATE POLICY "Companies can update their own profile" ON public.companies
FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());


--
-- RLS Policies for public.internships table
--
-- All authenticated users (students & companies) can view open internships
CREATE POLICY "All authenticated users can view open internships" ON public.internships
FOR SELECT TO authenticated
USING (status = 'Open');

-- Companies can insert new internships (only for their own company_id)
CREATE POLICY "Companies can insert their own internships" ON public.internships
FOR INSERT TO authenticated
WITH CHECK (company_id = auth.uid());

-- Companies can update their own internships
CREATE POLICY "Companies can update their own internships" ON public.internships
FOR UPDATE TO authenticated
USING (company_id = auth.uid())
WITH CHECK (company_id = auth.uid());

-- Companies can delete their own internships
CREATE POLICY "Companies can delete their own internships" ON public.internships
FOR DELETE TO authenticated
USING (company_id = auth.uid());


--
-- RLS Policies for public.applications table
--
-- Students can insert new applications (only for themselves)
CREATE POLICY "Students can create their own applications" ON public.applications
FOR INSERT TO authenticated
WITH CHECK (student_id = auth.uid());

-- Students can view their own applications
CREATE POLICY "Students can view their own applications" ON public.applications
FOR SELECT TO authenticated
USING (student_id = auth.uid());

-- Companies can view applications for their own internships
CREATE POLICY "Companies can view applications for their internships" ON public.applications
FOR SELECT TO authenticated
USING (internship_id IN (SELECT id FROM public.internships WHERE company_id = auth.uid()));

-- Companies can update the status of applications for their own internships
CREATE POLICY "Companies can update application status for their internships" ON public.applications
FOR UPDATE TO authenticated
USING (internship_id IN (SELECT id FROM public.internships WHERE company_id = auth.uid()))
WITH CHECK (internship_id IN (SELECT id FROM public.internships WHERE company_id = auth.uid()));

-- No DELETE policy for applications for now; status changes are preferred.


--
-- RLS Policies for public.saved_opportunities table
--
-- Students can view their saved opportunities
CREATE POLICY "Students can view their saved opportunities" ON public.saved_opportunities
  FOR SELECT TO authenticated
  USING (student_id = auth.uid());

-- Students can save opportunities
CREATE POLICY "Students can save opportunities" ON public.saved_opportunities
  FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

-- Students can remove their saved opportunities
CREATE POLICY "Students can remove their saved opportunities" ON public.saved_opportunities
  FOR DELETE TO authenticated
  USING (student_id = auth.uid());


--
-- RLS Policies for public.chats table
--
-- Participants can view their chats
CREATE POLICY "Participants can view their chats" ON public.chats
  FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR company_id = auth.uid());


--
-- RLS Policies for public.messages table
--
-- Participants can view messages in their chats
CREATE POLICY "Participants can view messages in their chats" ON public.messages
  FOR SELECT TO authenticated
  USING (
    chat_id IN (
      SELECT id FROM public.chats WHERE student_id = auth.uid() OR company_id = auth.uid()
    )
  );

-- Participants can send messages
CREATE POLICY "Participants can send messages" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (
    (sender_role = 'student' AND sender_id = auth.uid()) OR
    (sender_role = 'company' AND sender_id = auth.uid())
  );


--
-- RLS Policies for public.notifications table
--
-- Users can view their notifications
CREATE POLICY "Users can view their notifications" ON public.notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Users can update their notifications
CREATE POLICY "Users can update their notifications" ON public.notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());


--
-- RLS Policies for public.company_team_members table
--
-- Company members can view their own membership
CREATE POLICY "Company members can view their own membership" ON public.company_team_members
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());


-- -----------------------------------------------------------
-- 5. STORAGE BUCKETS
--    - Public/private access handled by RLS policies in Supabase Dashboard -> Storage
-- -----------------------------------------------------------

-- Create a bucket for resumes (initially private, access via RLS policies in dashboard)
INSERT INTO storage.buckets (id, name)
VALUES ('resumes', 'resumes')
ON CONFLICT (id) DO NOTHING;

-- Create a bucket for company logos (initially private, access via RLS policies in dashboard)
INSERT INTO storage.buckets (id, name)
VALUES ('company_logos', 'company_logos')
ON CONFLICT (id) DO NOTHING;

-- MANUAL STEP FOR STORAGE RLS:
-- Go to Supabase Dashboard -> Storage -> select your bucket -> Policies.
-- For 'resumes' bucket:
--   - Allow authenticated users (students) to UPLOAD to their own folder:
--     - Policy name: "Allow students to upload their own resume"
--     - Permissive: `INSERT`
--     - Target roles: `authenticated`
--     - USING expression: `(bucket_id = 'resumes') AND (auth.uid() = (storage.foldername(name))[1]::uuid)`
--   - Allow authenticated users (companies) to DOWNLOAD specific resumes based on application access (more complex, often via Edge Functions or strict SELECT policies).
-- For 'company_logos' bucket:
--   - Allow public SELECT access:
--     - Policy name: "Allow public read access to logos"
--     - Permissive: `SELECT`
--     - Target roles: `anon`, `authenticated`
--     - USING expression: `(true)`
--   - Allow authenticated companies to UPLOAD their own logo:
--     - Policy name: "Allow companies to upload their own logo"
--     - Permissive: `INSERT`
--     - Target roles: `authenticated`
--     - USING expression: `(bucket_id = 'company_logos') AND (auth.uid() = (storage.foldername(name))[1]::uuid)`


-- -----------------------------------------------------------
-- 6. INDEXES (for performance)
-- -----------------------------------------------------------

-- Create indexes on frequently queried columns or foreign keys to optimize performance
CREATE INDEX idx_internships_company_id ON public.internships (company_id);
CREATE INDEX idx_internships_status ON public.internships (status);
CREATE INDEX idx_internships_location ON public.internships (location); -- Added for potential location-based searches
CREATE INDEX idx_applications_student_id ON public.applications (student_id);
CREATE INDEX idx_applications_internship_id ON public.applications (internship_id);
CREATE INDEX idx_applications_status ON public.applications (status);

-- Additional indexes for audit and analytics
CREATE INDEX idx_students_updated_at ON public.students (updated_at);
CREATE INDEX idx_companies_updated_at ON public.companies (updated_at);
CREATE INDEX idx_internships_updated_at ON public.internships (updated_at);
CREATE INDEX idx_applications_updated_at ON public.applications (updated_at);
CREATE INDEX idx_audit_log_changed_at ON public.audit_log (changed_at);

-- GIN indexes for JSONB columns if you're frequently querying within them
-- e.g., to search for internships requiring a specific skill or student having a skill
CREATE INDEX idx_internships_skills_required ON public.internships USING GIN (skills_required);
CREATE INDEX idx_students_skills ON public.students USING GIN (skills);
CREATE INDEX idx_students_interests ON public.students USING GIN (interests);

-- Indexes for new tables
CREATE INDEX idx_saved_opportunities_student_id ON public.saved_opportunities (student_id);
CREATE INDEX idx_saved_opportunities_internship_id ON public.saved_opportunities (internship_id);
CREATE INDEX idx_chats_student_id ON public.chats (student_id);
CREATE INDEX idx_chats_company_id ON public.chats (company_id);
CREATE INDEX idx_messages_chat_id ON public.messages (chat_id);
CREATE INDEX idx_notifications_user_id ON public.notifications (user_id);
CREATE INDEX idx_company_team_members_company_id ON public.company_team_members (company_id);
CREATE INDEX idx_company_team_members_user_id ON public.company_team_members (user_id);