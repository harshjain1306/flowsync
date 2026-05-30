import { NextRequest, NextResponse } from 'next/server';
import { isAuthError, jsonError, requireUser } from '@/server/auth';
import { Task } from '@/server/models/Task';

export const runtime = 'nodejs';

export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const user = await requireUser(req);
    if (isAuthError(user)) return user;

    const tasks = await Task.find({ project: params.projectId })
      .populate('assignedTo', 'name avatar')
      .populate('createdBy', 'name');

    return NextResponse.json(tasks);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Failed to load project tasks');
  }
}
