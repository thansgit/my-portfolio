"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation"
import { AboutSection } from "@/components/AboutSection"
import { ResumeSection } from "@/components/ResumeSection"
import { PortfolioSection } from "@/components/PortfolioSection"
import { ContactSection } from "@/components/ContactSection"
import Scene from '@/components/three/Scene'

export default function Page() {
  const [activeSection, setActiveSection] = useState<string>("about");

  const renderActiveSection = () => {
    switch (activeSection) {
      case "about":
        return <AboutSection />;
      case "resume":
        return <ResumeSection />;
      case "portfolio":
        return <PortfolioSection />;
      case "contact":
        return <ContactSection />;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen text-white">
      <div className="fixed inset-0 pointer-events-none">
        <Scene />
      </div>
      <div className="relative z-10 md:left-[35%] left-0 p-8 md:top-0 top-[700px]">
        <main className="max-w-4xl">
          <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl p-6">
            <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
            <div className="w-full">
              {renderActiveSection()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
