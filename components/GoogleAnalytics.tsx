"use client";
// components/GoogleAnalytics.tsx
// Mirrors the main Yivera app's GA setup exactly — same package, same IDs.
// Only fires in production. Fanlink has no /admin so that guard is a safety net only.

import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";
import { usePathname } from "next/navigation";

export default function GoogleAnalytics() {
  const pathname = usePathname();

  // Derive directly — no useState/useEffect needed, avoids cascading renders
  const isDevelopment =
    !process.env.NODE_ENV || process.env.NODE_ENV === "development";
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isDevelopment || isAdmin) return null;

  return (
    <>
      <NextGoogleAnalytics gaId="G-W7RFWFR0XN" />
      <NextGoogleAnalytics gaId="G-MYJWFFZC8F" />
      <NextGoogleAnalytics gaId="AW-16896412921" />
    </>
  );
}
