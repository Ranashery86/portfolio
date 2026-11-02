"use client";

import { Play } from "lucide-react";
import { useState } from "react";

type LoomFacadeProps = {
  loomUrl: string;
  title: string;
};

function getLoomEmbedUrl(url: string) {
  const match = url.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/);

  return match ? `https://www.loom.com/embed/${match[1]}` : url;
}

export function LoomFacade({ loomUrl, title }: LoomFacadeProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const embedUrl = getLoomEmbedUrl(loomUrl);

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-violet-light/30 bg-violet-deep">
      {isLoaded ? (
        <iframe
          src={embedUrl}
          title={`${title} walkthrough video`}
          loading="lazy"
          allow="fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsLoaded(true)}
          className="group absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-inset focus-visible:outline-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 45%, rgba(139, 124, 199, 0.2), rgba(42, 30, 77, 0.9) 70%)",
          }}
        >
          <span className="flex size-16 items-center justify-center rounded-full border border-violet-light/40 bg-violet-light/15 text-violet-light transition duration-300 group-hover:scale-105 group-hover:bg-violet-light/25">
            <Play aria-hidden className="ml-1 size-6 fill-current" />
          </span>
          <span className="font-heading text-lg font-semibold text-white">
            Play walkthrough
          </span>
          <span className="text-sm text-lavender/70">
            Video loads only when you press play
          </span>
        </button>
      )}
    </div>
  );
}
