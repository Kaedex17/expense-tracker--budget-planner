import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { 
          error: 'Name, email, and password are required',
          code: 'MISSING_FIELDS'
        },
        { status: 400 }
      );
    }

    // Validate name is not empty (after trimming)
    if (name.trim().length === 0) {
      return NextResponse.json(
        { 
          error: 'Name cannot be empty',
          code: 'INVALID_NAME'
        },
        { status: 400 }
      );
    }

    // Validate email format (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          error: 'Invalid email format',
          code: 'INVALID_EMAIL'
        },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { 
          error: 'Password must be at least 6 characters long',
          code: 'INVALID_PASSWORD'
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { 
          error: 'Email already registered',
          code: 'EMAIL_EXISTS'
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create new user
    const createdUser = await db
      .insert(users)
      .values({
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
        createdAt: new Date().toISOString()
      })
      .returning();

    // Remove password from response
    const { password: _, ...userWithoutPassword } = createdUser[0];

    return NextResponse.json(userWithoutPassword, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error.message,
        code: 'SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}