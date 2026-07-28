// Rendu d'un document en <canvas>, page par page.
//
// Pourquoi ne pas laisser le navigateur afficher le PDF : le lecteur natif
// (plugin PDFium de Chrome, PDF.js intégré de Firefox) embarque sa propre
// impression, hors d'atteinte du JS de la page — a fortiori dans une iframe
// d'origine différente, où ni le clavier ni le clic droit ne remontent. En
// dessinant nous-mêmes les pages, il n'y a plus de plugin : toute impression
// passe forcément par le document, où elle peut être bloquée.
//
// Le filigrane est peint DANS le canvas (pas en surcouche CSS) : il survit donc
// à une capture d'écran ou à un « Enregistrer l'image sous ».

import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

type PdfjsModule = typeof import("pdfjs-dist");

let modulePromise: Promise<PdfjsModule> | null = null;

/** pdf.js ≥ 5 s'appuie sur Promise.withResolvers, absent de Safari < 17.4. */
function ensureWithResolvers(): void {
  const ctor = Promise as unknown as { withResolvers?: unknown };
  if (typeof ctor.withResolvers === "function") return;
  ctor.withResolvers = function <T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: unknown) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

/** Charge pdf.js à la demande (gros module : jamais dans le bundle initial). */
export function loadPdfjs(): Promise<PdfjsModule> {
  if (!modulePromise) {
    modulePromise = (async () => {
      ensureWithResolvers();
      const lib = await import("pdfjs-dist");
      lib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString();
      return lib;
    })();
  }
  return modulePromise;
}

/** Ouvre un PDF depuis ses octets. ⚠️ `bytes` est détaché par pdf.js. */
export async function openPdf(bytes: ArrayBuffer): Promise<PDFDocumentProxy> {
  const lib = await loadPdfjs();
  return lib.getDocument({ data: bytes }).promise;
}

/**
 * Densité de rendu : plafonnée à 2, puis réduite si la page dépasse le budget
 * pixels alloué. Toutes les pages étant peintes d'avance, un document long en
 * Retina saturerait sinon la mémoire (31 pages A4 en dpr 2 ≈ 550 Mo).
 */
function pixelRatio(cssW: number, cssH: number, maxPixels: number): number {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const pixels = cssW * cssH * dpr * dpr;
  return pixels <= maxPixels ? dpr : dpr * Math.sqrt(maxPixels / pixels);
}

function sizeCanvas(
  canvas: HTMLCanvasElement,
  cssW: number,
  cssH: number,
  maxPixels: number,
): number {
  const dpr = pixelRatio(cssW, cssH, maxPixels);
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  canvas.style.width = `${Math.round(cssW)}px`;
  canvas.style.height = `${Math.round(cssH)}px`;
  return dpr;
}

/** Filigrane nominatif répété en diagonale, peint dans les pixels du canvas. */
export function drawWatermark(canvas: HTMLCanvasElement, text: string): void {
  const ctx = canvas.getContext("2d");
  if (!ctx || !text) return;
  const { width: w, height: h } = canvas;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 0.11;
  ctx.fillStyle = "#1A2940";
  const size = Math.max(13, Math.round(w / 50));
  ctx.font = `600 ${size}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.translate(w / 2, h / 2);
  ctx.rotate(-Math.PI / 6);

  const stepX = ctx.measureText(text).width + size * 8;
  const stepY = size * 10;
  const spanX = Math.ceil((w + h) / stepX) + 1;
  const spanY = Math.ceil((w + h) / stepY) + 1;
  for (let iy = -spanY; iy <= spanY; iy++) {
    for (let ix = -spanX; ix <= spanX; ix++) {
      ctx.fillText(text, ix * stepX, iy * stepY);
    }
  }
  ctx.restore();
}

/** Dessine une page PDF à la largeur CSS demandée, filigrane compris. */
export async function renderPdfPage(
  page: PDFPageProxy,
  canvas: HTMLCanvasElement,
  cssWidth: number,
  watermark: string,
  maxPixels: number,
): Promise<void> {
  const scale = cssWidth / page.getViewport({ scale: 1 }).width;
  const viewport = page.getViewport({ scale });
  const dpr = sizeCanvas(canvas, viewport.width, viewport.height, maxPixels);

  await page.render({
    canvas,
    viewport,
    transform: dpr === 1 ? undefined : [dpr, 0, 0, dpr, 0, 0],
  }).promise;

  drawWatermark(canvas, watermark);
}

/** Même traitement pour un document déposé sous forme d'image. */
export function renderBitmap(
  bitmap: ImageBitmap,
  canvas: HTMLCanvasElement,
  cssWidth: number,
  watermark: string,
  maxPixels: number,
): void {
  const cssHeight = (bitmap.height / bitmap.width) * cssWidth;
  sizeCanvas(canvas, cssWidth, cssHeight, maxPixels);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  drawWatermark(canvas, watermark);
}

/** Efface les pixels d'un canvas (appelé avant l'impression). */
export function blankCanvas(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
