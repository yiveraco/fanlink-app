// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Work_Sans, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/provider/providers";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const BASE_URL = "https://play.yivera.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Yivera Play — Stream Music",
    template: "%s | Yivera",
  },

  description:
    "Stream music from independent artists distributed by Yivera. One link to Spotify, Apple Music, Boomplay, Audiomack, and more.",

  applicationName: "Yivera Play",

  openGraph: {
    type: "website",
    siteName: "Yivera",
    locale: "en_US",
    url: BASE_URL,
    title: "Yivera Play — Stream Music",
    description:
      "Stream music from independent artists distributed by Yivera. One link to Spotify, Apple Music, Boomplay, Audiomack, and more.",
    images: [
      {
        // TEMP fallback (replace ASAP with real OG image)
        url: `${BASE_URL}/icon4.png`,
        width: 1200,
        height: 630,
        alt: "Yivera — Digital Music Distribution",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@YiveraDisto",
    creator: "@YiveraDisto",
    title: "Yivera Play — Stream Music",
    description: "Stream music from independent artists distributed by Yivera.",
    images: [`${BASE_URL}/icon4.png`],
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "64x64 32x32 24x24 16x16",
        type: "image/x-icon",
      },
      { url: "/icon1.png", sizes: "16x16", type: "image/png" },
      { url: "/icon2.png", sizes: "32x32", type: "image/png" },
      { url: "/icon3.png", sizes: "192x192", type: "image/png" },
      { url: "/icon4.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icon3.png",
  },

  manifest: "/site.webmanifest",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${workSans.variable} ${plusJakarta.variable} antialiased bg-[#0a0a0a] text-white`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
