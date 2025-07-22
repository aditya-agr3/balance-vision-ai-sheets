import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Upload, MessageCircle } from "lucide-react";
import { FinancialCharts } from "./FinancialCharts";
import { ChatInterface } from "./ChatInterface";

interface DashboardProps {
  userRole: string;
  onLogout: () => void;
}

const Dashboard = ({ userRole, onLogout }: DashboardProps) => {
  const getRoleTitle = () => {
    switch (userRole) {
      case "ceo": return "CEO Dashboard";
      case "group_owner": return "Group Owner Dashboard";
      case "analyst": return "Analyst Dashboard";
      default: return "Dashboard";
    }
  };

  const getAccessLevel = () => {
    switch (userRole) {
      case "group_owner": return "All Companies";
      case "ceo": return "Your Company";
      case "analyst": return "Assigned Company";
      default: return "Limited Access";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">BalanceSheetGPT</h1>
            <p className="text-sm text-muted-foreground">{getRoleTitle()} - {getAccessLevel()}</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹2.4M</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹1.8M</div>
              <p className="text-xs text-muted-foreground">+15.2% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Liabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹0.8M</div>
              <p className="text-xs text-muted-foreground">-5.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.5%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last quarter</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Balance Sheet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop your JSON balance sheet file here
                </p>
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Financial Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChatInterface 
                open={false} 
                onOpenChange={() => {}} 
                selectedCompany={null} 
              />
            </CardContent>
          </Card>
        </div>

        <FinancialCharts data={[]} />
      </main>
    </div>
  );
};

export default Dashboard;