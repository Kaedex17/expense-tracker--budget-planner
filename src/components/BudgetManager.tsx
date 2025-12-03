'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Loader2, Trash2 } from 'lucide-react';
import { CATEGORIES, Budget, Expense } from '@/types';
import { getBudgets, createOrUpdateBudget, deleteBudget } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BudgetManagerProps {
  expenses: Expense[];
  onUpdate: () => void;
}

export function BudgetManager({ expenses, onUpdate }: BudgetManagerProps) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [category, setCategory] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const { user } = useAuth();

  const currentMonth = new Date().toISOString().substring(0, 7);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    if (!user) return;
    try {
      const data = await getBudgets(user.id, { month: currentMonth });
      setBudgets(data);
    } catch (err) {
      console.error('Failed to load budgets:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) return;

    setIsLoading(true);

    try {
      await createOrUpdateBudget({
        userId: user.id,
        category,
        monthlyLimit: parseFloat(monthlyLimit),
        month: currentMonth,
      });
      setCategory('');
      setMonthlyLimit('');
      await loadBudgets();
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set budget');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    try {
      await deleteBudget(id);
      await loadBudgets();
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete budget');
    } finally {
      setIsDeleting(null);
    }
  };

  const calculateSpent = (category: string) => {
    return expenses
      .filter((e) => e.category === category && e.date.startsWith(currentMonth))
      .reduce((sum, e) => sum + e.amount, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Manager</CardTitle>
        <CardDescription>Set monthly spending limits by category</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget-category">Category</Label>
              <Select value={category} onValueChange={setCategory} disabled={isLoading}>
                <SelectTrigger id="budget-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly-limit">Monthly Limit ($)</Label>
              <Input
                id="monthly-limit"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex items-end">
              <Button type="submit" disabled={isLoading || !category} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Set Budget
              </Button>
            </div>
          </div>
        </form>

        <div className="space-y-4">
          {budgets.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No budgets set for this month. Add one above to get started.
            </p>
          ) : (
            budgets.map((budget) => {
              const spent = calculateSpent(budget.category);
              const percentage = (spent / budget.monthlyLimit) * 100;
              const isOverBudget = spent > budget.monthlyLimit;

              return (
                <div key={budget.id} className="space-y-2 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{budget.category}</h4>
                      <p className="text-sm text-muted-foreground">
                        ${spent.toFixed(2)} of ${budget.monthlyLimit.toFixed(2)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(budget.id)}
                      disabled={isDeleting === budget.id}
                    >
                      {isDeleting === budget.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <Progress
                    value={Math.min(percentage, 100)}
                    className={isOverBudget ? 'bg-destructive/20' : ''}
                  />
                  <p className="text-xs text-right text-muted-foreground">
                    {percentage.toFixed(1)}%{' '}
                    {isOverBudget && (
                      <span className="text-destructive font-semibold">Over Budget!</span>
                    )}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
