"use client";

import { Dispatch, SetStateAction } from "react";

interface NavigationProps {
  activeSection: string;
  onSectionChange: Dispatch<SetStateAction<string>>;
}

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const handleClick = (section: string, e: React.MouseEvent) => {
    e.preventDefault();
    onSectionChange(section);
  };

  return (
    <nav aria-label="Main navigation" className="flex gap-6 text-sm mb-8">
      <a 
        href="#about"
        onClick={(e) => handleClick("about", e)}
        className={`${
          activeSection === "about" ? "text-yellow-500" : "text-zinc-400"
        } hover:text-white transition-colors font-medium`}
        aria-current={activeSection === "about" ? "page" : undefined}
      >
        About
      </a>
      <a
        href="#resume"
        onClick={(e) => handleClick("resume", e)}
        className={`${
          activeSection === "resume" ? "text-yellow-500" : "text-zinc-400"
        } hover:text-white transition-colors`}
        aria-current={activeSection === "resume" ? "page" : undefined}
      >
        Resume
      </a>
      <a
        href="#portfolio"
        onClick={(e) => handleClick("portfolio", e)}
        className={`${
          activeSection === "portfolio" ? "text-yellow-500" : "text-zinc-400"
        } hover:text-white transition-colors`}
        aria-current={activeSection === "portfolio" ? "page" : undefined}
      >
        Portfolio
      </a>
      <a
        href="#contact"
        onClick={(e) => handleClick("contact", e)}
        className={`${
          activeSection === "contact" ? "text-yellow-500" : "text-zinc-400"
        } hover:text-white transition-colors`}
        aria-current={activeSection === "contact" ? "page" : undefined}
      >
        Contact
      </a>
    </nav>
  );
}
