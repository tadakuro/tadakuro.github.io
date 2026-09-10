"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ScreenshotGallery({ screenshots }: { screenshots: string[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [screenshots]);

  if (!screenshots.length) {
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 text-slate-400 dark:border-slate-700">
        No screenshots yet
      </div>
    );
  }

  const prev = () => setActive((a) => (a - 1 + screenshots.length) % screenshots.length);
  const next = () => setActive((a) => (a + 1) % screenshots.length);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
        <Image
          src={screenshots[active]}
          alt="Screenshot"
          fill
          className="object-contain"
          sizes="(max-width: 1536px) 100vw"
        />
        {screenshots.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous screenshot"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur transition hover:bg-black/70"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next screenshot"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur transition hover:bg-black/70"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
      {screenshots.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {screenshots.map((s, i) => (
            <button
              key={s + i}
              type="button"
              onClick={() => setActive(i)}
              className={
                i === active
                  ? "h-14 w-20 overflow-hidden rounded-lg ring-2 ring-primary-500"
                  : "h-14 w-20 overflow-hidden rounded-lg opacity-60 transition hover:opacity-100"
              }
            >
              <Image
                src={s}
                alt=""
                width={80}
                height={56}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}