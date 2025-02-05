"use client";

import Link from "next/link";

export function Navigation() {
  return (
    <nav aria-label="Main navigation" className="flex gap-6 text-sm mb-8">
      <Link 
        href="#about" 
        className="text-yellow-500 font-medium"
        aria-current="page"
      >
        About
      </Link>
      <Link
        href="#"
        className="text-zinc-400 hover:text-white transition-colors"
      >
        Resume
      </Link>
      <Link
        href="#"
        className="text-zinc-400 hover:text-white transition-colors"
      >
        Portfolio
      </Link>
      <Link
        href="#"
        className="text-zinc-400 hover:text-white transition-colors"
      >
        Blog
      </Link>
      <Link
        href="#"
        className="text-zinc-400 hover:text-white transition-colors"
      >
        Contact
      </Link>
    </nav>
  );
}
