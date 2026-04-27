import { FavoritesView } from "./FavoritesView";

export const metadata = {
  title: "Favoris",
};

export default function FavoritesPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 lg:px-10 mt-8 lg:mt-12">
      <h1 className="text-3xl lg:text-5xl text-[color:var(--color-forest)] font-[family-name:var(--font-display)]">
        Vos favoris
      </h1>
      <p className="mt-2 text-[color:var(--color-mute)] max-w-md">
        Les pièces que vous avez sauvegardées, prêtes à être commandées.
      </p>
      <FavoritesView />
    </section>
  );
}
