// API client functions
import { getToken } from './auth';
import { Expense, Budget, ExpenseStats } from '@/types';

const API_BASE = '';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

// Expenses API
export async function getExpenses(
  userId: number,
  filters?: {
    startDate?: string;
    endDate?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }
): Promise<Expense[]> {
  const params = new URLSearchParams({ userId: userId.toString() });
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.offset) params.append('offset', filters.offset.toString());

  return fetchWithAuth(`/api/expenses?${params}`);
}

export async function createExpense(expense: {
  userId: number;
  amount: number;
  category: string;
  description: string;
  date: string;
}): Promise<Expense> {
  return fetchWithAuth('/api/expenses', {
    method: 'POST',
    body: JSON.stringify(expense),
  });
}

export async function updateExpense(
  id: number,
  updates: {
    amount?: number;
    category?: string;
    description?: string;
    date?: string;
  }
): Promise<Expense> {
  return fetchWithAuth(`/api/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function deleteExpense(id: number): Promise<void> {
  return fetchWithAuth(`/api/expenses/${id}`, {
    method: 'DELETE',
  });
}

export async function getExpenseStats(userId: number): Promise<ExpenseStats> {
  return fetchWithAuth(`/api/expenses/stats?userId=${userId}`);
}

// Budgets API
export async function getBudgets(
  userId: number,
  filters?: {
    month?: string;
    category?: string;
  }
): Promise<Budget[]> {
  const params = new URLSearchParams({ userId: userId.toString() });
  if (filters?.month) params.append('month', filters.month);
  if (filters?.category) params.append('category', filters.category);

  return fetchWithAuth(`/api/budgets?${params}`);
}

export async function createOrUpdateBudget(budget: {
  userId: number;
  category: string;
  monthlyLimit: number;
  month: string;
}): Promise<Budget> {
  return fetchWithAuth('/api/budgets', {
    method: 'POST',
    body: JSON.stringify(budget),
  });
}

export async function deleteBudget(id: number): Promise<void> {
  return fetchWithAuth(`/api/budgets/${id}`, {
    method: 'DELETE',
  });
}
