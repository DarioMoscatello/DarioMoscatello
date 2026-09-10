"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Media } from "@/data/site";

export default function Plate({ media }: { media: Media }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <figure className="plate" data-interactive>
        <button
          type="button"
          className="plate-btn"
          onClick={() => setOpen(true)}
          aria-label={`Open ${media.alt}`}
        >
          <Image
            src={media.src}
            alt={media.alt}
            width={media.width}
            height={media.height}
            sizes="(max-width: 860px) 92vw, 520px"
          />
        </button>
        {media.caption ? <figcaption>{media.caption}</figcaption> : null}
      </figure>

      {open && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <button type="button" className="lightbox-close">
            Close
          </button>
          <Image
            src={media.src}
            alt={media.alt}
            width={media.width}
            height={media.height}
            sizes="94vw"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
