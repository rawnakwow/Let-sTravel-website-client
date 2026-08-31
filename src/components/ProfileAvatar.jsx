"use client";

import Image from "next/image";

export default function ProfileAvatar({
  user,
  size = 44,
  className = "",
}) {
  const image =
    user?.profileImage ||
    user?.image ||
    user?.photoURL ||
    "";

  // If user has uploaded/selected a profile picture
  if (image) {
    return (
      <div
        className={`profile-avatar ${className}`}
        style={{
          width: size,
          height: size,
        }}
      >
        <Image
          src={image}
          alt={user?.name || "Profile"}
          fill
          sizes={`${size}px`}
          style={{
            objectFit: "cover",
          }}
        />
      </div>
    );
  }

  // Default avatar for everyone
  return (
    <div
      className={`profile-avatar profile-avatar-fallback ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      LV
    </div>
  );
}