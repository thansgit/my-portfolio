import { ResumeSection } from '@/components/sections'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume - Timo Hanski',
  description:
    "View Timo Hanski's professional experience, education, skills, and achievements. Software Developer specializing in React, TypeScript, and Three.js.",
}

export default function ResumePage() {
  return <ResumeSection />
}
