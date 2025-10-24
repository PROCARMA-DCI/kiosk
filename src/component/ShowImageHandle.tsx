"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

export default function ShowImageHandle({
  src,
  alt,
  defaultImage = "/images/camera_image.jpg",
  className,
  width = 500,
  height = 500,
}: any) {
  const [imgSrc, setImgSrc] = useState(
    (typeof src === "string" && src) || defaultImage
  );

  return (
    <Image
      className={cn("object-cover", className)}
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      onError={() => setImgSrc(defaultImage)}
    />
  );
}
