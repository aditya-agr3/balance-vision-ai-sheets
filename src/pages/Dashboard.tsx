import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Company, BalanceSheetWithCompany } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { LogOut, Upload, MessageCircle } from 'lucide-react'
import { FinancialCharts } from '@/components/FinancialCharts'
import { UploadDataDialog } from '@/components/UploadDataDialog'
import { ChatInterface } from '@/components/ChatInterface'

export default function Dashboard() {
  const { user, profile, signOut, loading } = useAuth()
  const [companies, setCompanies] = useState<Company[]>([])
  const [balanceSheets, setBalanceSheets] = useState<BalanceSheetWithCompany[]>([])
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  // Redirect if not authenticated
  if (!loading && !user) {
    return <Navigate to="/auth" replace />
  }

  useEffect(() => {
    if (profile) {
      fetchData()
    }
  }, [profile])

  const fetchData = async () => {
    setLoadingData(true)
    
    // Fetch companies based on user role
    const { data: companiesData } = await supabase
      .from('companies')
      .select('*')
      .order('name')

    if (companiesData) {
      setCompanies(companiesData)
      if (companiesData.length > 0 && !selectedCompany) {
        // Auto-select company for CEOs and analysts, first company for group owners
        if (profile?.role === 'group_owner') {
          setSelectedCompany(companiesData[0])
        } else {
          const userCompany = companiesData.find(c => c.id === profile?.company_id)
          if (userCompany) setSelectedCompany(userCompany)
        }
      }
    }

    // Fetch balance sheets
    const { data: balanceSheetsData } = await supabase
      .from('balance_sheets')
      .select(`
        *,
        companies (*)
      `)
      .order('period_year', { ascending: false })
      .order('period_quarter', { ascending: false })

    if (balanceSheetsData) {
      setBalanceSheets(balanceSheetsData as BalanceSheetWithCompany[])
    }

    setLoadingData(false)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'group_owner': return 'bg-purple-100 text-purple-800'
      case 'ceo': return 'bg-blue-100 text-blue-800'
      case 'analyst': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatRole = (role: string) => {
    switch (role) {
      case 'group_owner': return 'Group Owner'
      case 'ceo': return 'CEO'
      case 'analyst': return 'Analyst'
      default: return role
    }
  }

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const selectedCompanySheets = balanceSheets.filter(
    sheet => sheet.company_id === selectedCompany?.id
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">BalanceSheetGPT</h1>
            <p className="text-muted-foreground">Welcome back, {profile?.full_name || profile?.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className={getRoleColor(profile?.role || '')}>
              {formatRole(profile?.role || '')}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChat(true)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUploadDialog(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Data
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Company Selection */}
        {profile?.role === 'group_owner' && companies.length > 1 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Company</CardTitle>
              <CardDescription>Choose a company to view its financial data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {companies.map((company) => (
                  <Button
                    key={company.id}
                    variant={selectedCompany?.id === company.id ? "default" : "outline"}
                    onClick={() => setSelectedCompany(company)}
                  >
                    {company.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedCompany ? (
          <div className="space-y-6">
            {/* Company Overview */}
            <Card>
              <CardHeader>
                <CardTitle>{selectedCompany.name}</CardTitle>
                <CardDescription>{selectedCompany.description}</CardDescription>
              </CardHeader>
            </Card>

            {/* Financial Data Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="charts">Charts</TabsTrigger>
                <TabsTrigger value="data">Raw Data</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {selectedCompanySheets.slice(0, 1).map((sheet) => (
                    <div key={sheet.id} className="space-y-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Total Assets</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            ${(sheet.assets.total_assets || 0).toLocaleString()}M
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Total Liabilities</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            ${(sheet.liabilities.total_liabilities || 0).toLocaleString()}M
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            ${(sheet.revenue || 0).toLocaleString()}M
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Net Income</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">
                            ${(sheet.net_income || 0).toLocaleString()}M
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="charts">
                <FinancialCharts data={selectedCompanySheets} />
              </TabsContent>

              <TabsContent value="data" className="space-y-4">
                {selectedCompanySheets.map((sheet) => (
                  <Card key={sheet.id}>
                    <CardHeader>
                      <CardTitle>
                        Q{sheet.period_quarter} {sheet.period_year}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Assets</h4>
                          <pre className="text-sm bg-muted p-3 rounded overflow-auto">
                            {JSON.stringify(sheet.assets, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Liabilities</h4>
                          <pre className="text-sm bg-muted p-3 rounded overflow-auto">
                            {JSON.stringify(sheet.liabilities, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Equity</h4>
                          <pre className="text-sm bg-muted p-3 rounded overflow-auto">
                            {JSON.stringify(sheet.equity, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No company data available</p>
            </CardContent>
          </Card>
        )}
      </div>

      <UploadDataDialog 
        open={showUploadDialog} 
        onOpenChange={setShowUploadDialog}
        companies={companies}
        onSuccess={fetchData}
      />

      <ChatInterface 
        open={showChat} 
        onOpenChange={setShowChat}
        selectedCompany={selectedCompany}
      />
    </div>
  )
}