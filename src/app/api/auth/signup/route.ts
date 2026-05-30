import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/server/db';
import { generateToken, jsonError } from '@/server/auth';
import { User } from '@/server/models/User';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return jsonError('Name, email, and password are required', 400);
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return jsonError('User already exists', 400);
    }

    const user = await User.create({ name, email, password });

    return NextResponse.json(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString()),
      },
      { status: 201 }
    );
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Failed to create account');
  }
}
