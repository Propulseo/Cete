"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Loader2, Lock, Minus, Plus, TriangleAlert } from "lucide-react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { useAuth } from "@/lib/auth-context";
import { downloadFileBytes, type StorageBucket } from "@/lib/supabase/storage";
import { blankCanvas, openPdf, renderBitmap, renderPdfPage } from "@/lib/pdf-render";

interface SecureDocumentViewerProps {
  title: string;
  /** Source Storage (cas nominal) — le fichier ne transite jamais par une URL. */
  bucket?: StorageBucket;
  path?: string;
  /** Source héritée : chemin same-origin des jeux de données de démo. */
  src?: string;
}

const MAX_CANVAS_WIDTH = 1100;
/** Budget pixels réparti sur toutes les pages (elles sont toutes peintes d'avance). */
const PIXEL_BUDGET = 80e6;
const MIN_PAGE_PIXELS = 1.5e6;

export function SecureDocumentViewer({ title, bucket, path, src }: SecureDocumentViewerProps) {
  const t = useTranslations("client.viewer");
  const locale = useLocale();
  const { user } = useAuth();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [zoom, setZoom] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<PDFDocumentProxy | null>(null);
  const bitmapRef = useRef<ImageBitmap | null>(null);
  const renderToken = useRef(0);
  const paintedWidth = useRef(0);

  // Filigrane nominatif : traçabilité d'une capture d'écran, seule fuite qu'aucun
  // garde-fou technique ne peut fermer.
  const stamp = new Date().toLocaleString(locale === "fr" ? "fr-FR" : "en-GB");
  const watermark = user ? `${user.name || user.email} · ${stamp}` : stamp;

  const paint = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;

    const available = container.clientWidth - 32;
    if (available <= 0) {
      // Conteneur masqué — typiquement la bascule vers le média « impression ».
      // On ne touche à rien : remettre paintedWidth à 0 suffit à provoquer un
      // repeint dès que le ResizeObserver le voit réapparaître.
      paintedWidth.current = 0;
      return;
    }
    paintedWidth.current = container.clientWidth;

    const token = ++renderToken.current;
    const width = Math.min(available, MAX_CANVAS_WIDTH) * zoom;
    const canvasClass = "mx-auto mb-4 block max-w-full rounded-sm bg-white shadow-lg";
    container.replaceChildren();

    const pdf = pdfRef.current;
    if (pdf) {
      const maxPixels = Math.max(MIN_PAGE_PIXELS, PIXEL_BUDGET / pdf.numPages);
      for (let n = 1; n <= pdf.numPages; n++) {
        const page = await pdf.getPage(n);
        if (token !== renderToken.current) return;
        const canvas = document.createElement("canvas");
        canvas.className = canvasClass;
        container.appendChild(canvas);
        await renderPdfPage(page, canvas, width, watermark, maxPixels);
      }
      return;
    }
    if (bitmapRef.current) {
      const canvas = document.createElement("canvas");
      canvas.className = canvasClass;
      container.appendChild(canvas);
      renderBitmap(bitmapRef.current, canvas, width, watermark, PIXEL_BUDGET / 8);
    }
  }, [zoom, watermark]);

  // Chargement : octets → PDF (pdf.js) ou image. Aucune URL n'atteint le DOM.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        let bytes: ArrayBuffer;
        if (bucket && path) {
          bytes = await downloadFileBytes(bucket, path);
        } else if (src) {
          const res = await fetch(src);
          if (!res.ok) throw new Error("fetch failed");
          bytes = await res.arrayBuffer();
        } else {
          throw new Error("no source");
        }
        if (!alive) return;

        const head = new Uint8Array(bytes.slice(0, 4));
        const isPdf = head[0] === 0x25 && head[1] === 0x50 && head[2] === 0x44 && head[3] === 0x46;
        if (isPdf) {
          pdfRef.current = await openPdf(bytes);
        } else {
          bitmapRef.current = await createImageBitmap(new Blob([bytes]));
        }
        if (!alive) return;
        setStatus("ready");
      } catch {
        if (alive) setStatus("error");
      }
    })();
    return () => {
      alive = false;
      void pdfRef.current?.loadingTask.destroy();
      pdfRef.current = null;
      bitmapRef.current?.close();
      bitmapRef.current = null;
    };
  }, [bucket, path, src]);

  useEffect(() => {
    if (status === "ready") void paint();
  }, [status, paint]);

  // Le canvas ne se redimensionne pas seul : on repeint dès que la largeur
  // utile change. Sert aussi de filet après une impression — le conteneur passe
  // par 0 puis retrouve sa largeur, ce qui déclenche le repeint.
  useEffect(() => {
    if (status !== "ready") return;
    const container = containerRef.current;
    if (!container) return;
    let timer: ReturnType<typeof setTimeout>;
    const observer = new ResizeObserver(() => {
      if (container.clientWidth === paintedWidth.current) return;
      clearTimeout(timer);
      timer = setTimeout(() => void paint(), 150);
    });
    observer.observe(container);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [status, paint]);

  // Blocage de l'impression, en deux couches indépendantes :
  //  1. la règle @media print vide le document ;
  //  2. beforeprint efface les pixels des canvas AVANT que le navigateur ne
  //     capture la page — donc même feuille de style désactivée, il n'y a rien
  //     à imprimer. On repeint sur afterprint.
  useEffect(() => {
    const blanked = { current: false };
    const blank = () => {
      if (blanked.current) return;
      blanked.current = true;
      containerRef.current?.querySelectorAll("canvas").forEach(blankCanvas);
    };
    const restore = () => {
      if (!blanked.current) return;
      blanked.current = false;
      void paint();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && (key === "p" || key === "s")) {
        e.preventDefault();
        blank();
        setTimeout(restore, 400);
      }
    };
    const mq = window.matchMedia("print");
    const onMedia = (e: MediaQueryListEvent) => (e.matches ? blank() : restore());

    window.addEventListener("beforeprint", blank);
    window.addEventListener("afterprint", restore);
    document.addEventListener("keydown", onKeyDown);
    mq.addEventListener("change", onMedia);
    return () => {
      window.removeEventListener("beforeprint", blank);
      window.removeEventListener("afterprint", restore);
      document.removeEventListener("keydown", onKeyDown);
      mq.removeEventListener("change", onMedia);
    };
  }, [paint]);

  return (
    <div className="flex h-screen flex-col bg-[#1A2940]">
      {/* Rien ne doit partir à l'impression : cette route n'affiche que le document. */}
      <style>{`@media print { html body { display: none !important; } }`}</style>

      <header className="flex items-center justify-between gap-4 bg-[#0D5A8A] px-4 py-2 text-white">
        <strong className="truncate text-sm font-semibold">{title}</strong>
        <div className="flex shrink-0 items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-label">
            <Lock className="size-3" strokeWidth={2} />
            {t("badge")}
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}
            aria-label={t("zoomOut")}
            className="inline-flex size-11 items-center justify-center rounded-md hover:bg-white/15"
          >
            <Minus className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
            aria-label={t("zoomIn")}
            className="inline-flex size-11 items-center justify-center rounded-md hover:bg-white/15"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </header>

      {status === "loading" && (
        <div className="flex flex-1 items-center justify-center gap-2 text-white/70">
          <Loader2 className="size-4 animate-spin" />
          {t("loading")}
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center text-white/80">
          <TriangleAlert className="size-6 text-[#F59542]" />
          <p className="font-medium">{t("errorTitle")}</p>
          <p className="max-w-md text-sm text-white/60">{t("errorHint")}</p>
        </div>
      )}

      <div
        ref={containerRef}
        onContextMenu={(e) => e.preventDefault()}
        className={`flex-1 overflow-auto p-4 select-none ${status === "ready" ? "" : "hidden"}`}
      />

      <footer className="bg-[#0D5A8A]/60 px-4 py-1.5 text-center text-label text-white/70">
        {t("notice")}
      </footer>
    </div>
  );
}
