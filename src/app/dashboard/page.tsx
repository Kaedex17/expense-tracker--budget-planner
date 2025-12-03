'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Expense, ExpenseStats } from '@/types';
import { getExpenses, getExpenseStats } from '@/lib/api';
import { DashboardHeader } from '@/components/DashboardHeader';
import { StatCards } from '@/components/StatCards';
import { ExpenseCharts } from '@/components/ExpenseCharts';
import { ExpenseList } from '@/components/ExpenseList';
import { AddExpenseDialog } from '@/components/AddExpenseDialog';
import { BudgetManager } from '@/components/BudgetManager';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<ExpenseStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const [expensesData, statsData] = await Promise.all([
        getExpenses(user.id, { limit: 100 }),
        getExpenseStats(user.id),
      ]);
      setExpenses(expensesData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (expenses.length === 0) return;

    const csvData = expenses.map((expense) => ({
      Date: expense.date,
      Description: expense.description,
      Category: expense.category,
      Amount: expense.amount,
    }));

    const csv = [
      ['Date', 'Description', 'Category', 'Amount'].join(','),
      ...csvData.map((row) =>
        [row.Date, `"${row.Description}"`, row.Category, row.Amount].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 space-y-6">
          <Skeleton className="h-20 w-full" />
          <div className="grid gap-4 md:grid-cols-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <DashboardHeader onExportCSV={handleExportCSV} />

      <main className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center animate-fade-in">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <AddExpenseDialog onSuccess={loadData} />
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        ) : (
          <>
            {stats && <StatCards stats={stats} />}
            
            <div className="animate-fade-in animation-delay-200">
              <BudgetManager expenses={expenses} onUpdate={loadData} />
            </div>

            <div className="animate-fade-in animation-delay-300">
              {stats && <ExpenseCharts stats={stats} />}
            </div>

            <div className="animate-fade-in animation-delay-400">
              <ExpenseList expenses={expenses} onUpdate={loadData} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}