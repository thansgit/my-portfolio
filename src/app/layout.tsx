import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Scene from '@/components/three/Scene'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Portto",
  description: "Portfolio of a software engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-full h-full bg-black">
      <body className={`${inter.variable} antialiased w-full h-full m-0 p-0 overflow-hidden bg-black`}>
        <div className="fixed inset-0 w-full h-full z-0 m-0 p-0">
          <Scene />
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
