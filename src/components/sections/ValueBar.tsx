import { Leaf, Sparkles, Truck, Undo2 } from "lucide-react";

const items = [
  { icon: Leaf, label: "Fleurs de saison" },
  { icon: Truck, label: "Livraison J+0 Paris" },
  { icon: Sparkles, label: "Composé à la main" },
  { icon: Undo2, label: "Satisfait ou refait" },
];

export function ValueBar() {
  return (
    <section className="border-y border-(--color-line) bg-(--color-cream)">
      <div className="container-x grid grid-cols-2 gap-y-6 py-6 md:grid-cols-4">
        {items.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center justify-center gap-2 text-sm text-(--color-forest)"
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
