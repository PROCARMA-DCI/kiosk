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
      <div className="relative flex justify-center items-center w-full max-w-[731px] ">
        <div
          onClick={() => setInactive(false)}
          className="absolute inset-0 z-10 cursor-pointer"
        />
        <iframe
          className="relative z-0 w-full aspect-[9/16] rounded-xl shadow-lg "
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

export const HtmlVideoEmbed = ({ html }: { html: string }) => {
  if (!html) return null;
  const { setInactive } = useContext(KaosContext);
  // 1️⃣ Remove all <script> tags for safety
  const sanitized = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

  // 3️⃣ Render sanitized HTML
  return (
    <div className="w-full relative flex justify-center items-center  overflow-hidden ">
      <div
        onClick={() => setInactive(false)}
        className="absolute inset-0 z-10 cursor-pointer"
      />
      <div
        className="h-screen max-w-[731px] overflow-hidden"
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    </div>
  );
};

export default function TestVideo() {
  const backendHtml = `
    <iframe src="https://player.vimeo.com/video/1130997022?autoplay=1&muted=1&loop=1&controls=0" 
      frameborder="0" 
      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
      style="position:absolute;top:0;left:0;width:100%;height:100%;" 
      title="SPITZER-GAME-CENTER-VIDEO-4K">
    </iframe>
  `;

  return <HtmlVideoEmbed html={backendHtml} />;
}
