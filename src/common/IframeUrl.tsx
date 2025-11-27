"use client";

import { useSearchParams } from "next/navigation";

export default function IframeUrl() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");

  if (!url) {
    return (
      <div className="p-10 text-center text-red-500">
        No URL provided in query.
        <br />
        Example: <code>/preview?url=https://example.com</code>
      </div>
    );
  }

  return (
    <div className="w-full h-screen p-0 m-0">
      <iframe src={url} className="w-full h-full border-0" allow="fullscreen" />
    </div>
  );
}
