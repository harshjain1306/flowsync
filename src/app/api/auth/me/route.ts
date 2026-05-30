import { NextRequest, NextResponse } from 'next/server';
import { isAuthError, requireUser } from '@/server/auth';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (isAuthError(user)) return user;

  return NextResponse.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  });
}
