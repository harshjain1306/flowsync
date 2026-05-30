'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/axios';
import { PageHeader } from '@/components/page-shell';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

function NewTaskForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!projectId) {
      router.push('/dashboard/tasks');
    }
  }, [projectId, router]);

  const createTaskMutation = useMutation({
    mutationFn: async (newTask: any) => {
      const res = await api.post('/tasks', newTask);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      router.push('/dashboard/tasks');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && projectId) {
      createTaskMutation.mutate({
        title,
        description,
        priority,
        projectId,
        dueDate: dueDate || undefined,
      });
    }
  };

  if (!projectId) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Create new task"
        description="Add a task to the active Kanban board."
        actions={
          <Link href="/dashboard/tasks" className={cn(buttonVariants({ variant: 'outline' }))}>
            <ArrowLeft className="size-4" />
            Back
          </Link>
        }
      />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="task-title">Task title</Label>
              <Input
                id="task-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                autoFocus
                placeholder="e.g. Design homepage hero"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Add any relevant details, links, or sub-tasks..."
                rows={5}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(value) => value && setPriority(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="due-date">Due date</Label>
                <Input id="due-date" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Link href="/dashboard/tasks" className={cn(buttonVariants({ variant: 'outline' }))}>
              Cancel
            </Link>
            <Button type="submit" disabled={createTaskMutation.isPending}>
              {createTaskMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {createTaskMutation.isPending ? 'Creating...' : 'Create task'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default function NewTaskPage() {
  return (
    <Suspense fallback={<Skeleton className="mx-auto h-96 max-w-2xl rounded-xl" />}>
      <NewTaskForm />
    </Suspense>
  );
}
