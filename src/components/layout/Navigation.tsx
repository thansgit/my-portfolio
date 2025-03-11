"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const navigationItems = [
  { id: "about", label: "About" },
  { id: "resume", label: "Resume" },
  { id: "portfolio", label: "Portfolio" },
  { id: "contact", label: "Contact" },
] as const;

type NavigationItemId = (typeof navigationItems)[number]["id"];

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // For a smoother initial load
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine active section from path
  const currentSection = useMemo(() => {
    const path = pathname || "/";
    if (path === "/" || path === "/about") return "about";
    const section = path.slice(1);
    return navigationItems.some((item) => item.id === section)
      ? section
      : "about";
  }, [pathname]);

  // Use a ref for animation frame to prevent memory leaks
  const prevActiveIndexRef = useRef<number>(0);
  const activeIndex = navigationItems.findIndex(
    (item) => item.id === currentSection
  );

  // Update previous active index for animation
  useEffect(() => {
    prevActiveIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Reference to main content for scrolling
  const mainContentRef = useRef<HTMLDivElement | null>(null);

  // Simplified scroll function
  const scrollToMainContent = () => {
    // Find the main content element if not already stored
    if (!mainContentRef.current) {
      mainContentRef.current = document.querySelector(
        ".relative.z-10.md\\:ml-\\[35\\%\\]"
      );
    }

    if (mainContentRef.current) {
      const yOffset = -20; // Small offset from the top
      const y =
        mainContentRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  };

  // Scroll to main content on initial load for non-about pages
  useEffect(() => {
    if (mounted && currentSection !== "about") {
      scrollToMainContent();
    }
  }, [mounted, currentSection]);

  // Unified click handler for both desktop and mobile
  const handleNavClick = (
    section: NavigationItemId,
    path: string,
    e: React.MouseEvent
  ) => {
    e.preventDefault();

    // Only update URL if navigating to a different section
    if (section !== currentSection) {
      router.push(path);
    }

    // Always scroll to content
    scrollToMainContent();
  };

  const highlightPosition = `${activeIndex * 25}%`;

  const NavigationLinks = () => (
    <>
      {/* Background highlight box that moves */}
      <div
        className={`
          /* [Active Highlight] Highlight for active navigation item */
          absolute transition-all duration-300 ease-out 
          ${mounted ? "opacity-100" : "opacity-0"}
        `}
        style={{
          left: highlightPosition,
          width: "25%",
          top: "0.25rem",
          bottom: "0.25rem",
          right: "auto",
        }}
      >
        <div
          className={`
          /* [Active Background] Gradient background for active item */
          w-full h-full bg-gradient-to-r from-zinc-700/80 via-zinc-700 to-zinc-700/80 
          rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.1)]
        `}
        />
      </div>

      {/* Hover highlight effect */}
      {hoveredIndex !== null && hoveredIndex !== activeIndex && (
        <div
          className="absolute transition-all duration-200 ease-out"
          style={{
            left: `${hoveredIndex * 25}%`,
            width: "25%",
            top: "0.25rem",
            bottom: "0.25rem",
            opacity: 0.5,
          }}
        >
          <div className="w-full h-full bg-zinc-700/60 rounded-full" />
        </div>
      )}

      {/* Navigation items */}
      {navigationItems.map((item, index) => (
        <Link
          key={item.id}
          href={`/${item.id}`}
          onClick={(e) => handleNavClick(item.id, `/${item.id}`, e)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          prefetch={true}
          replace={true}
          scroll={false}
          className={`
            /* [Nav Link] Navigation link styling with conditional active state */
            ${
              currentSection === item.id
                ? "text-yellow-500 font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            } 
            transition-all duration-200 relative z-10 text-sm text-center py-1.5 px-6 
            flex items-center justify-center
          `}
          aria-current={currentSection === item.id ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </>
  );

  // Use the same component for mobile navigation
  const MobileNavigationLinks = NavigationLinks;

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <nav aria-label="Main navigation" className="mb-8">
          <div
            className={`
            /* [Nav Container] Main navigation container */
            relative grid grid-cols-4 bg-zinc-800/90 p-1.5 backdrop-blur-sm 
            rounded-full border border-zinc-700/40 w-fit 
            shadow-[0_4px_12px_rgba(0,0,0,0.15)]
          `}
          >
            <NavigationLinks />
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      >
        <div
          className={`
          /* [Mobile Nav Bar] Fixed navigation bar at the bottom of the screen */
          bg-zinc-900/95 backdrop-blur-md border-t border-zinc-700/40 
          shadow-[0_-2px_10px_rgba(0,0,0,0.2)]
        `}
        >
          <div className="relative grid grid-cols-4 p-1.5 max-w-md mx-auto">
            <MobileNavigationLinks />
          </div>
        </div>
      </nav>
    </>
  );
}
