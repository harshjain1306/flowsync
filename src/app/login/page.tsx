'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Shield, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';
import { BrandLogo } from '@/components/brand-logo';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<'Admin' | 'Member'>('Admin');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    if (selectedRole === 'Admin') {
      setEmail('admin@flow.com');
    } else {
      setEmail('member@flow.com');
    }
  }, [selectedRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data, data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[1fr_0.85fr]">
      <section className="hidden border-r bg-muted/30 p-10 lg:flex lg:flex-col lg:justify-between">
        <BrandLogo />
        <div className="max-w-md space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight">Run every workstream from a calmer command center.</h1>
          <p className="text-muted-foreground">
            Sign in with a demo role or your own workspace credentials. The authentication flow and redirects are unchanged.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex justify-center lg:hidden">
          <BrandLogo />
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Enter your credentials to access your workspace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <ToggleGroup
          value={[selectedRole]}
          onValueChange={(value) => value?.[0] && setSelectedRole(value[0] as 'Admin' | 'Member')}
          className="grid grid-cols-2 rounded-lg border bg-muted/30 p-1"
        >
          <ToggleGroupItem value="Admin" className="gap-2">
            <Shield className="size-4" /> Admin
          </ToggleGroupItem>
          <ToggleGroupItem value="Member" className="gap-2">
            <Users className="size-4" /> Member
          </ToggleGroupItem>
        </ToggleGroup>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>

          <div className="flex items-center gap-2 py-1 text-sm">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="font-normal text-muted-foreground">
              Remember me
            </Label>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="space-y-3 border-t pt-6">
          <p className="text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">Instant demo access</p>
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              onClick={async () => {
                setIsLoading(true);
                try {
                  const { data } = await api.post('/auth/login', { email: 'admin@flow.com', password: 'password123' });
                  login(data, data.token);
                  router.push('/dashboard');
                } catch (err) {
                  setError('Demo login failed');
                  setIsLoading(false);
                }
              }}
              className="w-full justify-center"
            >
              <Shield className="size-4" /> Continue as workspace admin
            </Button>
            <Button
              variant="secondary"
              onClick={async () => {
                setIsLoading(true);
                try {
                  const { data } = await api.post('/auth/login', { email: 'member@flow.com', password: 'password123' });
                  login(data, data.token);
                  router.push('/dashboard');
                } catch (err) {
                  setError('Demo login failed');
                  setIsLoading(false);
                }
              }}
              className="w-full justify-center"
            >
              <Users className="size-4" /> Continue as team member
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/signup" className={cn(buttonVariants({ variant: 'link' }), 'h-auto p-0')}>
            Sign up
          </Link>
        </p>
          </CardContent>
        </Card>
      </motion.div>
      </section>
    </main>
  );
}
