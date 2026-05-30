import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Todo' | 'In Progress' | 'Review' | 'Completed';
  assignedTo?: mongoose.Types.ObjectId;
  dueDate?: Date;
  project: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
    status: { type: String, enum: ['Todo', 'In Progress', 'Review', 'Completed'], default: 'Todo' },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    dueDate: { type: Date },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Task = (mongoose.models.Task as Model<ITask>) || mongoose.model<ITask>('Task', taskSchema);
