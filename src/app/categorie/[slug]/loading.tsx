import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <>
      <section className="md:hidden px-5 mt-2">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="mt-2 h-4 w-1/3" />
      </section>

      <section className="hidden md:block mx-auto max-w-7xl px-5 lg:px-10 mt-6">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="mt-5 h-14 w-2/3" />
        <Skeleton className="mt-3 h-4 w-1/2" />
        <Skeleton className="mt-6 aspect-[21/9] w-full rounded-[var(--radius-frame)]" />
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-10 mt-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[4/5] w-full" />
              <Skeleton className="mt-3 h-4 w-3/4" />
              <Skeleton className="mt-1.5 h-3 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
