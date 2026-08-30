"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BusFront,
  ChevronDown,
  House,
  LayoutDashboard,
  Menu,
  Plane,
  Ship,
  Ticket,
  TrainFront,
  X,
} from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import BrandLogo from "./BrandLogo";
import ThemeToggle from "./ThemeToggle";
import UserAvatar from "./UserAvatar";

const links = [
  { href: "/", label: "Home", icon: House },
  { href: "/bus", label: "Bus", icon: BusFront, transport: true, mode: "bus" },
  { href: "/plane", label: "Plane", icon: Plane, transport: true, mode: "plane" },
  { href: "/train", label: "Train", icon: TrainFront, transport: true, mode: "train" },
  { href: "/cruise", label: "Cruise", icon: Ship, transport: true, mode: "cruise" },
  { href: "/tickets", label: "All tickets", icon: Ticket },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const user = session?.user;
  const navLinks = user
    ? [...links, { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }]
    : links;

  async function logout() {
    await authClient.signOut();
    window.location.href = "/";
  }

  return (
    <header className="site-nav glass">
      <div className="container nav-inner">
        <Link href="/" className="brand" aria-label="Let'sTravel home" onClick={() => setOpen(false)}>
          <BrandLogo />
        </Link>

        <nav className={`nav-links ${open ? "is-open" : ""}`}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = link.href === "/"
              ? pathname === "/"
              : pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                onClick={() => setOpen(false)}
                className={`${active ? "active" : ""} nav-link ${link.transport ? "transport-nav-link" : ""}`}
                data-mode={link.mode || undefined}
                key={link.href}
                href={link.href}
                title={link.label}
              >
                <span className="nav-link-icon" aria-hidden="true"><Icon size={17} /></span>
                <span>{link.label}</span>
              </Link>
            );
          })}

          {!user && (
            <div className="mobile-auth">
              <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
              <Link className="btn btn-primary" href="/register" onClick={() => setOpen(false)}>Create account</Link>
            </div>
          )}
        </nav>

        <div className="nav-actions">
          <ThemeToggle />
          {!user ? (
            <div className="desktop-auth">
              <Link href="/login">Login</Link>
              <Link className="btn btn-primary" href="/register">Create account</Link>
            </div>
          ) : (
            <div className="profile-menu">
              <button className="profile-trigger" onClick={() => setProfileOpen(!profileOpen)}>
                <UserAvatar name={user.name} src={user.image} size={34} />
                <span>{user.name?.split(" ")[0]}</span>
                <ChevronDown size={15} />
              </button>
              {profileOpen && (
                <div className="profile-pop surface">
                  <Link href="/dashboard/profile">My profile</Link>
                  <button onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          )}
          <button className="menu-toggle" aria-label="Open menu" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
