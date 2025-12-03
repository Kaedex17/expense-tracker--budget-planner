'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ExpenseStats } from '@/types';

interface ExpenseChartsProps {
  stats: ExpenseStats;
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
  '#FFC658',
  '#8DD1E1',
];

export function ExpenseCharts({ stats }: ExpenseChartsProps) {
  const categoryData = stats.byCategory.map((item) => ({
    name: item.category,
    value: item.total,
  }));

  const monthData = stats.byMonth.slice().reverse().map((item) => ({
    month: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    amount: item.total,
  }));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Spending by Category Pie Chart */}
      <Card className="transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-2 hover:border-primary/30 group">
        <CardHeader>
          <CardTitle className="transition-colors duration-300 group-hover:text-primary">Spending by Category</CardTitle>
          <CardDescription>Total expenses breakdown by category</CardDescription>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <div className="transition-all duration-300 group-hover:scale-[1.02]">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={800}
                    animationBegin={0}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              No expense data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Trend Line Chart */}
      <Card className="transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-2 hover:border-primary/30 group">
        <CardHeader>
          <CardTitle className="transition-colors duration-300 group-hover:text-primary">Monthly Spending Trend</CardTitle>
          <CardDescription>Your spending over the past months</CardDescription>
        </CardHeader>
        <CardContent>
          {monthData.length > 0 ? (
            <div className="transition-all duration-300 group-hover:scale-[1.02]">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#8884d8" 
                    strokeWidth={2} 
                    animationDuration={1000}
                    animationBegin={0}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              No monthly data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}