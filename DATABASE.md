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
    created_at TIMESTAMPTZ DEFAULT NOW()
);

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
    created_at TIMESTAMPTZ DEFAULT NOW()
);

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
    posted_at TIMESTAMPTZ DEFAULT NOW()
);

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
    UNIQUE (student_id, internship_id) -- Ensures a student can apply to an internship only once
);

COMMENT ON TABLE public.applications IS 'Records of student applications to internships.';


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

-- GIN indexes for JSONB columns if you're frequently querying within them
-- e.g., to search for internships requiring a specific skill or student having a skill
CREATE INDEX idx_internships_skills_required ON public.internships USING GIN (skills_required);
CREATE INDEX idx_students_skills ON public.students USING GIN (skills);
CREATE INDEX idx_students_interests ON public.students USING GIN (interests);