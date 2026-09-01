"use client";
import Image from "next/image";
const fallbackImages = {
  Bus: "/images/bus-fallback.jpg",
  Plane: "/images/plane-fallback.jpg",
  Train: "/images/train-fallback.jpg",
  Launch: "/images/cruise-fallback.jpg",
  Cruise: "/images/cruise-fallback.jpg",
};

export default function SafeTicketImage({
  src,
  alt = "Travel ticket",
  transportType = "Bus",
  className = "",
}) {
  const fallback =
    fallbackImages[transportType] ||
    fallbackImages.Bus;

  const imageSrc =
    typeof src === "string" && src.trim()
      ? src.trim()
      : fallback;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = fallback;
      }}
    />
  );
}