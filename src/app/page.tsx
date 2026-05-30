'use client';
import { ArrowRight, CheckCircle2, Gauge, ShieldCheck, Workflow } from 'lucide-react';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <BrandLogo />
        <nav className="flex items-center gap-2">
          <Link href="/login" className={cn(buttonVariants({ variant: 'ghost' }))}>
            Sign in
          </Link>
          <Link href="/signup" className={cn(buttonVariants({ variant: 'default' }))}>
            Register
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1fr_0.9fr] md:items-center md:py-24">
        <div className="space-y-8">
          <Badge variant="outline" className="gap-1.5">
            <CheckCircle2 className="size-3" />
            Workspace ready
          </Badge>
          <div className="space-y-4">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-balance md:text-7xl">
              FlowSync
            </h1>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              Premium task management for modern teams that need clear priorities, crisp execution, and a focused operating rhythm.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/login" className={cn(buttonVariants({ size: 'lg' }), 'h-11 px-5')}>
              Sign in
              <ArrowRight className="size-4" />
            </Link>
            <Link href="/signup" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'h-11 px-5')}>
              Create account
            </Link>
          </div>
        </div>

        <Card className="shadow-2xl shadow-foreground/5">
          <CardContent className="space-y-5">
            <div className="rounded-xl border bg-muted/30 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Sprint health</p>
                  <p className="text-xs text-muted-foreground">Frontend rebuild</p>
                </div>
                <Badge>82%</Badge>
              </div>
              <div className="grid gap-2">
                {['Design system pass', 'Auth polish', 'Board QA'].map((item, index) => (
                  <div key={item} className="flex items-center justify-between rounded-lg bg-background p-3 text-sm ring-1 ring-border">
                    <span>{item}</span>
                    <Badge variant={index === 0 ? 'default' : 'secondary'}>{index === 0 ? 'Done' : 'Active'}</Badge>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: Workflow, label: 'Flow', value: '24' },
                { icon: Gauge, label: 'Velocity', value: '+15%' },
                { icon: ShieldCheck, label: 'Focus', value: 'High' },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border p-3">
                  <item.icon className="mb-3 size-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}