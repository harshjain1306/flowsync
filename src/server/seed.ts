import { Project } from './models/Project';
import { Task } from './models/Task';
import { User } from './models/User';

let seededThisProcess = false;

export async function ensureDemoData() {
  if (seededThisProcess) return;

  const adminExists = await User.findOne({ email: 'admin@flow.com' });
  if (adminExists) {
    seededThisProcess = true;
    return;
  }

  const admin = await User.create({
    name: 'Demo Admin',
    email: 'admin@flow.com',
    password: 'password123',
    role: 'Admin',
  });

  const member = await User.create({
    name: 'Demo Member',
    email: 'member@flow.com',
    password: 'password123',
    role: 'Member',
  });

  const project = await Project.create({
    name: 'FlowSync Launch',
    description: 'The primary project for launching the SaaS platform.',
    admin: admin._id,
    members: [admin._id, member._id],
  });

  await Task.create([
    {
      title: 'Design Hero Section',
      description: 'Create a polished hero section for the landing page.',
      priority: 'High',
      status: 'In Progress',
      assignedTo: admin._id,
      project: project._id,
      createdBy: admin._id,
    },
    {
      title: 'API Authentication',
      description: 'Implement JWT authentication and role-aware access.',
      priority: 'Urgent',
      status: 'Completed',
      assignedTo: admin._id,
      project: project._id,
      createdBy: admin._id,
    },
    {
      title: 'Mobile App Layout',
      description: 'Draft the responsive mobile dashboard layout.',
      priority: 'Medium',
      status: 'Todo',
      assignedTo: member._id,
      project: project._id,
      createdBy: admin._id,
    },
  ]);

  seededThisProcess = true;
}
