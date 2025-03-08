import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Timo Hanski - Software Developer Portfolio",
  description: "Portfolio of Timo Hanski, a Software Developer specializing in React, TypeScript, Three.js and full-stack development. View my projects, skills, and experience.",
  keywords: "Timo Hanski, software developer, web developer, full-stack developer, React, TypeScript, Three.js, JavaScript, portfolio, Finland, developer portfolio",
  authors: [{ name: "Timo Hanski" }],
  creator: "Timo Hanski",
  publisher: "Timo Hanski",
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://timohanski.com"), // Replace with your actual domain
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-full bg-black" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased w-full m-0 p-0 bg-black min-h-screen`}>
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
