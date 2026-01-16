"use client";

import { CookiesProvider } from "react-cookie";

export function CookiesProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CookiesProvider>{children}</CookiesProvider>;
}
