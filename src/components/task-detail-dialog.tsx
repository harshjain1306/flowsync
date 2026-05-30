'use client';

import { Calendar, Loader2, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

type TaskLike = {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
};

export function TaskDetailDialog({
  task,
  open,
  onOpenChange,
  isEditing,
  onEdit,
  onCancelEdit,
  onSave,
  editTitle,
  editDescription,
  setEditTitle,
  setEditDescription,
  isSaving,
  saveError,
  assigneeName,
}: {
  task: TaskLike | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  editTitle: string;
  editDescription: string;
  setEditTitle: (value: string) => void;
  setEditDescription: (value: string) => void;
  isSaving?: boolean;
  saveError?: string;
  assigneeName?: string;
}) {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline">{task.priority}</Badge>
            <Badge variant="secondary">{task.status}</Badge>
          </div>
          <DialogTitle>{isEditing ? 'Edit task' : task.title}</DialogTitle>
          {!isEditing && (
            <DialogDescription>
              {task.description || 'No description provided for this task.'}
            </DialogDescription>
          )}
        </DialogHeader>

        {saveError && (
          <Alert variant="destructive">
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        )}

        {isEditing && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Task title</Label>
              <Input id="task-title" value={editTitle} onChange={(event) => setEditTitle(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                rows={5}
                value={editDescription}
                onChange={(event) => setEditDescription(event.target.value)}
              />
            </div>
          </div>
        )}

        <div className="grid gap-3 rounded-lg border bg-muted/30 p-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase text-muted-foreground">Due date</p>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="size-4 text-muted-foreground" />
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date set'}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase text-muted-foreground">Assignee</p>
            <div className="flex items-center gap-2 text-sm">
              <UserRound className="size-4 text-muted-foreground" />
              {assigneeName || 'Unassigned'}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (isEditing) onCancelEdit();
              else onOpenChange(false);
            }}
          >
            {isEditing ? 'Cancel' : 'Close'}
          </Button>
          {isEditing ? (
            <Button type="button" onClick={onSave} disabled={isSaving}>
              {isSaving && <Loader2 className="size-4 animate-spin" />}
              Save changes
            </Button>
          ) : (
            <Button type="button" onClick={onEdit}>
              Edit task
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
