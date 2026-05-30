'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { PageHeader } from '@/components/page-shell';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export default function NewProjectPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: async (newProject: { name: string; description: string }) => {
      const res = await api.post('/projects', newProject);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setShowSuccess(true);
      toast.success('Project created successfully');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create project. You might not have permission.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      createProjectMutation.mutate({ name, description });
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Create new project"
        description="Start a workspace for a focused stream of tasks."
        actions={
          <Link href="/dashboard/tasks" className={cn(buttonVariants({ variant: 'outline' }))}>
            <ArrowLeft className="size-4" />
            Back
          </Link>
        }
      />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project name</Label>
              <Input
                id="project-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                autoFocus
                placeholder="e.g. Website Redesign"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-description">Description <span className="text-muted-foreground">(optional)</span></Label>
              <Textarea
                id="project-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Briefly describe what this project is about..."
                rows={5}
              />
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Link href="/dashboard/tasks" className={cn(buttonVariants({ variant: 'outline' }))}>
              Cancel
            </Link>
            <Button type="submit" disabled={createProjectMutation.isPending || showSuccess}>
              {createProjectMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {showSuccess ? (
                <>
                  <CheckCircle2 className="size-4" /> Project saved
                </>
              ) : createProjectMutation.isPending ? (
                'Creating...'
              ) : (
                'Create project'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
