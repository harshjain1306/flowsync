'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  Plus
} from 'lucide-react';
import { BrandLogo } from '@/components/brand-logo';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'My Tasks', icon: CheckSquare, href: '/dashboard/tasks' },
  { name: 'Calendar', icon: Calendar, href: '/dashboard/calendar' },
  { name: 'Team', icon: Users, href: '/dashboard/team' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const NavContent = () => (
    <>
      <div className="px-3 py-4">
        <BrandLogo className="px-2" />
      </div>
      <nav className="grid gap-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground',
                isActive && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
              )}
            >
              <item.icon className="size-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-3">
        <Separator className="mb-3" />
        <Link
          href="/dashboard/settings"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground',
            pathname === '/dashboard/settings' && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
          )}
        >
          <Settings className="size-4" />
          Settings
        </Link>
        <Button
          type="button"
          variant="ghost"
          className="mt-1 w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => {
            logout();
            router.push('/login');
          }}
        >
          <LogOut className="size-4" />
          Logout
        </Button>
        <div className="mt-4 flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
          <Avatar className="size-9">
            <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.role}</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-background/95 backdrop-blur lg:flex">
        <NavContent />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/85 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger render={<Button variant="outline" size="icon" className="lg:hidden" />}>
                <Menu className="size-4" />
                <span className="sr-only">Open navigation</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <NavContent />
              </SheetContent>
            </Sheet>
            <div>
              <p className="text-sm font-medium">Workspace</p>
              <p className="hidden text-xs text-muted-foreground sm:block">FlowSync operations</p>
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger
              render={
                <Link
                  href="/dashboard/tasks/new"
                  className={cn(buttonVariants({ variant: 'default' }), 'h-8')}
                />
              }
            >
              <Plus className="size-4" />
              New task
            </TooltipTrigger>
            <TooltipContent>Create a task from the active project board.</TooltipContent>
          </Tooltip>
        </header>

        <main className="mx-auto max-w-7xl p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
