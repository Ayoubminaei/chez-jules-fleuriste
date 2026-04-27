import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <section className="mx-auto max-w-7xl px-5 lg:px-10 mt-6 grid lg:grid-cols-12 gap-6 lg:gap-10">
      <div className="lg:col-span-7">
        <Skeleton className="aspect-[4/5] md:aspect-[5/4] w-full rounded-[var(--radius-frame)]" />
      </div>
      <div className="lg:col-span-5 space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-10 w-32 mt-4" />
        <Skeleton className="h-12 w-full mt-4 rounded-full" />
      </div>
    </section>
  );
}
