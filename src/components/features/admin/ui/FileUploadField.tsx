"use client";

import { useRef } from "react";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

function formatBytes(bytes: number): string {
  if (!bytes) return "";
  const units = ["o", "Ko", "Mo", "Go"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

interface FileUploadFieldProps {
  /** Fichier nouvellement sélectionné (non encore téléversé). */
  file: File | null;
  onFileChange: (file: File | null) => void;
  /** Nom du fichier déjà téléversé (mode édition), si aucun nouveau fichier choisi. */
  currentName?: string | null;
  accept?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Champ de téléversement réutilisable. Capture un `File` et le remonte au parent,
 * qui réalise l'upload Storage au moment de l'enregistrement (le chemin dépend du
 * client/visibilité connus à ce moment-là).
 */
export function FileUploadField({
  file,
  onFileChange,
  currentName,
  accept = "application/pdf",
  label = "Fichier",
  disabled,
  className,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const hasNew = !!file;
  const hasCurrent = !hasNew && !!currentName;

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        className="hidden"
        onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
      />

      {hasNew || hasCurrent ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <FileText className="h-4 w-4 flex-shrink-0 text-primary" strokeWidth={1.75} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {hasNew ? file!.name : currentName}
              </p>
              <p className="text-xs text-muted-foreground">
                {hasNew ? formatBytes(file!.size) : "Fichier téléversé"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
              className="rounded-md px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-accent"
            >
              Remplacer
            </button>
            {hasNew && (
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  onFileChange(null);
                  if (inputRef.current) inputRef.current.value = "";
                }}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Retirer le fichier"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-card px-4 py-6 text-center transition-colors hover:border-primary hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Upload className="h-5 w-5 text-primary" strokeWidth={1.75} />
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="text-xs text-muted-foreground">Cliquer pour choisir un fichier</span>
        </button>
      )}
    </div>
  );
}
