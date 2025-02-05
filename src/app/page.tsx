"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation"
import { AboutSection } from "@/components/AboutSection"
import { ResumeSection } from "@/components/ResumeSection"
import { PortfolioSection } from "@/components/PortfolioSection"
import { ContactSection } from "@/components/ContactSection"
import Scene from '@/components/three/Scene'

const sections = {
  about: AboutSection,
  resume: ResumeSection,
  portfolio: PortfolioSection,
  contact: ContactSection,
} as const;

export default function Page() {
  const [activeSection, setActiveSection] = useState<keyof typeof sections>("about");

  const ActiveSection = sections[activeSection];

  return (
    <div className="min-h-screen text-white">
      <div className="fixed inset-0 pointer-events-none">
        <Scene />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 md:ml-[35%] p-8 pb-24 md:pb-8 mt-[60vh] md:mt-0">
        <main className="max-w-4xl">
          <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl p-6">
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
            </div>
            
            {/* Active Section Content */}
            <div className="w-full">
              <ActiveSection />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
      </div>
    </div>
  );
}
