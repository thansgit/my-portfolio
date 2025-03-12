import { PortfolioSection } from '@/components/sections'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio - Timo Hanski',
  description:
    "Explore Timo Hanski's portfolio of projects. View web applications, interactive experiences, and software solutions built with React, TypeScript, and Three.js.",
}

export default function PortfolioPage() {
  return <PortfolioSection />
}
