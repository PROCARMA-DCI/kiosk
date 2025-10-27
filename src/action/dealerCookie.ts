// lib/cookie.ts
"use client";
import Cookies from "js-cookie";

const DEALER_ID_KEY = "dealer_id";

export function setDealerCookie(id: string | number) {
  Cookies.set(DEALER_ID_KEY, String(id), { expires: 7 }); // expires in 7 days
}

export function getDealerCookie(): string | undefined {
  return Cookies.get(DEALER_ID_KEY);
}

export function removeDealerCookie() {
  Cookies.remove(DEALER_ID_KEY);
}
