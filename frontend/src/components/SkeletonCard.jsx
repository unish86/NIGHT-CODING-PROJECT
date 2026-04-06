const SkeletonCard = () => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 animate-pulse shadow-sm">
    <div className="flex items-center gap-2">
      <div className="h-5 w-5 bg-slate-200 rounded-full" />
      <div className="h-3 bg-slate-200 rounded w-16" />
    </div>
    <div className="h-4 bg-slate-200 rounded w-3/4" />
    <div className="h-3 bg-slate-100 rounded w-full" />
    <div className="h-3 bg-slate-100 rounded w-5/6" />
  </div>
);

export default SkeletonCard;
