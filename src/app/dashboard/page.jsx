"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function DashboardIndex() {
  const router = useRouter();
  useEffect(() => { apiFetch("/users/me").then(profile => router.replace(profile.role === "admin" ? "/dashboard/manage-tickets" : profile.role === "vendor" ? "/dashboard/my-tickets" : "/dashboard/bookings")).catch(() => router.replace("/dashboard/profile")); }, [router]);
  return <div className="min-h-[50vh] grid place-items-center"><div className="spinner" /></div>;
}
