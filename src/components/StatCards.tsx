'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, ShoppingBag, Calendar } from 'lucide-react';
import { ExpenseStats } from '@/types';

interface StatCardsProps {
  stats: ExpenseStats;
}

export function StatCards({ stats }: StatCardsProps) {
  const currentMonth = new Date().toISOString().substring(0, 7);
  const thisMonth = stats.byMonth.find((m) => m.month === currentMonth);
  const lastMonth = stats.byMonth.find((m) => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() - 1);
    return m.month === date.toISOString().substring(0, 7);
  });

  const monthlyChange = lastMonth
    ? ((thisMonth?.total || 0) - lastMonth.total) / lastMonth.total * 100
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="animate-fade-in animation-delay-100 transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:border-primary/30 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
            <DollarSign className="h-5 w-5 text-primary transition-transform duration-300 group-hover:rotate-12" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold transition-colors duration-300 group-hover:text-primary">${stats.overall.totalAmount.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">All time spending</p>
        </CardContent>
      </Card>

      <Card className="animate-fade-in animation-delay-200 transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:border-primary/30 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
            <Calendar className="h-5 w-5 text-primary transition-transform duration-300 group-hover:rotate-12" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold transition-colors duration-300 group-hover:text-primary">${(thisMonth?.total || 0).toFixed(2)}</div>
          <p className={`text-xs ${monthlyChange > 0 ? 'text-destructive' : 'text-green-600 dark:text-green-400'}`}>
            {monthlyChange > 0 ? '+' : ''}{monthlyChange.toFixed(1)}% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="animate-fade-in animation-delay-300 transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:border-primary/30 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
            <TrendingUp className="h-5 w-5 text-primary transition-transform duration-300 group-hover:rotate-12" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold transition-colors duration-300 group-hover:text-primary">${stats.overall.averageAmount.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Per transaction</p>
        </CardContent>
      </Card>

      <Card className="animate-fade-in animation-delay-400 transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 hover:border-primary/30 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
            <ShoppingBag className="h-5 w-5 text-primary transition-transform duration-300 group-hover:rotate-12" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold transition-colors duration-300 group-hover:text-primary">{stats.overall.totalCount}</div>
          <p className="text-xs text-muted-foreground">Expense entries</p>
        </CardContent>
      </Card>
    </div>
  );
}