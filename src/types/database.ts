export type UserRole = 'analyst' | 'ceo' | 'group_owner'

export interface Company {
  id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  full_name?: string
  role: UserRole
  company_id?: string
  created_at: string
  updated_at: string
}

export interface BalanceSheet {
  id: string
  company_id: string
  period_year: number
  period_quarter: number
  assets: Record<string, any>
  liabilities: Record<string, any>
  equity: Record<string, any>
  revenue?: number
  net_income?: number
  uploaded_by?: string
  created_at: string
  updated_at: string
}

export interface BalanceSheetWithCompany extends BalanceSheet {
  companies: Company
}