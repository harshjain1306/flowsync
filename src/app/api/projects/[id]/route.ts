import { NextRequest, NextResponse } from 'next/server';
import { isAuthError, jsonError, requireUser } from '@/server/auth';
import { Project } from '@/server/models/Project';

export const runtime = 'nodejs';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser(req);
    if (isAuthError(user)) return user;

    const project = await Project.findById(params.id)
      .populate('admin', 'name email')
      .populate('members', 'name email');

    if (!project) return jsonError('Project not found', 404);
    return NextResponse.json(project);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Failed to load project');
  }
}
