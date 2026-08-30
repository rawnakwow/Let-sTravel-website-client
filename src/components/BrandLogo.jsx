import { Compass, Plane } from "lucide-react";

export default function BrandLogo() {
  return (
    <>
      <span className="brand-mark travel-logo-mark" aria-hidden="true">
        <Compass className="travel-logo-compass" size={24} strokeWidth={2.2} />
        <Plane className="travel-logo-plane" size={12} strokeWidth={2.4} />
      </span>
      <span className="brand-wordmark">Let&apos;s<span>Travel</span></span>
    </>
  );
}
