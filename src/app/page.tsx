"use client";

import { useState } from "react";
import { Navigation } from "@/components/layout";
import { AboutSection, ResumeSection, PortfolioSection, ContactSection } from "@/components/sections";
import { Scene } from '@/components/three';
import { SplashScreen } from '@/components/ui/SplashScreen';
import { LoadingProvider } from '@/components/three/context/LoadingContext';

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
      <LoadingProvider>
        <SplashScreen />
        <div className="fixed inset-0 pointer-events-none">
          <Scene />
        </div>
      </LoadingProvider>
      
      {/* Main Content */}
      <div className="relative z-10 md:ml-[35%] p-8 pb-24 md:pb-8 mt-[60vh] md:mt-0">
        <main className="max-w-4xl">
          {/* Main container with metallic border and leather texture */}
          <div className="relative rounded-xl overflow-hidden">
            {/* Metallic border - leveämpi ja näyttävämpi */}
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-600 via-zinc-700 to-zinc-800 rounded-xl border border-zinc-500 shadow-[0_0_25px_rgba(0,0,0,0.6)]">
              {/* Metallic inner border with brushed steel texture */}
              <div className="absolute inset-[5px] rounded-lg bg-[url('/textures/brushed-steel.webp')] bg-cover overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-400/40 via-zinc-600/60 to-zinc-900/80 backdrop-blur-[1px]"></div>
                
              </div>
            </div>
            
            {/* Dark leather texture container - korjattu opacity */}
            <div className="relative z-10 bg-zinc-900 m-[8px] rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-[url('/textures/dark-leather.webp')] bg-repeat opacity-10"></div>
              
              {/* Content container */}
              <div className="relative z-10 p-6">
                {/* Desktop Navigation with Social Links */}
                <div className="hidden md:block">
                  <div className="flex justify-between items-center">
                    <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
                    <div className="flex items-center space-x-4">
                      <a 
                        href="https://linkedin.com/in/timo-hanski-731413247" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-yellow-500 transition-colors"
                        aria-label="LinkedIn Profile"
                        tabIndex={0}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                      <a 
                        href="https://github.com/thansgit" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-yellow-500 transition-colors"
                        aria-label="GitHub Profile"
                        tabIndex={0}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Active Section Content */}
                <div className="w-full">
                  <ActiveSection />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Navigation with Social Links */}
      <div className="md:hidden">
        <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
        <div className="fixed top-4 right-4 flex space-x-4 z-50">
          <a 
            href="https://linkedin.com/in/timo-hanski-731413247" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-yellow-500 transition-colors bg-zinc-900/80 backdrop-blur-sm p-2 rounded-full"
            aria-label="LinkedIn Profile"
            tabIndex={0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
          <a 
            href="https://github.com/thansgit" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-yellow-500 transition-colors bg-zinc-900/80 backdrop-blur-sm p-2 rounded-full"
            aria-label="GitHub Profile"
            tabIndex={0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
