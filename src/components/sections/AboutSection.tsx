"use client";

import { Section, IconCard } from "@/components/ui";
import { ServiceItem } from "./types";
import { 
  FaReact, 
  FaNodeJs, 
  FaPython,
  FaLaptopCode,
  FaServer,
  FaPaintBrush,
  FaMobileAlt
} from "react-icons/fa";
import { 
  SiTypescript, 
  SiDjango, 
  SiKotlin, 
  SiThreedotjs, 
  SiCypress
} from "react-icons/si";

export function AboutSection() {
  const services: ServiceItem[] = [
    {
      title: "Frontend Development",
      description: "Building and maintaining websites and web applications with a focus on clean code and great user experiences.",
      icon: <FaLaptopCode className="w-8 h-8 text-yellow-500" />,
    },
    {
      title: "Backend Development",
      description: "Creating and maintaining backend services that are scalable and performant.",
      icon: <FaServer className="w-8 h-8 text-yellow-500" />,
    },
    {
      title: "UI/UX Design",
      description: "Designing and implementing interfaces that are intuitive, responsive, and visually appealing.",
      icon: <FaPaintBrush className="w-8 h-8 text-yellow-500" />,
    },
    {
      title: "Mobile Development",
      description: "Developing Android applications using modern tools and frameworks.",
      icon: <FaMobileAlt className="w-8 h-8 text-yellow-500" />,
    },
  ];

  const skills = [
    { name: "React", icon: <FaReact className="w-8 h-8 text-yellow-500" /> },
    { name: "Node.js", icon: <FaNodeJs className="w-8 h-8 text-yellow-500" /> },
    { name: "TypeScript", icon: <SiTypescript className="w-8 h-8 text-yellow-500" /> },
    { name: "Django", icon: <SiDjango className="w-8 h-8 text-yellow-500" /> },
    { name: "Kotlin", icon: <SiKotlin className="w-8 h-8 text-yellow-500" /> },
    { name: "Python", icon: <FaPython className="w-8 h-8 text-yellow-500" /> },
    { name: "Three.js", icon: <SiThreedotjs className="w-8 h-8 text-yellow-500" /> },
    { name: "Cypress", icon: <SiCypress className="w-8 h-8 text-yellow-500" /> }
  ];

  return (
    <Section title="About Me">
      {/* About Section Content */}
      <div className="space-y-16 mb-12">
        {/* Bio Card */}
        <div className={`
          /* [Bio Card] Enhanced card with gradient background */
          bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl p-6 
          border border-zinc-700 
          shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_16px_rgba(0,0,0,0.4)] 
          backdrop-blur-sm
        `}>
          <div className="text-zinc-300 space-y-5">
            <div className="flex items-start gap-4">
              {/* Bio Icon with Gradient */}
              <div className={`
                /* [Icon Container] Embossed icon with gradient */
                mt-1 flex-shrink-0 bg-gradient-to-br from-yellow-400 to-yellow-600 
                p-2 rounded-full 
                shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.4)]
              `}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="text-zinc-900">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                </svg>
              </div>
              <div>
                <p>
                  Developer with experience in both consultancy work and product companies.
                  I'm comfortable working across the stack, but I especially enjoy frontend development.
                </p>
                <p className="mt-4">
                  My time as a consultant taught me to solve problems flexibly for different clients, while working in a larger product company gave me hands-on experience with CI/CD pipelines,
                  automated testing, and building maintainable systems at scale.
                  I aim to write code that's straightforward to use today and easy to improve tomorrow, whether it's a quick fix or a long-term solution.
                </p>
                <p className="mt-4">
                  If you're looking for a developer who can adapt to your needs and deliver results, let's talk!
                  I'm open to new opportunities and excited to discuss how I could contribute to your team.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Services */}
        <div>
          <h2 className="section-title">
            <span className="section-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-zinc-900" viewBox="0 0 16 16">
                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8zm0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z"/>
              </svg>
            </span>
            Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <IconCard
                key={service.title}
                title={service.title}
                description={service.description}
                icon={service.icon}
              />
            ))}
          </div>
        </div>
        
        {/* Skills */}
        <div>
          <h2 className="section-title">
            <span className="section-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-zinc-900" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                <path d="M6.854 4.646a.5.5 0 0 1 0 .708L4.207 8l2.647 2.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0zm2.292 0a.5.5 0 0 0 0 .708L11.793 8l-2.647 2.646a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708 0z"/>
              </svg>
            </span>
            Skills
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {skills.map((skill) => (
              <div 
                key={skill.name}
                className={`
                  /* [Skill Card] Individual skill display */
                  flex flex-col items-center bg-zinc-800/50 rounded-lg p-4 border border-zinc-700
                `}
              >
                {skill.icon}
                <span className="mt-2 text-zinc-300">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
