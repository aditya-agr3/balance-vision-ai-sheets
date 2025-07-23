import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, companyId, userId } = await req.json()
    
    if (!message) {
      throw new Error('Message is required')
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured')
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, company_id')
      .eq('id', userId)
      .single()

    if (!profile) {
      throw new Error('User profile not found')
    }

    // Fetch balance sheet data based on user role and company
    let balanceSheetQuery = supabase
      .from('balance_sheets')
      .select(`
        *,
        companies (*)
      `)
      .order('period_year', { ascending: false })
      .order('period_quarter', { ascending: false })

    // Apply role-based filtering
    if (profile.role === 'group_owner') {
      // Group owners can see all companies
      if (companyId) {
        balanceSheetQuery = balanceSheetQuery.eq('company_id', companyId)
      }
    } else {
      // CEOs and analysts can only see their company
      if (profile.company_id) {
        balanceSheetQuery = balanceSheetQuery.eq('company_id', profile.company_id)
      } else {
        throw new Error('No company assigned to user')
      }
    }

    const { data: balanceSheets, error } = await balanceSheetQuery.limit(20)

    if (error) {
      console.error('Error fetching balance sheets:', error)
      throw new Error('Failed to fetch balance sheet data')
    }

    // Prepare financial data context for AI
    let contextData = "No financial data available."
    if (balanceSheets && balanceSheets.length > 0) {
      contextData = balanceSheets.map(sheet => {
        const company = sheet.companies as any
        return `
Company: ${company?.name || 'Unknown'}
Period: Q${sheet.period_quarter} ${sheet.period_year}
Assets: ${JSON.stringify(sheet.assets, null, 2)}
Liabilities: ${JSON.stringify(sheet.liabilities, null, 2)}
Equity: ${JSON.stringify(sheet.equity, null, 2)}
Revenue: $${sheet.revenue || 0}M
Net Income: $${sheet.net_income || 0}M
        `
      }).join('\n---\n')
    }

    // Create the prompt for Gemini
    const prompt = `You are an expert financial analyst specializing in balance sheet analysis. You provide actionable insights and recommendations to top management based on financial data.

FINANCIAL DATA:
${contextData}

USER ROLE: ${profile.role}
USER QUESTION: ${message}

Please analyze the financial data and provide:
1. Key insights about the company's financial health
2. Trends in assets, liabilities, revenue, and profitability
3. Actionable recommendations for management
4. Risk factors to consider
5. Growth opportunities

Keep your response concise, professional, and focused on actionable insights that would be valuable for ${profile.role === 'group_owner' ? 'a group owner managing multiple companies' : profile.role === 'ceo' ? 'a CEO making strategic decisions' : 'an analyst preparing reports'}.

Format your response with clear sections and bullet points for easy reading.`

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Gemini API error:', errorData)
      throw new Error('Failed to get AI analysis')
    }

    const data = await response.json()
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from AI service')
    }

    const aiResponse = data.candidates[0].content.parts[0].text

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        dataAvailable: balanceSheets && balanceSheets.length > 0
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in analyze-balance-sheet function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        response: "I apologize, but I'm unable to analyze the financial data at the moment. Please try again later or contact support if the issue persists."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})