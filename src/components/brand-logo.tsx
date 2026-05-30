import Link from 'next/link';
import { CircleDotDashed } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BrandLogo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2 font-semibold tracking-tight', className)}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <CircleDotDashed className="size-4" />
      </span>
      {!compact && (
        <span className="text-base">
          FlowSync <span className="text-muted-foreground">AI</span>
        </span>
      )}
    </Link>
  );
}
