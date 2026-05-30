import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/server/db';
import { generateToken, jsonError } from '@/server/auth';
import { User } from '@/server/models/User';
import { ensureDemoData } from '@/server/seed';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    await ensureDemoData();

    const { email, password } = await req.json();
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return jsonError('Invalid email or password', 401);
    }

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Failed to login');
  }
}
