import jwt, { SignOptions } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from './db';
import { IUser, User } from './models/User';

export function jsonError(message: string, status = 500) {
  return NextResponse.json({ message }, { status });
}

export function generateToken(id: mongoose.Types.ObjectId | string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');

  return jwt.sign({ id }, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
  });
}

export async function requireUser(req: NextRequest): Promise<IUser | NextResponse> {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return jsonError('Not authorized, no token', 401);
  }

  try {
    await connectDB();
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const user = await User.findById(decoded.id).select('-password');

    if (!user) return jsonError('Not authorized, user not found', 401);
    return user;
  } catch {
    return jsonError('Not authorized, token failed', 401);
  }
}

export function isAuthError(value: IUser | NextResponse): value is NextResponse {
  return value instanceof NextResponse;
}
