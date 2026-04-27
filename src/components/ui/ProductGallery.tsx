"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.clientWidth;
      const idx = Math.round(el.scrollLeft / w);
      setActive(Math.min(images.length - 1, Math.max(0, idx)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [images.length]);

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: el.clientWidth * i, behavior: "smooth" });
  };

  return (
    <div>
      {/* Mobile: swipeable carousel */}
      <div className="md:hidden">
        <div
          ref={trackRef}
          className="flex overflow-x-auto snap-x-mandatory scrollbar-hidden rounded-[var(--radius-frame)]"
        >
          {images.map((src, i) => (
            <div
              key={src}
              className="snap-center-2 shrink-0 w-full relative aspect-[4/5] bg-black/5"
            >
              <Image
                src={src}
                alt={`${alt} — vue ${i + 1}`}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                aria-label={`Voir image ${i + 1}`}
                onClick={() => goTo(i)}
                className={[
                  "h-1.5 rounded-full transition-all",
                  i === active
                    ? "w-6 bg-[color:var(--color-forest)]"
                    : "w-1.5 bg-black/20",
                ].join(" ")}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: grid */}
      <div className="hidden md:grid grid-cols-6 gap-3">
        <div className="col-span-6 relative aspect-[5/4] rounded-[var(--radius-frame)] overflow-hidden bg-black/5">
          <Image
            src={images[0]}
            alt={alt}
            fill
            priority
            sizes="60vw"
            className="object-cover"
          />
        </div>
        {images.slice(1).map((src, i) => (
          <div
            key={src}
            className="col-span-3 relative aspect-square rounded-[var(--radius-soft)] overflow-hidden bg-black/5"
          >
            <Image
              src={src}
              alt={`${alt} — vue ${i + 2}`}
              fill
              sizes="30vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
