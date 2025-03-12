'use client'

import { Section, Button, Timeline, TimelineItem } from '@/components/ui'
import { DownloadIcon, BriefcaseIcon, GraduationCapIcon, ChevronDownIcon, CheckIcon } from 'lucide-react'
import { EducationItem, ExperienceItem } from './types'
import { useState, useRef, useEffect } from 'react'
import { theme } from '@/lib/theme'

export const ResumeSection = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'fi'>('en')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const resumeFiles = {
    en: '/assets/documents/resume-eng.pdf',
    fi: '/assets/documents/resume-fin.pdf',
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const experience: ExperienceItem[] = [
    {
      company: 'Haltu',
      position: 'Full-Stack Developer',
      duration: '2023 - 2024',
      responsibilities: [
        'Developed applications using Kotlin, Django, Python, TypeScript, and React.',
        'Performed maintenance tasks and managed deployments in Linux environments.',
        'Acted as a customer-facing developer, bridging communication between technical teams and clients.',
        'Gained experience across the full development lifecycle by working on diverse projects from start to finish.',
        'Used GitHub for version control, collaboration, and code reviews.',
      ],
    },
    {
      company: 'Here Technologies',
      position: 'Frontend Developer',
      duration: '2022 - 2023',
      responsibilities: [
        'Developed and maintained frontend features using TypeScript and React.',
        'Collaborated on UI design.',
        'Wrote and maintained Cypress tests to ensure code quality and reliability.',
        'Conducted feature demos for stakeholders to showcase new functionalities.',
        'Managed tasks and workflows using Jira for project tracking.',
      ],
    },
  ]

  const education: EducationItem[] = [
    {
      school: 'Tampere University of Applied Sciences',
      degree: 'Bachelor of Computer Science',
      duration: '2019 - 2024',
    },
    {
      school: 'Helsinki University',
      degree: 'Fullstack Open',
      duration: '2022',
    },
  ]

  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      window.open(resumeFiles[selectedLanguage], '_blank')
    }
  }

  const handleDropdownKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsDropdownOpen(!isDropdownOpen)
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false)
    }
  }

  const handleLanguageSelect = (language: 'en' | 'fi') => {
    setSelectedLanguage(language)
    setIsDropdownOpen(false)
  }

  const handleLanguageKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, language: 'en' | 'fi') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleLanguageSelect(language)
    }
  }

  return (
    <Section title='Resume'>
      {/* Resume Download Button with Language Selector */}
      <div className='mb-12 flex justify-start'>
        <div className='relative' ref={dropdownRef}>
          <div className='flex'>
            {/* Resume Download Link */}
            <a
              href={resumeFiles[selectedLanguage]}
              target='_blank'
              rel='noopener noreferrer'
              className='button-primary rounded-r-none'
              aria-label='Download resume'
              onKeyDown={handleKeyDown}
              tabIndex={0}
            >
              <div className='flex items-center gap-2'>
                <DownloadIcon size={18} />
                <span>Download Resume</span>
              </div>
            </a>

            {/* Language Toggle Button */}
            <div
              className={`/* [Dropdown Toggle] Language selector dropdown button */ flex cursor-pointer items-center gap-1 rounded-r-md border-l border-yellow-600 bg-yellow-500 px-3 py-2 text-zinc-900 transition-colors hover:bg-yellow-600`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onKeyDown={handleDropdownKeyDown}
              tabIndex={0}
              aria-haspopup='true'
              aria-expanded={isDropdownOpen}
              role='button'
            >
              <span className='uppercase'>{selectedLanguage}</span>
              <ChevronDownIcon size={16} />
            </div>
          </div>

          {/* Language Dropdown Menu */}
          {isDropdownOpen && (
            <div className='absolute right-0 z-10 mt-1 overflow-hidden rounded-md bg-zinc-800 shadow-lg'>
              {/* English Option */}
              <div
                className={`/* [Dropdown Item] Language option in dropdown */ cursor-pointer px-4 py-2 ${selectedLanguage === 'en' ? 'bg-zinc-700 text-yellow-500' : 'text-zinc-300 hover:bg-zinc-700'} `}
                onClick={() => handleLanguageSelect('en')}
                onKeyDown={(e) => handleLanguageKeyDown(e, 'en')}
                tabIndex={0}
                role='option'
                aria-selected={selectedLanguage === 'en'}
              >
                <div className='flex items-center gap-2'>
                  {selectedLanguage === 'en' && <CheckIcon size={16} />}
                  <span className={selectedLanguage === 'en' ? 'ml-0' : 'ml-6'}>English</span>
                </div>
              </div>

              {/* Finnish Option */}
              <div
                className={`/* [Dropdown Item] Language option in dropdown */ cursor-pointer px-4 py-2 ${selectedLanguage === 'fi' ? 'bg-zinc-700 text-yellow-500' : 'text-zinc-300 hover:bg-zinc-700'} `}
                onClick={() => handleLanguageSelect('fi')}
                onKeyDown={(e) => handleLanguageKeyDown(e, 'fi')}
                tabIndex={0}
                role='option'
                aria-selected={selectedLanguage === 'fi'}
              >
                <div className='flex items-center gap-2'>
                  {selectedLanguage === 'fi' && <CheckIcon size={16} />}
                  <span className={selectedLanguage === 'fi' ? 'ml-0' : 'ml-6'}>Finnish</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Experience Section */}
      <div className='mb-12'>
        <h2 className='section-title'>
          <span className='section-icon'>
            <BriefcaseIcon size={20} />
          </span>
          Work Experience
        </h2>

        <Timeline>
          {experience.map((job) => (
            <TimelineItem
              key={job.company}
              title={job.position}
              subtitle={job.company}
              period={job.duration}
              icon={<BriefcaseIcon size={12} className='text-zinc-900' />}
            >
              <ul className='list-inside list-disc space-y-1 pl-2 text-zinc-300'>
                {job.responsibilities.map((responsibility, index) => (
                  <li key={index} className='text-sm'>
                    {responsibility}
                  </li>
                ))}
              </ul>
            </TimelineItem>
          ))}
        </Timeline>
      </div>

      {/* Education Section */}
      <div>
        <h2 className='section-title'>
          <span className='section-icon'>
            <GraduationCapIcon size={20} />
          </span>
          Education
        </h2>

        <Timeline>
          {education.map((edu) => (
            <TimelineItem
              key={edu.school}
              title={edu.degree}
              subtitle={edu.school}
              period={edu.duration}
              icon={<GraduationCapIcon size={12} className='text-zinc-900' />}
            />
          ))}
        </Timeline>
      </div>
    </Section>
  )
}
