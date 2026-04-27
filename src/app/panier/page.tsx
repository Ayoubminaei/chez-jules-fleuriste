import { CartView } from "./CartView";

export const metadata = {
  title: "Panier",
};

export default function CartPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 lg:px-10 mt-8 lg:mt-12">
      <h1 className="text-3xl lg:text-5xl text-[color:var(--color-forest)] font-[family-name:var(--font-display)]">
        Votre panier
      </h1>
      <CartView />
    </section>
  );
}
