"use client";

import { useEffect, useMemo, useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CoverImageFieldProps {
  /** Fichier nouvellement sélectionné (non encore téléversé). */
  file: File | null;
  onFileChange: (file: File | null) => void;
  /** URL de couverture déjà enregistrée (mode édition). */
  currentUrl?: string | null;
  onClearCurrent?: () => void;
  className?: string;
}

export function CoverImageField({
  file,
  onFileChange,
  currentUrl,
  onClearCurrent,
  className,
}: CoverImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(
    () => () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    },
    [objectUrl],
  );

  const preview = objectUrl ?? currentUrl ?? null;

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
      />

      {preview ? (
        <div className="group relative overflow-hidden rounded-lg border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Aperçu de la couverture" className="h-40 w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-[#1A2940]/0 opacity-0 transition-all group-hover:bg-[#1A2940]/40 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-[#1A2940] shadow-sm hover:bg-white"
            >
              Remplacer
            </button>
            <button
              type="button"
              onClick={() => {
                onFileChange(null);
                onClearCurrent?.();
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="rounded-md bg-white/90 p-1.5 text-[#1A2940] shadow-sm hover:bg-white"
              aria-label="Retirer l'image"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-card px-4 py-8 text-center transition-colors hover:border-primary hover:bg-accent"
        >
          <ImagePlus className="h-6 w-6 text-primary" strokeWidth={1.75} />
          <span className="text-sm font-medium text-foreground">Image de couverture</span>
          <span className="text-xs text-muted-foreground">JPG, PNG ou WebP — cliquer pour choisir</span>
        </button>
      )}
    </div>
  );
}
