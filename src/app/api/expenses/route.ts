import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { expenses } from '@/db/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';

const VALID_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const category = searchParams.get('category');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '100'), 500);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    if (!userId) {
      return NextResponse.json({ 
        error: 'User ID is required',
        code: 'MISSING_USER_ID' 
      }, { status: 400 });
    }

    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) {
      return NextResponse.json({ 
        error: 'Valid User ID is required',
        code: 'INVALID_USER_ID' 
      }, { status: 400 });
    }

    const conditions = [eq(expenses.userId, userIdNum)];

    if (startDate) {
      conditions.push(gte(expenses.date, startDate));
    }

    if (endDate) {
      conditions.push(lte(expenses.date, endDate));
    }

    if (category) {
      conditions.push(eq(expenses.category, category));
    }

    const results = await db.select()
      .from(expenses)
      .where(and(...conditions))
      .orderBy(desc(expenses.date))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount, category, description, date } = body;

    if (!userId || !amount || !category || !description || !date) {
      return NextResponse.json({ 
        error: 'All fields are required (userId, amount, category, description, date)',
        code: 'MISSING_FIELDS' 
      }, { status: 400 });
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json({ 
        error: 'Amount must be a positive number',
        code: 'INVALID_AMOUNT' 
      }, { status: 400 });
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ 
        error: 'Invalid category. Must be one of: Food, Transport, Entertainment, Shopping, Bills, Healthcare, Education, Other',
        code: 'INVALID_CATEGORY' 
      }, { status: 400 });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json({ 
        error: 'Invalid date format. Must be YYYY-MM-DD',
        code: 'INVALID_DATE_FORMAT' 
      }, { status: 400 });
    }

    const now = new Date().toISOString();
    
    const newExpense = await db.insert(expenses)
      .values({
        userId: parseInt(userId),
        amount: amountNum,
        category: category.trim(),
        description: description.trim(),
        date: date,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    return NextResponse.json(newExpense[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}