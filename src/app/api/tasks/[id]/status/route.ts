import { NextRequest, NextResponse } from 'next/server';
import { isAuthError, jsonError, requireUser } from '@/server/auth';
import { Task } from '@/server/models/Task';

export const runtime = 'nodejs';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser(req);
    if (isAuthError(user)) return user;

    const { status } = await req.json();
    const task = await Task.findById(params.id);

    if (!task) return jsonError('Task not found', 404);

    task.status = status;
    const updatedTask = await task.save();
    return NextResponse.json(updatedTask);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Failed to update task status');
  }
}
