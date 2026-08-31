"use client";

import { useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

export default function SessionSync() {
  const { data: session } = authClient.useSession();
  const syncedUser = useRef(null);
  useEffect(() => {
    if (!session?.user?.id || syncedUser.current === session.user.id) return;
    syncedUser.current = session.user.id;
    apiFetch("/users/sync", { method: "POST", body: JSON.stringify({ name: session.user.name, image: session.user.image }) }).catch(() => {
      syncedUser.current = null;
    });
  }, [session?.user?.id, session?.user?.image, session?.user?.name]);
  return null;
}
