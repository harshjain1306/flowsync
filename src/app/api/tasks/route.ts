import { NextRequest, NextResponse } from 'next/server';
import { isAuthError, jsonError, requireUser } from '@/server/auth';
import { Task } from '@/server/models/Task';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    if (isAuthError(user)) return user;

    const tasks = await Task.find({
      $or: [{ assignedTo: user._id }, { createdBy: user._id }],
    })
      .populate('project', 'name')
      .populate('assignedTo', 'name avatar')
      .sort({ createdAt: -1 });

    return NextResponse.json(tasks);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Failed to load tasks');
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    if (isAuthError(user)) return user;

    const { title, description, priority, projectId, assignedTo, dueDate } = await req.json();
    if (!title || !projectId) return jsonError('Title and projectId are required', 400);

    const task = await Task.create({
      title,
      description,
      priority,
      project: projectId,
      assignedTo,
      dueDate,
      createdBy: user._id,
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Failed to create task');
  }
}
