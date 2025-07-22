-- Enable RLS on tables that are missing it
ALTER TABLE public.balance_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Add a basic policy for the profile table since it has no policies
CREATE POLICY "No access to profile table" ON public.profile
FOR ALL USING (false);