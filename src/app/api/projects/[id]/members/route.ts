import { NextRequest, NextResponse } from 'next/server';
import { isAuthError, jsonError, requireUser } from '@/server/auth';
import { Project } from '@/server/models/Project';

export const runtime = 'nodejs';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser(req);
    if (isAuthError(user)) return user;
    if (user.role !== 'Admin') return jsonError('Not authorized as an admin', 403);

    const { memberId } = await req.json();
    const project = await Project.findById(params.id);

    if (!project) return jsonError('Project not found', 404);
    if (project.admin.toString() !== user._id.toString()) {
      return jsonError('Not authorized, only admin can add members', 401);
    }
    if (project.members.some((id) => id.toString() === memberId)) {
      return jsonError('Member already in project', 400);
    }

    project.members.push(memberId);
    const updatedProject = await project.save();
    return NextResponse.json(updatedProject);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Failed to add member');
  }
}
