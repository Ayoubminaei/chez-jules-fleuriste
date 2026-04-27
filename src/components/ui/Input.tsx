import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-(--radius-md) border border-(--color-line) bg-white/70 px-4 text-sm",
        "placeholder:text-(--color-muted) outline-none transition-colors",
        "focus:border-(--color-forest) focus:bg-white",
        "disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
