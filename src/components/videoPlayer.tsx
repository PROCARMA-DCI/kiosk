export const VideoPlayer = ({ url }: { url: string }) => {
  if (!url) return null;

  // Normalize the URL for matching
  const lowerUrl = url.toLowerCase();

  // ✅ 1. Vimeo embed link
  if (lowerUrl.includes("vimeo.com")) {
    // Extract video ID safely (handles /video/ID or ?h=HASH)
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    const videoId = match ? match[1] : null;
    const query = url.split("?")[1] || "";

    return (
      <iframe
        className="w-full aspect-video bg-black/90 shadow-md"
        src={`https://player.vimeo.com/video/${videoId || ""}${
          query
            ? `?${query}`
            : "?h=ccd8676313&autoplay=1&muted=0&loop=1&title=0&byline=0&portrait=0&controls=0"
        }`}
        allow="autoplay; fullscreen"
        allowFullScreen
        title="Vimeo Video"
      />
    );
  }
};
