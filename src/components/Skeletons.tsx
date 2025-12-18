import { cn } from '@/lib/utils';
import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function LoadingSkeleton({ className, style }: LoadingSkeletonProps) {
  return <div className={cn('skeleton-pulse h-4 w-full', className)} style={style} />;
}

export function MetricCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between">
        <LoadingSkeleton className="h-4 w-24" />
        <LoadingSkeleton className="h-8 w-8 rounded-lg" />
      </div>
      <LoadingSkeleton className="mt-4 h-8 w-20" />
      <LoadingSkeleton className="mt-2 h-3 w-32" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      <LoadingSkeleton className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <LoadingSkeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <LoadingSkeleton className="mb-4 h-5 w-40" />
      <div className="flex h-[300px] items-end justify-around gap-2 pt-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <LoadingSkeleton
            key={i}
            className="w-full"
            style={{ height: `${30 + Math.random() * 60}%` }}
          />
        ))}
      </div>
    </div>
  );
}
