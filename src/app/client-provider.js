"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

export default function ClientProvider({ children }) {
  const setUser = useStore((s) => s.setUser);

  useEffect(() => {
    // Restore from localStorage
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        setUser(JSON.parse(user), token);
      } catch (e) {
        console.error("Failed to parse stored user:", e);
      }
    }
  }, [setUser]);

  return <>{children}</>;
}
