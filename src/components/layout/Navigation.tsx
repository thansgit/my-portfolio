"use client";

import { Dispatch, SetStateAction } from "react";
import { navigationItems, NavigationItemId } from "./constants";

interface NavigationProps {
  activeSection: NavigationItemId;
  onSectionChange: Dispatch<SetStateAction<NavigationItemId>>;
}

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const handleClick = (section: NavigationItemId, e: React.MouseEvent) => {
    e.preventDefault();
    onSectionChange(section);
  };

  // Handle click for mobile navigation - adds scrolling
  const handleMobileClick = (section: NavigationItemId, e: React.MouseEvent) => {
    e.preventDefault();
    onSectionChange(section);
    
    // Scroll to main content
    const mainContentElement = document.querySelector('.relative.z-10');
    if (mainContentElement) {
      mainContentElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeIndex = navigationItems.findIndex(item => item.id === activeSection);
  const highlightPosition = `${activeIndex * 25}%`;

  const NavigationLinks = () => (
    <>
      {/* Highlight box that moves */}
      <div 
        className="absolute transition-all duration-300 ease-in-out"
        style={{
          left: highlightPosition,
          width: "25%",
          top: "0.375rem", // 1.5 tailwind units
          bottom: "0.375rem", // 1.5 tailwind units
          right: "auto",
          paddingLeft: "0.5rem", // Add padding to center the highlight box
          paddingRight: "0.5rem"
        }}
      >
        <div className="w-full h-full rounded-full bg-zinc-700" />
      </div>
      
      {navigationItems.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={(e) => handleClick(item.id, e)}
          className={`${
            activeSection === item.id ? "text-yellow-500" : "text-zinc-400"
          } hover:text-white transition-colors font-medium relative z-10 text-sm text-center py-1.5 px-6`}
          aria-current={activeSection === item.id ? "page" : undefined}
        >
          {item.label}
        </a>
      ))}
    </>
  );
  
  // Mobile Navigation Links with scroll behavior
  const MobileNavigationLinks = () => (
    <>
      {/* Highlight box that moves */}
      <div 
        className="absolute transition-all duration-300 ease-in-out"
        style={{
          left: highlightPosition,
          width: "25%",
          top: "0.375rem", // 1.5 tailwind units
          bottom: "0.375rem", // 1.5 tailwind units
          right: "auto",
          paddingLeft: "0.5rem", // Add padding to center the highlight box
          paddingRight: "0.5rem"
        }}
      >
        <div className="w-full h-full rounded-full bg-zinc-700" />
      </div>
      
      {navigationItems.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={(e) => handleMobileClick(item.id, e)}
          className={`${
            activeSection === item.id ? "text-yellow-500" : "text-zinc-400"
          } hover:text-white transition-colors font-medium relative z-10 text-sm text-center py-1.5 px-6`}
          aria-current={activeSection === item.id ? "page" : undefined}
        >
          {item.label}
        </a>
      ))}
    </>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <nav aria-label="Main navigation" className="mb-8">
          <div className="relative grid grid-cols-4 bg-zinc-800/90 p-1.5 backdrop-blur-sm rounded-full border border-zinc-700/40 w-fit">
            <NavigationLinks />
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <nav 
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      >
        <div className="bg-zinc-900/95 backdrop-blur-md border-t border-zinc-700/40">
          <div className="relative grid grid-cols-4 p-1.5 max-w-md mx-auto">
            <MobileNavigationLinks />
          </div>
        </div>
      </nav>
    </>
  );
}
