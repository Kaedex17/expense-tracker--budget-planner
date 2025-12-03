// Type definitions for the application

export interface Expense {
  id: number;
  userId: number;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: number;
  userId: number;
  category: string;
  monthlyLimit: number;
  month: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseStats {
  byCategory: {
    category: string;
    total: number;
    count: number;
    average: number;
  }[];
  byMonth: {
    month: string;
    total: number;
    count: number;
  }[];
  overall: {
    totalAmount: number;
    totalCount: number;
    averageAmount: number;
  };
}

export const CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Education',
  'Other',
] as const;

export type Category = typeof CATEGORIES[number];
