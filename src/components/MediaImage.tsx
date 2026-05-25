"use client";

import Image from "next/image";
import { useState } from "react";
import { hasAsset, isExternalUrl } from "@/lib/site-config";

type MediaImageProps = {
  src?: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: React.ReactNode;
};

export default function MediaImage({
  src,
  alt,
  className = "",
  fill,
  width,
  height,
  priority,
  placeholder,
}: MediaImageProps) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !hasAsset(src) || failed;

  const placeholderContent = placeholder ?? (
    <span className="text-gray-muted text-sm">Add image in .env.local</span>
  );

  if (showPlaceholder) {
    if (fill) {
      return (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple/20 to-black/10 ${className}`}
        >
          {placeholderContent}
        </div>
      );
    }

    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-purple/20 to-black/10 ${className}`}
      >
        {placeholderContent}
      </div>
    );
  }

  if (isExternalUrl(src)) {
    return (
      // External URLs cannot use next/image without a configured remote pattern
      <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes="(max-width:768px) 100vw, 50vw"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 800}
      height={height ?? 600}
      className={className}
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}
