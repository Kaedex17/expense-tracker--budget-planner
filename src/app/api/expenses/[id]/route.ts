import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { expenses } from '@/db/schema';
import { eq } from 'drizzle-orm';

const VALID_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'];

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid expense ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const expenseId = parseInt(id);
    const body = await request.json();
    const { amount, category, description, date } = body;

    if (!amount && !category && !description && !date) {
      return NextResponse.json(
        { error: 'At least one field must be provided for update', code: 'NO_FIELDS' },
        { status: 400 }
      );
    }

    if (amount !== undefined) {
      if (typeof amount !== 'number' || amount <= 0) {
        return NextResponse.json(
          { error: 'Amount must be a positive number', code: 'INVALID_AMOUNT' },
          { status: 400 }
        );
      }
    }

    if (category !== undefined) {
      if (!VALID_CATEGORIES.includes(category)) {
        return NextResponse.json(
          { error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`, code: 'INVALID_CATEGORY' },
          { status: 400 }
        );
      }
    }

    const existingExpense = await db.select()
      .from(expenses)
      .where(eq(expenses.id, expenseId))
      .limit(1);

    if (existingExpense.length === 0) {
      return NextResponse.json(
        { error: 'Expense not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString()
    };

    if (amount !== undefined) updates.amount = amount;
    if (category !== undefined) updates.category = category;
    if (description !== undefined) updates.description = description.trim();
    if (date !== undefined) updates.date = date;

    const updated = await db.update(expenses)
      .set(updates)
      .where(eq(expenses.id, expenseId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Expense not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid expense ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const expenseId = parseInt(id);

    const existingExpense = await db.select()
      .from(expenses)
      .where(eq(expenses.id, expenseId))
      .limit(1);

    if (existingExpense.length === 0) {
      return NextResponse.json(
        { error: 'Expense not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db.delete(expenses)
      .where(eq(expenses.id, expenseId))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: 'Expense not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Expense deleted successfully',
        deletedId: expenseId
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}