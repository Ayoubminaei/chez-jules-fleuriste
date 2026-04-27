import Link from "next/link";

export const metadata = {
  title: "Connexion",
};

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-md px-5 lg:px-10 mt-12 lg:mt-20">
      <h1 className="text-3xl lg:text-4xl text-[color:var(--color-forest)] font-[family-name:var(--font-display)] text-center">
        Bon retour
      </h1>
      <p className="mt-2 text-sm text-[color:var(--color-mute)] text-center">
        Connectez-vous pour retrouver vos commandes et vos favoris.
      </p>

      <form className="mt-8 rounded-[var(--radius-frame)] bg-[color:var(--color-cream)] border border-black/5 p-6 sm:p-8 space-y-4">
        <div>
          <label className="text-xs uppercase tracking-widest text-[color:var(--color-mute)]">
            Email
          </label>
          <input
            type="email"
            required
            className="mt-1.5 w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-forest)]"
            placeholder="vous@email.fr"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[color:var(--color-mute)]">
            Mot de passe
          </label>
          <input
            type="password"
            required
            className="mt-1.5 w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-forest)]"
          />
        </div>
        <button
          type="submit"
          className="w-full px-6 py-3 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] hover:bg-[color:var(--color-forest-soft)] transition-colors text-sm"
        >
          Se connecter
        </button>
      </form>

      <p className="mt-6 text-sm text-center text-[color:var(--color-mute)]">
        Pas encore de compte ?{" "}
        <Link href="/login?mode=signup" className="text-[color:var(--color-forest)] underline">
          Créer un compte
        </Link>
      </p>
    </section>
  );
}
