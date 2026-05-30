import { NextResponse } from 'next/server';
import { connectDB } from '@/server/db';
import { jsonError } from '@/server/auth';
import { ensureDemoData } from '@/server/seed';

export const runtime = 'nodejs';

export async function POST() {
  try {
    await connectDB();
    await ensureDemoData();
    return NextResponse.json({ message: 'Demo data is ready' });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Failed to seed demo data');
  }
}
