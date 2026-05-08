function parseVideoUrl(url: string): { type: "youtube" | "vimeo" | "direct"; embedUrl: string } | null {
  // YouTube: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return { type: "youtube", embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}` };
  }

  // Vimeo: vimeo.com/ID, player.vimeo.com/video/ID
  const vimeoMatch = url.match(
    /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/
  );
  if (vimeoMatch) {
    return { type: "vimeo", embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  }

  // Direct video URL (.mp4, .webm, .ogg)
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
    return { type: "direct", embedUrl: url };
  }

  return null;
}

export function VideoEmbed({ url, title }: { url: string; title?: string }) {
  const parsed = parseVideoUrl(url);
  if (!parsed) return null;

  if (parsed.type === "direct") {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#1A2940]">
        <video
          src={parsed.embedUrl}
          controls
          className="w-full h-full object-contain"
          title={title}
        >
          <track kind="captions" />
        </video>
      </div>
    );
  }

  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#1A2940]">
      <iframe
        src={parsed.embedUrl}
        title={title ?? "Vidéo intégrée"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
