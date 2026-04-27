import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <header className={cn("container-x pt-16 pb-10 md:pt-24 md:pb-14", className)}>
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.18em] text-(--color-muted)">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-3 font-display text-4xl md:text-6xl tracking-tight text-balance">
        {title}
      </h1>
      {description && (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-(--color-muted) md:text-lg">
          {description}
        </p>
      )}
    </header>
  );
}
