import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Sokritha Yen | Full-Stack Developer & Mentor',
  description: 'A passionate full-stack developer specializing in Next.js, FastAPI, and cloud infrastructure.',
  openGraph: {
    title: 'Sokritha Yen | Full-Stack Developer',
    description: 'Building scalable, high-performance applications with modern web technologies.',
    type: 'website',
    url: 'https://my-portfolio-ten-taupe-92.vercel.app/', // Update with your actual URL
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" data-theme="light">
      <body className={`${inter.variable} font-sans bg-background text-foreground transition-colors duration-300`}>
        {children}
      </body>
    </html>
  );
}
