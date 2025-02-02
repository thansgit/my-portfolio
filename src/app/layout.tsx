import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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
    <html lang="en" className="w-full bg-black">
      <body className={`${inter.variable} antialiased w-full m-0 p-0 bg-black min-h-screen`}>
        <div className="absolute inset-0 w-full z-0 m-0 p-0">
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
