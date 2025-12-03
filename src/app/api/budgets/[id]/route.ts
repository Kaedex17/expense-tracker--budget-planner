import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { budgets } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid budget ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    const budgetId = parseInt(id);

    // Check if budget exists
    const existingBudget = await db.select()
      .from(budgets)
      .where(eq(budgets.id, budgetId))
      .limit(1);

    if (existingBudget.length === 0) {
      return NextResponse.json(
        { 
          error: 'Budget not found',
          code: 'NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // Delete the budget
    const deleted = await db.delete(budgets)
      .where(eq(budgets.id, budgetId))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { 
          error: 'Budget not found',
          code: 'NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Budget deleted successfully',
      deletedId: budgetId
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}