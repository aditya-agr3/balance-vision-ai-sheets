import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Company } from '@/types/database'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

interface UploadDataDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companies: Company[]
  onSuccess: () => void
}

export function UploadDataDialog({ open, onOpenChange, companies, onSuccess }: UploadDataDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    companyId: '',
    year: new Date().getFullYear(),
    quarter: 1,
    assets: '',
    liabilities: '',
    equity: '',
    revenue: '',
    netIncome: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Parse JSON data
      const assets = JSON.parse(formData.assets || '{}')
      const liabilities = JSON.parse(formData.liabilities || '{}')
      const equity = JSON.parse(formData.equity || '{}')

      const { error } = await supabase
        .from('balance_sheets')
        .insert({
          company_id: formData.companyId,
          period_year: formData.year,
          period_quarter: formData.quarter,
          assets,
          liabilities,
          equity,
          revenue: formData.revenue ? parseFloat(formData.revenue) : null,
          net_income: formData.netIncome ? parseFloat(formData.netIncome) : null,
        })

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Balance sheet data uploaded successfully',
      })

      onSuccess()
      onOpenChange(false)
      
      // Reset form
      setFormData({
        companyId: '',
        year: new Date().getFullYear(),
        quarter: 1,
        assets: '',
        liabilities: '',
        equity: '',
        revenue: '',
        netIncome: ''
      })

    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload data',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const exampleData = {
    assets: {
      current_assets: 125000,
      non_current_assets: 375000,
      total_assets: 500000
    },
    liabilities: {
      current_liabilities: 75000,
      non_current_liabilities: 175000,
      total_liabilities: 250000
    },
    equity: {
      shareholders_equity: 200000,
      retained_earnings: 50000,
      total_equity: 250000
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Balance Sheet Data</DialogTitle>
          <DialogDescription>
            Upload financial data in JSON format for the selected company and period.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Select value={formData.companyId} onValueChange={(value) => setFormData({...formData, companyId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                min="2000"
                max="2030"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quarter">Quarter</Label>
              <Select value={formData.quarter.toString()} onValueChange={(value) => setFormData({...formData, quarter: parseInt(value)})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Q1</SelectItem>
                  <SelectItem value="2">Q2</SelectItem>
                  <SelectItem value="3">Q3</SelectItem>
                  <SelectItem value="4">Q4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="revenue">Revenue (in millions)</Label>
              <Input
                id="revenue"
                type="number"
                step="0.01"
                placeholder="75000"
                value={formData.revenue}
                onChange={(e) => setFormData({...formData, revenue: e.target.value})}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="netIncome">Net Income (in millions)</Label>
              <Input
                id="netIncome"
                type="number"
                step="0.01"
                placeholder="15000"
                value={formData.netIncome}
                onChange={(e) => setFormData({...formData, netIncome: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assets">Assets (JSON)</Label>
              <Textarea
                id="assets"
                placeholder={JSON.stringify(exampleData.assets, null, 2)}
                value={formData.assets}
                onChange={(e) => setFormData({...formData, assets: e.target.value})}
                className="font-mono text-sm"
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="liabilities">Liabilities (JSON)</Label>
              <Textarea
                id="liabilities"
                placeholder={JSON.stringify(exampleData.liabilities, null, 2)}
                value={formData.liabilities}
                onChange={(e) => setFormData({...formData, liabilities: e.target.value})}
                className="font-mono text-sm"
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="equity">Equity (JSON)</Label>
              <Textarea
                id="equity"
                placeholder={JSON.stringify(exampleData.equity, null, 2)}
                value={formData.equity}
                onChange={(e) => setFormData({...formData, equity: e.target.value})}
                className="font-mono text-sm"
                rows={6}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Data'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}