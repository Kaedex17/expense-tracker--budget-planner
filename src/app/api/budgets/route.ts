import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { budgets } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

const VALID_CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Education',
  'Other'
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const month = searchParams.get('month');
    const category = searchParams.get('category');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) {
      return NextResponse.json(
        { error: 'User ID must be a valid number', code: 'INVALID_USER_ID' },
        { status: 400 }
      );
    }

    const conditions = [eq(budgets.userId, userIdNum)];

    if (month) {
      conditions.push(eq(budgets.month, month));
    }

    if (category) {
      conditions.push(eq(budgets.category, category));
    }

    const results = await db
      .select()
      .from(budgets)
      .where(and(...conditions))
      .orderBy(desc(budgets.month), budgets.category);

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, category, monthlyLimit, month } = body;

    if (!userId || !category || monthlyLimit === undefined || !month) {
      return NextResponse.json(
        {
          error: 'All fields are required (userId, category, monthlyLimit, month)',
          code: 'MISSING_FIELDS'
        },
        { status: 400 }
      );
    }

    if (typeof monthlyLimit !== 'number' || monthlyLimit <= 0) {
      return NextResponse.json(
        {
          error: 'Monthly limit must be a positive number',
          code: 'INVALID_LIMIT'
        },
        { status: 400 }
      );
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        {
          error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
          code: 'INVALID_CATEGORY'
        },
        { status: 400 }
      );
    }

    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(month)) {
      return NextResponse.json(
        {
          error: 'Month must be in format YYYY-MM',
          code: 'INVALID_MONTH_FORMAT'
        },
        { status: 400 }
      );
    }

    const existing = await db
      .select()
      .from(budgets)
      .where(
        and(
          eq(budgets.userId, userId),
          eq(budgets.category, category),
          eq(budgets.month, month)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      const updated = await db
        .update(budgets)
        .set({
          monthlyLimit,
          updatedAt: new Date().toISOString()
        })
        .where(
          and(
            eq(budgets.userId, userId),
            eq(budgets.category, category),
            eq(budgets.month, month)
          )
        )
        .returning();

      return NextResponse.json(updated[0], { status: 200 });
    } else {
      const now = new Date().toISOString();
      const newBudget = await db
        .insert(budgets)
        .values({
          userId,
          category,
          monthlyLimit,
          month,
          createdAt: now,
          updatedAt: now
        })
        .returning();

      return NextResponse.json(newBudget[0], { status: 201 });
    }
  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}