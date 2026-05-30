import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        {description && <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  title,
  value,
  icon: Icon,
  active,
  onClick,
  detail,
}: {
  title: string;
  value: React.ReactNode;
  icon: LucideIcon;
  active?: boolean;
  onClick?: () => void;
  detail?: string;
}) {
  const content = (
    <Card className={cn('transition-all duration-200 hover:-translate-y-0.5 hover:ring-foreground/20', active && 'ring-2 ring-primary')}>
      <CardContent className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="text-3xl font-semibold tracking-tight">{value}</div>
          {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
        </div>
        <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-foreground">
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  );

  if (!onClick) return content;

  return (
    <button type="button" onClick={onClick} className="text-left">
      {content}
    </button>
  );
}
