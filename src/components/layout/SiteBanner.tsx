import Link from "next/link";
import { getActiveBanner } from "@/lib/banners";
import { DismissBanner } from "./DismissBanner";

export async function SiteBanner() {
  const banner = await getActiveBanner();
  if (!banner) return null;

  return (
    <div
      id={`banner-${banner.id}`}
      style={{
        backgroundColor: banner.bg_color,
        color: banner.text_color,
      }}
      className="text-xs sm:text-sm"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-10 py-2.5 flex items-center gap-3">
        <p className="flex-1 text-center sm:text-left">
          {banner.message}
          {banner.link_href && (
            <Link
              href={banner.link_href}
              className="ml-2 underline underline-offset-2 hover:opacity-80"
              style={{ color: banner.text_color }}
            >
              {banner.link_label ?? "En savoir plus"}
            </Link>
          )}
        </p>
        {banner.dismissible && <DismissBanner id={banner.id} />}
      </div>
    </div>
  );
}
