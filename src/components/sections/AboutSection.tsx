'use client'

import { NeuSection, NeuContainer, NeuIconCard, NeuSectionTitle } from '@/components/ui'
import { ServiceItem } from './types'
import { FaReact, FaNodeJs, FaPython, FaLaptopCode, FaServer, FaPaintBrush, FaMobileAlt } from 'react-icons/fa'
import {
  SiTypescript,
  SiDjango,
  SiKotlin,
  SiThreedotjs,
  SiCypress,
  SiNextdotjs,
  SiBlender,
  SiExpress,
  SiTailwindcss,
} from 'react-icons/si'
import { cn } from '@/lib/utils'
import { SkillContainer } from '@/components/three/experiences/skills'

export function AboutSection() {
  const services: ServiceItem[] = [
    {
      title: 'Frontend Development',
      description: 'Building user interfaces with clean code.',
      icon: <FaLaptopCode className='h-8 w-8 text-neu-textOnAccent' />,
    },
    {
      title: 'Backend Development',
      description: 'Working on server-side logic and APIs.',
      icon: <FaServer className='h-8 w-8 text-neu-textOnAccent' />,
    },
    {
      title: 'UI/UX Design',
      description: 'Designing functional and intuitive interfaces.',
      icon: <FaPaintBrush className='h-8 w-8 text-neu-textOnAccent' />,
    },
    {
      title: 'Mobile Development',
      description: 'Developing Android apps with modern tools.',
      icon: <FaMobileAlt className='h-8 w-8 text-neu-textOnAccent' />,
    },
  ]

  // Define the skills for the 3D showcase
  const skills = [
    {
      name: 'TypeScript',
      description:
        'My primary language for app development, offering static typing to enhance code quality and catch errors early.',
      modelName: 'typescript',
    },
    {
      name: 'React',
      description: 'Component-based library for building user interfaces with reusable elements.',
      modelName: 'react',
    },
    {
      name: 'Next.js',
      description: 'The React framework I use for building server-rendered applications with optimized performance.',
      modelName: 'nextjs',
    },
    {
      name: 'Three.js',
      description: 'JavaScript 3D library for creating and displaying 3D graphics in a web browser.',
      modelName: 'threejs',
    },
    {
      name: 'Node.js',
      description: 'JavaScript runtime for server-side development with a non-blocking, event-driven architecture.',
      modelName: 'nodejs',
    },
    {
      name: 'Tailwind CSS',
      description: 'Utility-first CSS framework for rapid UI development with pre-defined classes.',
      modelName: 'tailwind',
    },
  ]

  return (
    <NeuSection title='About Me'>
      {/* About Section Content */}
      <div className='mb-12 space-y-16'>
        {/* Bio Card */}
        <NeuContainer withPadding>
          <div className='space-y-5 text-neu-text'>
            <div className='flex items-start gap-4'>
              {/* Bio Icon */}
              <div className='neu-icon mt-1 flex-shrink-0'>
                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' viewBox='0 0 16 16'>
                  <path d='M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z' />
                </svg>
              </div>
              <div>
                <p>
                  I'm a software developer who loves building visual and interactive experiences—especially on the web.
                  Frontend is my strong suit, but I'm also into backend work and experimenting with 3D. I like to do
                  things the smart way, not just the "as long as it works" way.
                </p>
                <p className='mt-4'>
                  Beyond coding, I'm interested in design, gamification, and creative ways to use technology. This
                  portfolio is my space to experiment, so you might find all kinds of unusual projects here.
                </p>
                <p className='mt-4'>
                  In my free time, I train, work on personal projects, and occasionally dive deep into whatever new
                  topic happens to catch my interest.
                </p>
                <p className='mt-4'>Got a cool idea or just want to chat? Hit me up!</p>
              </div>
            </div>
          </div>
        </NeuContainer>

        {/* Services */}
        <div>
          <NeuSectionTitle
            withIcon
            icon={
              <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' viewBox='0 0 16 16'>
                <path d='M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z' />
                <path d='M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8zm0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z' />
              </svg>
            }
          >
            Services
          </NeuSectionTitle>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {services.map((service) => (
              <NeuIconCard
                key={service.title}
                title={service.title}
                description={service.description}
                icon={service.icon}
              />
            ))}
          </div>
        </div>

        {/* Skills - Now with 3D models */}
        <div>
          <NeuSectionTitle
            withIcon
            icon={
              <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' viewBox='0 0 16 16'>
                <path d='M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z' />
                <path d='M6.854 4.646a.5.5 0 0 1 0 .708L4.207 8l2.647 2.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0zm2.292 0a.5.5 0 0 0 0 .708L11.793 8l-2.647 2.646a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708 0z' />
              </svg>
            }
          >
            Skills
          </NeuSectionTitle>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {skills.map((skill) => (
              <SkillContainer
                key={skill.name}
                skillName={skill.modelName}
                title={skill.name}
                description={skill.description}
              />
            ))}
          </div>
        </div>
      </div>
    </NeuSection>
  )
}
