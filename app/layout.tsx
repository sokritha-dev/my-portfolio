import "./globals.css";
import { Fraunces, IBM_Plex_Sans, Noto_Serif_Khmer } from "next/font/google";
import type { Metadata } from "next";

import { PortfolioChat } from "@/app/_components/chat/portfolio-chat";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const notoSerifKhmer = Noto_Serif_Khmer({
  subsets: ["khmer"],
  weight: ["500", "600", "700"],
  variable: "--font-khmer",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://my-portfolio-ten-taupe-92.vercel.app"),
  title: "Yen Sokritha | Full-Stack Web Engineer",
  description:
    "Full-stack web engineer with 4+ years of experience building web apps with TypeScript, Node.js, React, Next.js, AWS, payments, and AI-powered search.",
  openGraph: {
    title: "Yen Sokritha | Full-Stack Web Engineer",
    description:
      "Full-stack web engineer focused on product delivery, AWS infrastructure, payment integration, and AI-powered search.",
    type: "website",
    url: "https://my-portfolio-ten-taupe-92.vercel.app/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yen Sokritha | Full-Stack Web Engineer",
    description:
      "Full-stack web engineer focused on product delivery, AWS infrastructure, payment integration, and AI-powered search.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${ibmPlexSans.variable} ${fraunces.variable} ${notoSerifKhmer.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-background text-foreground antialiased">
        {children}
        <PortfolioChat />
      </body>
    </html>
  );
}
