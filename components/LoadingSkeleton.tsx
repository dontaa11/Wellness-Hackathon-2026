export function LoadingSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton h-4 w-full" style={{ width: `${100 - i * 15}%` }} />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card space-y-4">
      <div className="skeleton h-6 w-1/3" />
      <LoadingSkeleton lines={4} />
    </div>
  );
}
