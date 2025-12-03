import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { expenses } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Validate userId
    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json(
        { error: 'User ID is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    // Fetch all expenses for the user
    const userExpenses = await db
      .select()
      .from(expenses)
      .where(eq(expenses.userId, parseInt(userId)));

    // Handle case when no expenses found
    if (userExpenses.length === 0) {
      return NextResponse.json({
        byCategory: [],
        byMonth: [],
        overall: {
          totalAmount: 0,
          totalCount: 0,
          averageAmount: 0,
        },
      });
    }

    // Calculate statistics by category
    const categoryMap = userExpenses.reduce((acc, expense) => {
      const category = expense.category;
      if (!acc[category]) {
        acc[category] = {
          category,
          total: 0,
          count: 0,
          amounts: [],
        };
      }
      acc[category].total += expense.amount;
      acc[category].count += 1;
      acc[category].amounts.push(expense.amount);
      return acc;
    }, {} as Record<string, { category: string; total: number; count: number; amounts: number[] }>);

    const byCategory = Object.values(categoryMap)
      .map((cat) => ({
        category: cat.category,
        total: parseFloat(cat.total.toFixed(2)),
        count: cat.count,
        average: parseFloat((cat.total / cat.count).toFixed(2)),
      }))
      .sort((a, b) => b.total - a.total);

    // Calculate statistics by month
    const monthMap = userExpenses.reduce((acc, expense) => {
      const month = expense.date.substring(0, 7); // Extract YYYY-MM
      if (!acc[month]) {
        acc[month] = {
          month,
          total: 0,
          count: 0,
        };
      }
      acc[month].total += expense.amount;
      acc[month].count += 1;
      return acc;
    }, {} as Record<string, { month: string; total: number; count: number }>);

    const byMonth = Object.values(monthMap)
      .map((mon) => ({
        month: mon.month,
        total: parseFloat(mon.total.toFixed(2)),
        count: mon.count,
      }))
      .sort((a, b) => b.month.localeCompare(a.month)); // Most recent first

    // Calculate overall statistics
    const totalAmount = userExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalCount = userExpenses.length;
    const averageAmount = totalAmount / totalCount;

    const overall = {
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      totalCount,
      averageAmount: parseFloat(averageAmount.toFixed(2)),
    };

    return NextResponse.json({
      byCategory,
      byMonth,
      overall,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}