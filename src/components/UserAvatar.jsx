import Image from "next/image";

export default function UserAvatar({ name = "Traveller", src, size = 46, className = "" }) {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0d725e&color=fff&size=200`;
  return <Image className={className} src={src || fallback} alt={`${name} profile`} width={size} height={size} unoptimized={!src || src.includes("ui-avatars.com")} />;
}
