import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import BrandLogo from "./BrandLogo";

export default function AuthShell({ title, subtitle, children }) {
  return (
    <section className="auth-page">
      <div className="auth-showcase">
        <Link href="/" className="brand"><BrandLogo /></Link>
        <div><span className="eyebrow">Travel without the guesswork</span><h1 className="display">One account.<br />Every road ahead.</h1><p>Save journeys, manage bookings, and pay securely from any device.</p></div>
        <ul><li><CheckCircle2 /> Verified travel operators</li><li><CheckCircle2 /> Transparent pricing</li><li><CheckCircle2 /> Role-based secure dashboards</li></ul>
      </div>
      <div className="auth-form surface"><div><span className="eyebrow">Welcome to Let&apos;sTravel</span><h2 className="display">{title}</h2><p className="muted">{subtitle}</p></div>{children}</div>
    </section>
  );
}
