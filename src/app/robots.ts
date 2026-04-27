import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://chez-jules.fr"
  );

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/checkout/", "/compte/", "/panier", "/favoris"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
