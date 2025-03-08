import { Card, CardContent } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/SectionTitle";
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
import { motion } from "framer-motion";

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
    <section className="relative">

      <div className="relative z-10">
        <SectionTitle className="text-shadow-emboss">About Me</SectionTitle>
        
        {/* About Section Content */}
        <div className="space-y-16 mb-12">
          <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl p-6 border border-zinc-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_16px_rgba(0,0,0,0.4)] backdrop-blur-sm">
            <div className="text-zinc-300 space-y-5">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex-shrink-0 bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.4)]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="text-zinc-900">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
                  </svg>
                </div>
                <p className="text-shadow-subtle">
                  Developer with experience in both consultancy work and product companies.
                  I'm comfortable working across the stack, but I especially enjoy frontend development.
                </p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1 flex-shrink-0 bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.4)]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="text-zinc-900">
                    <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                  </svg>
                </div>
                <p className="text-shadow-subtle">
                  My time as a consultant taught me to solve problems flexibly for different clients, while working in a larger product company gave me hands-on experience with CI/CD pipelines,
                  automated testing, and building maintainable systems at scale.
                  I aim to write code that's straightforward to use today and easy to improve tomorrow, whether it's a quick fix or a long-term solution.
                </p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1 flex-shrink-0 bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.4)]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="text-zinc-900">
                    <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z"/>
                  </svg>
                </div>
                <p className="text-shadow-subtle">
                  If you're looking for a developer who can adapt to your needs and deliver results, let's talk!
                  I'm open to new opportunities and excited to discuss how I could contribute to your team.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-12">
          <SectionTitle as="h3" color="yellow" className="text-xl mb-6 text-shadow-emboss">What I'm Doing</SectionTitle>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => (
              <motion.div 
                key={service.title} 
                whileHover={{ translateY: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="h-full"
              >
                <Card className="bg-gradient-to-br from-zinc-800 to-zinc-900 border-none overflow-hidden relative rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.5)] h-full min-h-[180px]">
                  <div className="absolute inset-0 bg-zinc-900/70 backdrop-blur-[1px]"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                  <CardContent className="p-6 flex items-start gap-4 relative h-full">
                    <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md flex items-center justify-center shadow-[0_4px_6px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.5)] flex-shrink-0">
                      {service.icon}
                    </div>
                    <div className="flex flex-col flex-1">
                      <h4 className="text-lg font-semibold mb-2 text-white text-shadow-glow">
                        {service.title}
                      </h4>
                      <p className="text-zinc-300 text-sm text-shadow-subtle">{service.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div>
          <SectionTitle as="h3" color="yellow" className="text-xl mb-6 text-shadow-emboss">Skills</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {skills.map((skill) => (
              <motion.div
                key={skill.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="relative bg-gradient-to-br from-zinc-800 to-black border-none overflow-hidden rounded-xl shadow-[0_8px_16px_rgba(0,0,0,0.4)]">
                  <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/50 to-zinc-900/80 backdrop-blur-[1px]"></div>
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <CardContent className="p-6 flex flex-col items-center justify-center gap-3 relative">
                    <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                      {skill.icon}
                    </div>
                    <span className="font-medium text-white text-center text-shadow-glow">{skill.name}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
