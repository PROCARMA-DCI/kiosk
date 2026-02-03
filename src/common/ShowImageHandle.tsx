"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function ShowImageHandle({
  src,
  alt = "image",
  defaultImage = "/images/camera_image.png",
  className,
  width = 500,
  height = 500,
}: any) {
  const [imgSrc, setImgSrc] = useState(
    (typeof src === "string" && src) || defaultImage,
  );
  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <img
      className={cn("object-cover", className)}
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      onError={() => setImgSrc(defaultImage)}
    />
  );
}
