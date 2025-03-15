'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

const navigationItems = [
  { id: 'about', label: 'About' },
  { id: 'resume', label: 'Resume' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'contact', label: 'Contact' },
] as const

type NavigationItemId = (typeof navigationItems)[number]['id']

export function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // For a smoother initial load
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine active section from path
  const currentSection = useMemo(() => {
    const path = pathname || '/'
    if (path === '/' || path === '/about') return 'about'
    const section = path.slice(1)
    return navigationItems.some((item) => item.id === section) ? section : 'about'
  }, [pathname])

  // Use a ref for animation frame to prevent memory leaks
  const prevActiveIndexRef = useRef<number>(0)
  const activeIndex = navigationItems.findIndex((item) => item.id === currentSection)

  // Update previous active index for animation
  useEffect(() => {
    prevActiveIndexRef.current = activeIndex
  }, [activeIndex])

  // Reference to main content for scrolling
  const mainContentRef = useRef<HTMLDivElement | null>(null)

  // Simplified scroll function
  const scrollToMainContent = () => {
    // Find the main content element if not already stored
    if (!mainContentRef.current) {
      mainContentRef.current = document.querySelector('.relative.z-10.md\\:ml-\\[35\\%\\]')
    }

    if (mainContentRef.current) {
      const yOffset = -20 // Small offset from the top
      const y = mainContentRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset

      window.scrollTo({
        top: y,
        behavior: 'smooth',
      })
    }
  }

  // Scroll to main content on initial load for non-about pages
  useEffect(() => {
    if (mounted && currentSection !== 'about') {
      scrollToMainContent()
    }
  }, [mounted, currentSection])

  // Unified click handler for both desktop and mobile
  const handleNavClick = (section: NavigationItemId, path: string, e: React.MouseEvent) => {
    e.preventDefault()

    // Only update URL if navigating to a different section
    if (section !== currentSection) {
      router.push(path)
    }

    // Always scroll to content
    scrollToMainContent()
  }

  const NavigationLinks = () => (
    <>
      {/* Navigation items */}
      {navigationItems.map((item, index) => {
        const isActive = currentSection === item.id
        const isHovered = hoveredIndex === index && !isActive

        return (
          <Link
            key={item.id}
            href={`/${item.id}`}
            onClick={(e) => handleNavClick(item.id, `/${item.id}`, e)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            prefetch={true}
            replace={true}
            scroll={false}
            className={cn(
              // Base neumorphic styling
              'relative z-10 flex items-center justify-center rounded-full px-6 py-2 text-center text-sm transition-all duration-300',

              // Active state
              isActive && 'neu-container-pressed text-neu-accent translate-y-[1px] transform font-semibold',

              // Inactive state
              !isActive && 'text-neu-textSecondary hover:text-neu-text',

              // Hover effect when not active
              isHovered && 'bg-neu-bgLight',
            )}
            aria-current={isActive ? 'page' : undefined}
            tabIndex={0}
            aria-label={`Navigate to ${item.label} section`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleNavClick(item.id, `/${item.id}`, e as unknown as React.MouseEvent)
              }
            }}
          >
            {item.label}
          </Link>
        )
      })}
    </>
  )

  // Use the same component for mobile navigation
  const MobileNavigationLinks = NavigationLinks

  return (
    <>
      {/* Desktop Navigation */}
      <div className='hidden md:block'>
        <nav aria-label='Main navigation'>
          <div
            className={cn(
              // Neumorphic container for navigation
              'neu-container relative grid w-fit grid-cols-4 rounded-full p-1.5',
              // Fade in effect
              mounted ? 'opacity-100' : 'opacity-0',
              'transition-opacity duration-300',
            )}
          >
            <NavigationLinks />
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <nav aria-label='Mobile navigation' className='fixed bottom-0 left-0 right-0 z-50 md:hidden'>
        <div className='border-neu-bgLight bg-neu-bg/95 border-t backdrop-blur-md'>
          <div className='relative mx-auto grid max-w-md grid-cols-4 p-1.5'>
            <MobileNavigationLinks />
          </div>
        </div>
      </nav>
    </>
  )
}
