// components/news/NewsSkeleton.tsx

export default function NewsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="aspect-[16/9] animate-pulse bg-slate-200" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
            <div className="h-5 animate-pulse rounded bg-slate-200" />
            <div className="h-4 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}