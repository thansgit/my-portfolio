import { AboutSection } from '@/components/sections'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About - Timo Hanski',
  description:
    'Learn about Timo Hanski, a Software Developer specializing in React, TypeScript, and Three.js. Discover my background, skills, and professional approach.',
}

export default function AboutPage() {
  return <AboutSection />
}
