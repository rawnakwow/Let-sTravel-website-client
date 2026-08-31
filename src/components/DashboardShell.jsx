"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, CalendarCheck, CircleUserRound, Megaphone, Menu, PlusCircle, ReceiptText, ShieldCheck, TicketCheck, UsersRound, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import UserAvatar from "./UserAvatar";

const common = [{ href: "/dashboard/profile", label: "Profile", icon: CircleUserRound }];
const roleLinks = {
  user: [{ href: "/dashboard/bookings", label: "My bookings", icon: CalendarCheck }, { href: "/dashboard/transactions", label: "Transactions", icon: ReceiptText }],
  vendor: [{ href: "/dashboard/add-ticket", label: "Add ticket", icon: PlusCircle }, { href: "/dashboard/my-tickets", label: "My tickets", icon: TicketCheck }, { href: "/dashboard/requests", label: "Booking requests", icon: CalendarCheck }, { href: "/dashboard/revenue", label: "Revenue", icon: BarChart3 }],
  admin: [{ href: "/dashboard/manage-tickets", label: "Manage tickets", icon: ShieldCheck }, { href: "/dashboard/manage-users", label: "Manage users", icon: UsersRound }, { href: "/dashboard/advertise", label: "Advertisements", icon: Megaphone }],
};

export default function DashboardShell({ children }) {
  const pathname = usePathname(); const router = useRouter(); const [profile, setProfile] = useState(null); const [open, setOpen] = useState(false);
  useEffect(() => { apiFetch("/users/me").then(setProfile).catch(() => router.replace("/login?callbackUrl=/dashboard")); }, [router]);
  const role = profile?.role || "user";
  const links = useMemo(
    () => [...common, ...(roleLinks[role] || [])].filter((link) => !(profile?.isFraud && link.href === "/dashboard/add-ticket")),
    [profile?.isFraud, role],
  );
  useEffect(() => {
    if (!profile || pathname === "/dashboard" || pathname === "/dashboard/profile") return;
    const permitted = links.some((link) => link.href === pathname);
    if (!permitted) {
      const fallback = role === "admin" ? "/dashboard/manage-tickets" : role === "vendor" ? "/dashboard/my-tickets" : "/dashboard/bookings";
      router.replace(fallback);
    }
  }, [links, pathname, profile, role, router]);
  return <div className="dashboard"><button className="dash-mobile-toggle btn btn-secondary" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />} Menu</button><aside className={`dash-sidebar surface ${open ? "open" : ""}`}><div className="dash-user"><UserAvatar name={profile?.name} src={profile?.image} /><div><b>{profile?.name || "Loading…"}</b><span className="status">{profile?.role || "user"}</span></div></div><nav>{links.map(({ href,label,icon:Icon }) => <Link onClick={() => setOpen(false)} className={pathname === href ? "active" : ""} key={href} href={href}><Icon size={18} /> {label}</Link>)}</nav><div className="dash-note"><ShieldCheck /><b>Secure dashboard</b><p>Actions are protected by JWT and server-side roles.</p></div></aside><div className="dash-content">{children}</div></div>;
}
