-- Insert sample companies
INSERT INTO public.companies (id, name, description) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'TechCorp Solutions', 'Leading technology solutions provider specializing in cloud infrastructure and software development'),
('550e8400-e29b-41d4-a716-446655440002', 'GreenEnergy Ltd', 'Renewable energy company focused on solar and wind power generation'),
('550e8400-e29b-41d4-a716-446655440003', 'RetailMax Inc', 'Multi-channel retail company with both online and physical store presence');

-- Insert sample balance sheet data for TechCorp Solutions
INSERT INTO public.balance_sheets (
  company_id, 
  period_year, 
  period_quarter,
  assets,
  liabilities,
  equity,
  revenue,
  net_income
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001',
  2024,
  4,
  '{
    "current_assets": {
      "cash": 15000000,
      "accounts_receivable": 8500000,
      "inventory": 3200000,
      "total_current_assets": 26700000
    },
    "non_current_assets": {
      "property_plant_equipment": 45000000,
      "intangible_assets": 12000000,
      "investments": 8000000,
      "total_non_current_assets": 65000000
    },
    "total_assets": 91700000
  }',
  '{
    "current_liabilities": {
      "accounts_payable": 4500000,
      "short_term_debt": 6000000,
      "accrued_expenses": 2800000,
      "total_current_liabilities": 13300000
    },
    "non_current_liabilities": {
      "long_term_debt": 25000000,
      "deferred_tax": 3200000,
      "total_non_current_liabilities": 28200000
    },
    "total_liabilities": 41500000
  }',
  '{
    "share_capital": 30000000,
    "retained_earnings": 20200000,
    "total_equity": 50200000
  }',
  78500000,
  12800000
),
(
  '550e8400-e29b-41d4-a716-446655440001',
  2024,
  3,
  '{
    "current_assets": {
      "cash": 12500000,
      "accounts_receivable": 7800000,
      "inventory": 3100000,
      "total_current_assets": 23400000
    },
    "non_current_assets": {
      "property_plant_equipment": 43500000,
      "intangible_assets": 11500000,
      "investments": 7500000,
      "total_non_current_assets": 62500000
    },
    "total_assets": 85900000
  }',
  '{
    "current_liabilities": {
      "accounts_payable": 4200000,
      "short_term_debt": 5500000,
      "accrued_expenses": 2600000,
      "total_current_liabilities": 12300000
    },
    "non_current_liabilities": {
      "long_term_debt": 26000000,
      "deferred_tax": 3000000,
      "total_non_current_liabilities": 29000000
    },
    "total_liabilities": 41300000
  }',
  '{
    "share_capital": 30000000,
    "retained_earnings": 14600000,
    "total_equity": 44600000
  }',
  68200000,
  9800000
);

-- Insert sample balance sheet data for GreenEnergy Ltd
INSERT INTO public.balance_sheets (
  company_id, 
  period_year, 
  period_quarter,
  assets,
  liabilities,
  equity,
  revenue,
  net_income
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440002',
  2024,
  4,
  '{
    "current_assets": {
      "cash": 22000000,
      "accounts_receivable": 15500000,
      "inventory": 8200000,
      "total_current_assets": 45700000
    },
    "non_current_assets": {
      "property_plant_equipment": 185000000,
      "intangible_assets": 8500000,
      "investments": 5000000,
      "total_non_current_assets": 198500000
    },
    "total_assets": 244200000
  }',
  '{
    "current_liabilities": {
      "accounts_payable": 12500000,
      "short_term_debt": 18000000,
      "accrued_expenses": 6800000,
      "total_current_liabilities": 37300000
    },
    "non_current_liabilities": {
      "long_term_debt": 95000000,
      "deferred_tax": 8200000,
      "total_non_current_liabilities": 103200000
    },
    "total_liabilities": 140500000
  }',
  '{
    "share_capital": 75000000,
    "retained_earnings": 28700000,
    "total_equity": 103700000
  }',
  156800000,
  18500000
);