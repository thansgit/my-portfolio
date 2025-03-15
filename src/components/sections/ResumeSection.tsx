'use client'

import { NeuSection, NeuButton, NeuTimeline, NeuTimelineItem, NeuContainer, NeuSectionTitle } from '@/components/ui'
import { DownloadIcon, BriefcaseIcon, GraduationCapIcon, ChevronDownIcon, CheckIcon } from 'lucide-react'
import { EducationItem, ExperienceItem } from './types'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

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
    <NeuSection title='Resume'>
      {/* Resume Download Button with Language Selector */}
      <div className='mb-12 flex justify-start'>
        <div className='relative' ref={dropdownRef}>
          <div className='flex'>
            {/* Resume Download Link */}
            <NeuButton
              variant='accent'
              className='rounded-r-none'
              onClick={() => window.open(resumeFiles[selectedLanguage], '_blank')}
              aria-label='Download resume'
            >
              <div className='flex items-center gap-2'>
                <DownloadIcon size={18} />
                <span>PDF</span>
              </div>
            </NeuButton>

            {/* Language Toggle Button */}
            <div
              className={cn(
                'flex cursor-pointer items-center gap-1 rounded-l-none rounded-r-md',
                'bg-neu-accent text-neu-textOnAccent px-3 py-2',
                'border-neu-accentDark border-l',
                'neu-button neu-button-accent',
                'transform transition-all duration-300',
                isDropdownOpen && 'translate-y-1',
                'hover:translate-y-[2px]',
              )}
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
            <NeuContainer className='shadow-neu-flat-md absolute right-0 z-10 mt-1 overflow-hidden'>
              {/* English Option */}
              <div
                className={cn(
                  'cursor-pointer px-4 py-2 transition-all duration-200',
                  selectedLanguage === 'en'
                    ? 'bg-neu-bgLight text-neu-accent'
                    : 'text-neu-textSecondary hover:bg-neu-bgLight hover:text-neu-accent',
                )}
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
                className={cn(
                  'cursor-pointer px-4 py-2 transition-all duration-200',
                  selectedLanguage === 'fi'
                    ? 'bg-neu-bgLight text-neu-accent'
                    : 'text-neu-textSecondary hover:bg-neu-bgLight hover:text-neu-accent',
                )}
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
            </NeuContainer>
          )}
        </div>
      </div>

      {/* Experience Section */}
      <div className='mb-12'>
        <NeuSectionTitle withIcon icon={<BriefcaseIcon size={20} />}>
          Work Experience
        </NeuSectionTitle>

        <NeuTimeline>
          {experience.map((job) => (
            <NeuTimelineItem
              key={job.company}
              title={job.position}
              subtitle={job.company}
              period={job.duration}
              icon={<BriefcaseIcon size={12} />}
            >
              <ul className='text-neu-textSecondary list-inside list-disc space-y-1 pl-2'>
                {job.responsibilities.map((responsibility, index) => (
                  <li key={index} className='text-sm'>
                    {responsibility}
                  </li>
                ))}
              </ul>
            </NeuTimelineItem>
          ))}
        </NeuTimeline>
      </div>

      {/* Education Section */}
      <div>
        <NeuSectionTitle withIcon icon={<GraduationCapIcon size={20} />}>
          Education
        </NeuSectionTitle>

        <NeuTimeline>
          {education.map((edu) => (
            <NeuTimelineItem
              key={edu.school}
              title={edu.degree}
              subtitle={edu.school}
              period={edu.duration}
              icon={<GraduationCapIcon size={12} />}
            />
          ))}
        </NeuTimeline>
      </div>
    </NeuSection>
  )
}
