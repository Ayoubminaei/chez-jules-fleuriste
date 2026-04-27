import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@/components/ui/Slot";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium tracking-tight whitespace-nowrap transition-all duration-300 ease-[var(--ease-out-expo)] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-forest) active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-(--color-forest) text-(--color-cream) hover:bg-(--color-forest-700) shadow-(--shadow-soft)",
        secondary:
          "bg-(--color-cream) text-(--color-forest) border border-(--color-line) hover:border-(--color-forest) hover:bg-(--color-forest-50)",
        ghost:
          "bg-transparent text-(--color-forest) hover:bg-(--color-forest-50)",
        accent:
          "bg-(--color-terracotta) text-white hover:bg-(--color-terracotta-600) shadow-(--shadow-soft)",
        link:
          "bg-transparent text-(--color-forest) underline-offset-4 hover:underline px-0 py-0",
      },
      size: {
        sm: "h-9 px-4 text-sm rounded-(--radius-pill)",
        md: "h-11 px-6 text-sm rounded-(--radius-pill)",
        lg: "h-13 px-8 text-base rounded-(--radius-pill)",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
