'use client'

import { Card, CardContent, Section, VideoPlayer } from '@/components/ui'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { PortfolioItem } from './types'

export function PortfolioSection() {
  // Portfolio items data
  const portfolioItems: PortfolioItem[] = [
    {
      title: 'Blog / Social media',
      description:
        'A full-stack blog and social media platform with user authentication, post creation, commenting, and social features.',
      videoUrl: '/assets/videos/blogapp.mp4',
      technologies: ['React-redux', 'Express', 'Node', 'MongoDB', 'tailwindCSS'],
      githubUrl: 'https://github.com/thansgit/lol-service',
    },
    {
      title: 'Old portfolio site',
      description: 'My previous portfolio website showcasing my projects and skills with a clean, responsive design.',
      videoUrl: '/assets/videos/portfolio.mp4',
      technologies: ['React', 'Bootstrap', 'CSS'],
      githubUrl: 'https://github.com/thansgit/portfolio',
      liveUrl: 'https://thansgitportfolio.netlify.app/',
    },
    {
      title: 'Mine Sweeper GUI',
      description:
        'A desktop implementation of the classic Minesweeper game with customizable difficulty levels and game statistics.',
      videoUrl: '/assets/videos/minesweeper.mp4',
      technologies: ['C++17', 'QT'],
      githubUrl: 'https://github.com/thansgit/minesweeper_gui',
    },
    {
      title: 'To-Do app',
      description: 'A full-stack to-do application.',
      videoUrl: '/assets/videos/todo.mp4',
      technologies: ['React', 'Express', 'Mongoose', 'MongoDB'],
      githubUrl: 'https://github.com/thansgit/to-do',
    },
  ]

  return (
    <Section title='Portfolio'>
      <div className='grid grid-cols-1 gap-6'>
        {portfolioItems.map((item) => (
          <Card key={item.title} className='card-base group'>
            <CardContent className='relative p-0'>
              {/* Use optimized VideoPlayer component */}
              <VideoPlayer videoUrl={item.videoUrl} title={item.title} />

              {/* Content area */}
              <div className='p-4'>
                <h3 className='mb-2 text-xl font-semibold text-yellow-500'>{item.title}</h3>
                <p className='mb-4 text-zinc-300'>{item.description}</p>

                {/* Technology tags */}
                <div className='mb-4 flex flex-wrap gap-2'>
                  {item.technologies.map((tech) => (
                    <span
                      key={tech}
                      className={`/* [Tech Tag] Pill-shaped tags for technologies */ rounded-full bg-zinc-700 px-2 py-1 text-xs text-zinc-300`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Project links */}
                <div className='flex gap-4'>
                  {item.githubUrl && (
                    <a
                      href={item.githubUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='link-style flex items-center gap-1'
                      aria-label={`GitHub repository for ${item.title}`}
                      tabIndex={0}
                    >
                      <FaGithub />
                      <span>GitHub</span>
                    </a>
                  )}

                  {item.liveUrl && (
                    <a
                      href={item.liveUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='link-style flex items-center gap-1'
                      aria-label={`Live demo for ${item.title}`}
                      tabIndex={0}
                    >
                      <FaExternalLinkAlt />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  )
}
