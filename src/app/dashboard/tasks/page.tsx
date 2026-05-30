'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Calendar, CheckCircle2, MessageSquare, MoreHorizontal, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { PageHeader } from '@/components/page-shell';
import { TaskDetailDialog } from '@/components/task-detail-dialog';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type TaskStatus = 'Todo' | 'In Progress' | 'Review' | 'Completed';
type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
}

const columns: { id: TaskStatus; title: string }[] = [
  { id: 'Todo', title: 'To Do' },
  { id: 'In Progress', title: 'In Progress' },
  { id: 'Review', title: 'Review' },
  { id: 'Completed', title: 'Completed' },
];

const priorityVariant: Record<TaskPriority, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Urgent: 'destructive',
  High: 'default',
  Medium: 'secondary',
  Low: 'outline',
};

export default function KanbanBoard() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [saveError, setSaveError] = useState('');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await api.get('/projects');
      return res.data;
    },
  });

  useEffect(() => {
    if (projects && projects.length > 0 && !projectId) {
      setProjectId(projects[0]._id);
    }
  }, [projects, projectId]);

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      const res = await api.get(`/tasks/project/${projectId}`);
      return res.data;
    },
    enabled: !!projectId,
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TaskStatus }) => {
      const res = await api.put(`/tasks/${id}/status`, { status });
      return res.data;
    },
    onMutate: async (newStatus) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', projectId] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks', projectId]);

      queryClient.setQueryData<Task[]>(['tasks', projectId], (old) => {
        if (!old) return [];
        return old.map((task) => (task._id === newStatus.id ? { ...task, status: newStatus.status } : task));
      });

      return { previousTasks };
    },
    onError: (err, newStatus, context) => {
      queryClient.setQueryData(['tasks', projectId], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
  });

  const updateTaskContentMutation = useMutation({
    mutationFn: async ({ id, title, description }: { id: string; title: string; description: string }) => {
      const res = await api.put(`/tasks/${id}`, { title, description });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsEditing(false);
      setSelectedTask(null);
      setSaveError('');
      toast.success('Changes saved successfully');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    },
    onError: (err: any) => {
      setSaveError(err.response?.data?.message || 'Failed to save task. Check your permissions.');
    },
  });

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleEditTask = () => {
    if (selectedTask) {
      setEditTitle(selectedTask.title);
      setEditDescription(selectedTask.description || '');
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (selectedTask) {
      updateTaskContentMutation.mutate({
        id: selectedTask._id,
        title: editTitle,
        description: editDescription,
      });
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    updateTaskMutation.mutate({ id: draggableId, status: destination.droppableId as TaskStatus });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Board view"
        description="Drag tasks between columns to update status. Open a card to inspect or edit details."
        actions={
          <Link href={`/dashboard/tasks/new?projectId=${projectId || ''}`} className={cn(buttonVariants({ variant: 'default' }))}>
            <Plus className="size-4" />
            Add task
          </Link>
        }
      />

      {!projectId && !isLoading ? (
        <Card>
          <CardContent className="flex min-h-80 flex-col items-center justify-center text-center">
            <CheckCircle2 className="mb-3 size-10 text-muted-foreground" />
            <h3 className="text-lg font-medium">No projects found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Create a project to start adding tasks.</p>
            <Link href="/dashboard/projects/new" className={cn(buttonVariants({ variant: 'default' }), 'mt-5')}>
              Create project
            </Link>
          </CardContent>
        </Card>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <ScrollArea className="w-full">
            <div className="flex min-h-[calc(100vh-220px)] gap-4 pb-4">
              {columns.map((column) => {
                const columnTasks = tasks.filter((task) => task.status === column.id);

                return (
                  <Card key={column.id} className="w-80 shrink-0">
                    <CardHeader className="border-b">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          {column.title}
                          <Badge variant="secondary">{columnTasks.length}</Badge>
                        </CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Column actions</span>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Sort by priority</DropdownMenuItem>
                            <DropdownMenuItem>Collapse column</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={cn('min-h-72 flex-1 space-y-3 px-4 pb-4 transition-colors', snapshot.isDraggingOver && 'bg-muted/50')}
                        >
                          {isLoading ? (
                            <>
                              <Skeleton className="h-28 rounded-lg" />
                              <Skeleton className="h-28 rounded-lg" />
                            </>
                          ) : (
                            columnTasks.map((task, index) => (
                              <Draggable key={task._id} draggableId={task._id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    onClick={() => setSelectedTask(task)}
                                    className={cn(
                                      'rounded-lg border bg-background p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-muted/30 hover:shadow-md',
                                      snapshot.isDragging && 'rotate-1 shadow-xl ring-2 ring-primary'
                                    )}
                                  >
                                    <div className="mb-3 flex items-start justify-between gap-3">
                                      <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
                                      <MoreHorizontal className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                                    </div>
                                    <h4 className="line-clamp-2 font-medium">{task.title}</h4>
                                    {task.description && (
                                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
                                    )}
                                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                                      <div className="flex items-center gap-3">
                                        {task.dueDate && (
                                          <span className="flex items-center gap-1">
                                            <Calendar className="size-3" />
                                            {new Date(task.dueDate).toLocaleDateString()}
                                          </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                          <MessageSquare className="size-3" />0
                                        </span>
                                      </div>
                                      <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                                        U
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </DragDropContext>
      )}

      <TaskDetailDialog
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTask(null);
            setIsEditing(false);
          }
        }}
        isEditing={isEditing}
        onEdit={handleEditTask}
        onCancelEdit={() => setIsEditing(false)}
        onSave={handleSaveEdit}
        editTitle={editTitle}
        editDescription={editDescription}
        setEditTitle={setEditTitle}
        setEditDescription={setEditDescription}
        isSaving={updateTaskContentMutation.isPending}
        saveError={saveError}
        assigneeName={user?.name}
      />
    </div>
  );
}
