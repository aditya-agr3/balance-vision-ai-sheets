-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('analyst', 'ceo', 'group_owner');

-- Create companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'analyst',
  company_id UUID REFERENCES public.companies(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create balance sheets table
CREATE TABLE public.balance_sheets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  period_year INTEGER NOT NULL,
  period_quarter INTEGER CHECK (period_quarter BETWEEN 1 AND 4),
  assets JSONB NOT NULL,
  liabilities JSONB NOT NULL,
  equity JSONB NOT NULL,
  revenue DECIMAL(15,2),
  net_income DECIMAL(15,2),
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, period_year, period_quarter)
);

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.balance_sheets ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- Create security definer function to get user company
CREATE OR REPLACE FUNCTION public.get_user_company(user_id UUID)
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT company_id FROM public.profiles WHERE id = user_id;
$$;

-- RLS Policies for companies
CREATE POLICY "Group owners can view all companies" 
ON public.companies FOR SELECT 
TO authenticated 
USING (public.get_user_role(auth.uid()) = 'group_owner');

CREATE POLICY "CEOs and analysts can view their company" 
ON public.companies FOR SELECT 
TO authenticated 
USING (
  public.get_user_role(auth.uid()) IN ('ceo', 'analyst') 
  AND id = public.get_user_company(auth.uid())
);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (id = auth.uid());

-- RLS Policies for balance sheets
CREATE POLICY "Group owners can view all balance sheets" 
ON public.balance_sheets FOR SELECT 
TO authenticated 
USING (public.get_user_role(auth.uid()) = 'group_owner');

CREATE POLICY "CEOs and analysts can view their company balance sheets" 
ON public.balance_sheets FOR SELECT 
TO authenticated 
USING (
  public.get_user_role(auth.uid()) IN ('ceo', 'analyst') 
  AND company_id = public.get_user_company(auth.uid())
);

CREATE POLICY "CEOs can insert balance sheets for their company" 
ON public.balance_sheets FOR INSERT 
TO authenticated 
WITH CHECK (
  public.get_user_role(auth.uid()) = 'ceo' 
  AND company_id = public.get_user_company(auth.uid())
);

CREATE POLICY "Group owners can insert balance sheets for any company" 
ON public.balance_sheets FOR INSERT 
TO authenticated 
WITH CHECK (public.get_user_role(auth.uid()) = 'group_owner');

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
CREATE TRIGGER handle_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_balance_sheets_updated_at
  BEFORE UPDATE ON public.balance_sheets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'analyst'::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample companies
INSERT INTO public.companies (name, description) VALUES
  ('Reliance Industries', 'Conglomerate company with interests in petrochemicals, oil & gas, telecommunications, and retail'),
  ('Jio Platforms', 'Digital services platform offering telecommunications and digital services'),
  ('Reliance Retail', 'Retail arm of Reliance Industries focusing on consumer goods and services');

-- Insert sample balance sheet data
INSERT INTO public.balance_sheets (company_id, period_year, period_quarter, assets, liabilities, equity, revenue, net_income) 
SELECT 
  c.id,
  2023,
  4,
  '{"current_assets": 125000, "non_current_assets": 375000, "total_assets": 500000}'::jsonb,
  '{"current_liabilities": 75000, "non_current_liabilities": 175000, "total_liabilities": 250000}'::jsonb,
  '{"shareholders_equity": 200000, "retained_earnings": 50000, "total_equity": 250000}'::jsonb,
  75000.00,
  15000.00
FROM public.companies c
WHERE c.name = 'Reliance Industries';

INSERT INTO public.balance_sheets (company_id, period_year, period_quarter, assets, liabilities, equity, revenue, net_income) 
SELECT 
  c.id,
  2023,
  4,
  '{"current_assets": 45000, "non_current_assets": 105000, "total_assets": 150000}'::jsonb,
  '{"current_liabilities": 25000, "non_current_liabilities": 50000, "total_liabilities": 75000}'::jsonb,
  '{"shareholders_equity": 60000, "retained_earnings": 15000, "total_equity": 75000}'::jsonb,
  25000.00,
  5000.00
FROM public.companies c
WHERE c.name = 'Jio Platforms';