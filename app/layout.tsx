import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import { profile } from "@/data/site";
import "./globals.css";

const fullName = `${profile.firstName} ${profile.lastName}`;

export const metadata: Metadata = {
  metadataBase: new URL("https://dariomoscatello.com"),
  title: {
    default: `${fullName} — Real Estate Analyst`,
    template: `%s — ${fullName}`,
  },
  description:
    "Real Estate Analyst at Copernicus RE Italia, pricing and underwriting UTP and NPL single names and portfolios. Economics and Management at Bocconi University, Milan.",
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
    title: `${fullName} — Real Estate Analyst`,
    description: "Analyst. Builder. Chess player. Based in Milan.",
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
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Newsreader:opsz,wght@6..72,300;6..72,400;6..72,500;6..72,600&display=swap"
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
