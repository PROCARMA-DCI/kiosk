"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useRedirectOnRefresh() {
  const router = useRouter();

  useEffect(() => {
    // Detect page reload (F5 or direct open)
    if (performance.navigation.type === 1) {
      router.replace("/"); // redirect to root
    }
  }, [router]);
}
