"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation"
import { AboutSection } from "@/components/AboutSection"
import { ResumeSection } from "@/components/ResumeSection"
import Scene from '@/components/three/Scene'

export default function Page() {
  const [activeSection, setActiveSection] = useState<string>("about");

  const renderActiveSection = () => {
    switch (activeSection) {
      case "about":
        return (
          <div className="w-full">
            <AboutSection />
          </div>
        );
      case "resume":
        return (
          <div className="w-full">
            <ResumeSection />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen text-white">
      <div className="fixed inset-0">
        <Scene />
      </div>
      <div className="absolute md:left-[35%] left-0 p-8 md:top-0 top-[700px]">
        <main className="max-w-4xl">
          <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl p-6">
            <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </div>
  )
}
