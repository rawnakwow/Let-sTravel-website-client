import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";

import BrandLogo from "./BrandLogo";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">

        {/* Brand */}
        <div>
          <Link href="/" className="brand">
            <BrandLogo />
          </Link>

          <p>
            Book bus, train, cruise and flight tickets easily—with verified
            operators and clear prices.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h3>Explore</h3>

          <Link href="/">Home</Link>
          <Link href="/tickets">All tickets</Link>
          <Link href="/#popular">Popular routes</Link>
          <Link href="/#why-us">
            Why Let&apos;sTravel
          </Link>
        </div>

        {/* Contact */}
        <div>
          <h3>Contact</h3>

          <span>
            <Mail size={16} />
            hello@letstravel.com
          </span>

          <span>
            <Phone size={16} />
            +880 1700 000 000
          </span>

          <span>
            <MapPin size={16} />
            Dhaka, Bangladesh
          </span>

          <div className="social">
            <a
              href="#"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>

            <a
              href="#"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="#"
              aria-label="X"
            >
              𝕏
            </a>
          </div>
        </div>

        {/* Payment */}
        <div>
          <h3>Secure payment</h3>

          <p>
            Your checkout is protected by Stripe&apos;s secure payment
            infrastructure.
          </p>

          <div className="payment-badge">
            <ShieldCheck />
            <span>stripe</span>
          </div>
        </div>

      </div>

      <div className="container footer-bottom">
        <span>
          © 2026 Let&apos;sTravel. All rights reserved.
        </span>

        <span>
          Designed for journeys worth remembering.
        </span>
      </div>
    </footer>
  );
}