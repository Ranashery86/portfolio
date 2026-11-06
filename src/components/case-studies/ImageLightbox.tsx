"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";

type ImageLightboxProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  children: ReactNode;
};

export function ImageLightbox({
  src,
  alt,
  width,
  height,
  children,
}: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function openDialog() {
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      closeDialog();
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openDialog}
        aria-label={`Enlarge image: ${alt}`}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-2 focus-visible:ring-offset-lavender focus-visible:outline-none"
      >
        <span className="block transition-transform duration-300 ease-out group-hover:scale-[1.01] motion-reduce:transform-none motion-reduce:transition-none">
          {children}
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-ink/80 text-lavender shadow-lg"
        >
          <ZoomIn className="size-4" />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        onClick={handleBackdropClick}
        onCancel={(event) => {
          event.preventDefault();
          closeDialog();
        }}
        onClose={() => triggerRef.current?.focus()}
        aria-label={`Image preview: ${alt}`}
        className="image-lightbox m-auto max-h-[90vh] w-[95vw] max-w-[95vw] rounded-2xl border border-violet-light/30 bg-ink p-4 text-lavender shadow-2xl sm:p-6"
      >
        <div className="flex max-h-[calc(90vh-4rem)] flex-col gap-3">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeDialog}
              aria-label="Close image preview"
              className="flex size-11 items-center justify-center rounded-full border border-violet-light/30 bg-violet-deep text-lavender transition-colors hover:bg-purple hover:text-white focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes="95vw"
              className="h-auto max-h-[80vh] w-auto max-w-full object-contain"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-lavender">{alt}</p>
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-violet-light/40 px-4 text-sm font-semibold text-violet-light transition-colors hover:border-violet-light hover:text-white focus-visible:ring-2 focus-visible:ring-violet-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none"
            >
              Open full size
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
