'use client'

import { NeuSection, NeuContainer, NeuIconCard, NeuSectionTitle } from '@/components/ui'
import { ServiceItem } from './types'
import { FaReact, FaNodeJs, FaPython, FaLaptopCode, FaServer, FaPaintBrush, FaMobileAlt } from 'react-icons/fa'
import { SiTypescript, SiDjango, SiKotlin, SiThreedotjs, SiCypress } from 'react-icons/si'
import { cn } from '@/lib/utils'

export function AboutSection() {
  const services: ServiceItem[] = [
    {
      title: 'Frontend Development',
      description: 'Building user interfaces with clean code.',
      icon: <FaLaptopCode className='text-neu-textOnAccent h-8 w-8' />,
    },
    {
      title: 'Backend Development',
      description: 'Working on server-side logic and APIs.',
      icon: <FaServer className='text-neu-textOnAccent h-8 w-8' />,
    },
    {
      title: 'UI/UX Design',
      description: 'Designing functional and intuitive interfaces.',
      icon: <FaPaintBrush className='text-neu-textOnAccent h-8 w-8' />,
    },
    {
      title: 'Mobile Development',
      description: 'Developing Android apps with modern tools.',
      icon: <FaMobileAlt className='text-neu-textOnAccent h-8 w-8' />,
    },
  ]

  const skills = [
    { name: 'React', icon: <FaReact className='text-neu-accent h-8 w-8' /> },
    { name: 'Node.js', icon: <FaNodeJs className='text-neu-accent h-8 w-8' /> },
    { name: 'TypeScript', icon: <SiTypescript className='text-neu-accent h-8 w-8' /> },
    { name: 'Django', icon: <SiDjango className='text-neu-accent h-8 w-8' /> },
    { name: 'Kotlin', icon: <SiKotlin className='text-neu-accent h-8 w-8' /> },
    { name: 'Python', icon: <FaPython className='text-neu-accent h-8 w-8' /> },
    { name: 'Three.js', icon: <SiThreedotjs className='text-neu-accent h-8 w-8' /> },
    { name: 'Cypress', icon: <SiCypress className='text-neu-accent h-8 w-8' /> },
  ]

  return (
    <NeuSection title='About Me'>
      {/* About Section Content */}
      <div className='mb-12 space-y-16'>
        {/* Bio Card */}
        <NeuContainer withPadding>
          <div className='text-neu-text space-y-5'>
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

        {/* Skills */}
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
          <div className='grid grid-cols-2 gap-6 sm:grid-cols-4'>
            {skills.map((skill) => (
              <NeuContainer
                key={skill.name}
                className={cn('flex flex-col items-center p-4 transition-all duration-300 hover:translate-y-[2px]')}
              >
                {skill.icon}
                <span className='text-neu-text mt-2'>{skill.name}</span>
              </NeuContainer>
            ))}
          </div>
        </div>
      </div>
    </NeuSection>
  )
}
