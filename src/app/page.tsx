import { Navigation } from "@/components/Navigation"
import { AboutSection } from "@/components/AboutSection"
import { ServicesSection } from "@/components/ServicesSection"
import { SkillsSection } from "@/components/SkillsSection"
import Scene from '@/components/three/Scene'

export default function Page() {
  return (
    <div className="min-h-screen text-white">
      <div className="fixed inset-0">
        <Scene />
      </div>
      <div className="absolute md:left-[35%] left-0 p-8 md:top-0 top-[700px]">
        <main className="max-w-4xl">
          <div className="bg-zinc-900/80 backdrop-blur-sm rounded-xl p-6">
            <Navigation />
            <AboutSection />
            <ServicesSection />
            <SkillsSection />
          </div>
        </main>
      </div>
    </div>
  )
}
