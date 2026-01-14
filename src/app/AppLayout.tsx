"use client";

import { getOrCreateSession } from "@/utils/session";
import { useEffect } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    getOrCreateSession(); // 🔥 session created here
  }, []);

  return <>{children}</>;
}
