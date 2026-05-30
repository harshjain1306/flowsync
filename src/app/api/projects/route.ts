import { NextRequest, NextResponse } from 'next/server';
import { isAuthError, jsonError, requireUser } from '@/server/auth';
import { Project } from '@/server/models/Project';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    if (isAuthError(user)) return user;

    const projects = await Project.find({
      $or: [{ admin: user._id }, { members: user._id }],
    })
      .populate('admin', 'name email')
      .populate('members', 'name email');

    return NextResponse.json(projects);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Failed to load projects');
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    if (isAuthError(user)) return user;

    const { name, description, members } = await req.json();
    if (!name) return jsonError('Project name is required', 400);

    const project = await Project.create({
      name,
      description,
      admin: user._id,
      members: members || [],
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Failed to create project');
  }
}
