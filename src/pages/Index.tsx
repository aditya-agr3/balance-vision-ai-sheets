import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart3, Users, Shield } from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            BalanceSheetGPT
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Intelligent financial analysis platform for enterprises. Get AI-powered insights from your balance sheets, 
            track performance, and make data-driven decisions.
          </p>
          <div className="flex gap-4 justify-center">
            {user ? (
              <Button asChild size="lg">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link to="/auth">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/auth">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Financial Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Advanced charts and metrics to visualize your company's financial performance
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Balance Sheet Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Upload and analyze balance sheet data with AI-powered insights
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Role-Based Access</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Analysts, CEOs, and Group Owners get customized views based on their responsibilities
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Secure & Compliant</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Enterprise-grade security with row-level security and JWT authentication
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-8">Trusted by Leading Companies</h2>
          <div className="flex justify-center items-center gap-8 opacity-60">
            <div className="text-lg font-semibold">Reliance Industries</div>
            <div className="text-lg font-semibold">Jio Platforms</div>
            <div className="text-lg font-semibold">Reliance Retail</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
