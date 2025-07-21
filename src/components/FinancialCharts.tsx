import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const assetsData = [
  { month: "Jan", assets: 2200000, liabilities: 800000 },
  { month: "Feb", assets: 2300000, liabilities: 750000 },
  { month: "Mar", assets: 2400000, liabilities: 800000 },
  { month: "Apr", assets: 2500000, liabilities: 820000 },
  { month: "May", assets: 2400000, liabilities: 800000 },
  { month: "Jun", assets: 2600000, liabilities: 780000 },
];

const revenueData = [
  { quarter: "Q1", revenue: 1500000, growth: 10 },
  { quarter: "Q2", revenue: 1700000, growth: 13.3 },
  { quarter: "Q3", revenue: 1800000, growth: 5.9 },
  { quarter: "Q4", revenue: 1850000, growth: 2.8 },
];

const assetBreakdown = [
  { name: "Fixed Assets", value: 1200000, color: "#0088FE" },
  { name: "Current Assets", value: 800000, color: "#00C49F" },
  { name: "Investments", value: 400000, color: "#FFBB28" },
];

interface FinancialChartsProps {
  userRole: string;
}

const FinancialCharts = ({ userRole }: FinancialChartsProps) => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Assets vs Liabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={assetsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${(Number(value) / 1000000).toFixed(1)}M`, ""]} />
              <Line type="monotone" dataKey="assets" stroke="#0088FE" strokeWidth={2} name="Assets" />
              <Line type="monotone" dataKey="liabilities" stroke="#FF8042" strokeWidth={2} name="Liabilities" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${(Number(value) / 1000000).toFixed(1)}M`, ""]} />
              <Bar dataKey="revenue" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Asset Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={assetBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {assetBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₹${(Number(value) / 1000000).toFixed(1)}M`]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {userRole === "group_owner" && (
        <Card>
          <CardHeader>
            <CardTitle>Company Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border rounded">
                <span className="font-medium">JIO</span>
                <span className="text-green-600">+15.2%</span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded">
                <span className="font-medium">Reliance Retail</span>
                <span className="text-green-600">+12.8%</span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded">
                <span className="font-medium">Reliance Industries</span>
                <span className="text-green-600">+18.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FinancialCharts;