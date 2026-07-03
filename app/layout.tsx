import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { Metadata } from "next";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://my-portfolio-ten-taupe-92.vercel.app"),
  title: "Sokritha Yen | Full-Stack Developer & Mentor",
  description:
    "Full-stack developer crafting modern web experiences across product UI, backend systems, and cloud delivery.",
  openGraph: {
    title: "Sokritha Yen | Full-Stack Developer & Mentor",
    description:
      "Modern portfolio for Sokritha Yen, focused on product-minded engineering, full-stack delivery, and mentoring.",
    type: "website",
    url: "https://my-portfolio-ten-taupe-92.vercel.app/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sokritha Yen | Full-Stack Developer & Mentor",
    description:
      "Modern portfolio focused on thoughtful product engineering, delivery, and mentoring.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakarta.variable} suppressHydrationWarning>
      <body className="font-sans bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
