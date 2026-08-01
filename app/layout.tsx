import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import { profile } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dariomoscatello.com"),
  title: {
    default: `${profile.firstName} ${profile.lastName} — ${profile.role}`,
    template: `%s — ${profile.firstName} ${profile.lastName}`,
  },
  description:
    "Real Estate Analyst at Copernicus RE Italia. Pricing and underwriting UTP and NPL single names and portfolios. Economics and Management at Bocconi University, Milan.",
  keywords: [
    "Dario Moscatello",
    "NPL",
    "UTP",
    "real estate analyst",
    "Copernicus RE Italia",
    "Bocconi University",
    "Milan",
  ],
  openGraph: {
    title: `${profile.firstName} ${profile.lastName} — ${profile.role}`,
    description: "Distressed credit, real estate, and things worth building.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=IBM+Plex+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="shell">
          <SiteNav />
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
