import { Sidebar } from "@/components/Sidebar"
import { Navigation } from "@/components/Navigation"
import { AboutSection } from "@/components/AboutSection"
import { ServicesSection } from "@/components/ServicesSection"
import { SkillsSection } from "@/components/SkillsSection"

export default function Page() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto flex flex-col lg:flex-row gap-8 p-4 lg:p-8">
        <Sidebar />
        <main className="flex-1 space-y-8">
          <div className="bg-zinc-900 rounded-xl p-6">
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
