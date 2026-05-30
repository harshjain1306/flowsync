'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Activity, Calendar, CheckCircle2, Clock, Sparkles, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { PageHeader, StatCard } from '@/components/page-shell';
import { TaskDetailDialog } from '@/components/task-detail-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [saveError, setSaveError] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await api.get('/projects');
      return res.data;
    },
  });

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await api.get('/tasks');
      return res.data;
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
        queryClient.invalidateQueries();
      }, 1500);
    },
    onError: (err: any) => {
      setSaveError(err.response?.data?.message || 'Failed to save task. Check your permissions.');
    },
  });

  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(true);
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

  const filteredTasks = tasks.filter((task: any) => !filterStatus || task.status === filterStatus);
  const completedCount = tasks.filter((task: any) => task.status === 'Completed').length;
  const inProgressCount = tasks.filter((task: any) => task.status === 'In Progress').length;
  const productivity = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Good morning, ${user?.name?.split(' ')[0] || 'there'}`}
        description="A clean view of task volume, delivery progress, and the most recent work in motion."
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard title="Total tasks" value={tasks.length} icon={Activity} active={!filterStatus} onClick={() => setFilterStatus(null)} />
        <StatCard title="Completed" value={completedCount} icon={CheckCircle2} active={filterStatus === 'Completed'} onClick={() => setFilterStatus('Completed')} />
        <StatCard title="In progress" value={inProgressCount} icon={Clock} active={filterStatus === 'In Progress'} onClick={() => setFilterStatus('In Progress')} />
        <StatCard title="Productivity" value={`${productivity}%`} icon={TrendingUp} detail="Completed task ratio" />
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <div>
              <CardTitle>{filterStatus ? `${filterStatus} tasks` : 'Recent tasks'}</CardTitle>
              <CardDescription>Open a task to inspect details or edit its copy.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 rounded-lg" />
                ))}
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed text-center">
                <CheckCircle2 className="mb-3 size-10 text-muted-foreground" />
                <p className="font-medium">You're all caught up.</p>
                <p className="text-sm text-muted-foreground">No tasks match this view.</p>
              </div>
            ) : (
              <div className="divide-y rounded-lg border">
                {filteredTasks.slice(0, 5).map((task: any) => (
                  <button
                    key={task._id}
                    type="button"
                    onClick={() => setSelectedTask(task)}
                    className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="truncate font-medium">{task.title}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary">{task.status}</Badge>
                        <Badge variant="outline">{task.priority}</Badge>
                      </div>
                    </div>
                    <Button type="button" variant="ghost" size="sm">
                      Details
                    </Button>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4" />
              AI insights
            </CardTitle>
            <CardDescription>Lightweight operational signals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Completion rate</span>
                <span className="font-medium">{productivity}%</span>
              </div>
              <Progress value={productivity} />
            </div>
            <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-6">
              You have completed <span className="font-semibold">{completedCount}</span> of <span className="font-semibold">{tasks.length}</span> tracked tasks.
            </div>
            <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-6">
              <span className="font-semibold">Suggestion:</span> Review high-priority work before adding new tasks to the active sprint.
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="size-3.5" />
              Updated from current task data
            </div>
          </CardContent>
        </Card>
      </div>

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
        onEdit={() => selectedTask && handleEditTask(selectedTask)}
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
