import { NextRequest, NextResponse } from 'next/server';
import { isAuthError, jsonError, requireUser } from '@/server/auth';
import { Task } from '@/server/models/Task';

export const runtime = 'nodejs';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser(req);
    if (isAuthError(user)) return user;

    const { title, description, priority, assignedTo, dueDate } = await req.json();
    const task = await Task.findById(params.id);

    if (!task) return jsonError('Task not found', 404);

    task.title = title || task.title;
    task.description = description || task.description;
    task.priority = priority || task.priority;
    task.assignedTo = assignedTo || task.assignedTo;
    task.dueDate = dueDate || task.dueDate;

    const updatedTask = await task.save();
    return NextResponse.json(updatedTask);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Failed to update task');
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser(req);
    if (isAuthError(user)) return user;

    const task = await Task.findById(params.id);
    if (!task) return jsonError('Task not found', 404);

    await Task.deleteOne({ _id: task._id });
    return NextResponse.json({ message: 'Task removed' });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Failed to delete task');
  }
}
