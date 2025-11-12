import { KaosContext } from "@/app/(kiosk)/layout";
import { useContext } from "react";

export const VideoPlayer = ({ url }: { url: string }) => {
  const { setInactive } = useContext(KaosContext);
  if (!url) return null;

  // Normalize & parse Vimeo link
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("vimeo.com")) {
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    const videoId = match ? match[1] : null;

    // Build query safely (take params from original or fallback)
    const params = new URL(url).searchParams;
    const autoplay = params.get("autoplay") ?? "1";
    const muted = params.get("muted") ?? "0";
    const loop = params.get("loop") ?? "1";

    const finalUrl = `https://player.vimeo.com/video/${videoId}?autoplay=${autoplay}&muted=${muted}&loop=${loop}&title=0&byline=0&portrait=0&controls=0`;

    return (
      <div className="relative flex justify-center items-center w-full">
        <div
          onClick={() => setInactive(false)}
          className="absolute inset-0 z-10 cursor-pointer"
        />
        <iframe
          className="relative z-0 w-full aspect-[9/16] rounded-xl shadow-lg bg-black"
          src={finalUrl}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Vimeo Video"
        />
      </div>
    );
  }

  return null;
};
