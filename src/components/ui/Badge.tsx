import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-(--radius-pill) px-2.5 py-1 text-xs font-medium uppercase tracking-[0.08em]",
  {
    variants: {
      tone: {
        forest: "bg-(--color-forest) text-(--color-cream)",
        cream: "bg-(--color-cream) text-(--color-forest) border border-(--color-line)",
        bloom: "bg-(--color-bloom-50) text-(--color-terracotta-600)",
        sage: "bg-(--color-sage-50) text-(--color-forest)",
        gold: "bg-(--color-cream) text-(--color-gold) border border-(--color-gold)/40",
      },
    },
    defaultVariants: { tone: "forest" },
  },
);

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, tone, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone }), className)} {...props} />
  );
}
