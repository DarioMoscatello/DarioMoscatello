import type { Metadata } from "next";
import { profile } from "@/data/site";
import "./globals.css";

const fullName = `${profile.firstName} ${profile.lastName}`;

export const metadata: Metadata = {
  metadataBase: new URL("https://dariomoscatello.com"),
  title: `${fullName} — Portfolio`,
  description: `${profile.tagline}. Real Estate, technology and projects from ${profile.city}.`,
  keywords: [
    fullName,
    "real estate analyst",
    "Bocconi University",
    "portfolio",
    "Milan",
  ],
  openGraph: {
    title: `${fullName} — Portfolio`,
    description: `${profile.tagline}. Based in ${profile.city}.`,
    url: "/",
    siteName: fullName,
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
