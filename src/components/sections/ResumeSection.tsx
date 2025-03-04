import { SectionTitle } from "@/components/ui/SectionTitle";
import { DownloadIcon, BriefcaseIcon, GraduationCapIcon, ChevronDownIcon, CheckIcon } from "lucide-react";
import { EducationItem, ExperienceItem } from "./types";
import { useState, useRef, useEffect } from "react";

export const ResumeSection = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'fi'>('en');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const resumeFiles = {
    en: "/resume-eng.pdf",
    fi: "/resume-fin.pdf"
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const education: EducationItem[] = [
    {
      school: "Tampereen yliopisto",
      degree: "Bachelor of Science in Computer Engineering",
      duration: "2019 — 2024"
    },
  ];

  const experience: ExperienceItem[] = [
    {
      company: "Haltu",
      position: "Fullstack Developer",
      duration: "2023 — 2024",
      responsibilities: [
        "Developed applications using Kotlin, Django, Python, TypeScript, and React.",
        "Performed maintenance tasks and managed deployments in Linux environments.",
        "Acted as a customer-facing developer, bridging communication between technical teams and clients.",
        "Gained experience across the full development lifecycle by working on diverse projects from start to finish.",
        "Used GitHub for version control, collaboration, and code reviews.",
      ]
    },
    {
      company: "Here Technologies",
      position: "Frontend Developer",
      duration: "2022 — 2023",
      responsibilities: [
        "Developed and maintained frontend features using TypeScript and React.",
        "Collaborated on UI design.",
        "Wrote and maintained Cypress tests to ensure code quality and reliability.",
        "Conducted feature demos for stakeholders to showcase new functionalities.",
        "Managed tasks and workflows using Jira for project tracking.",
      ]
    }
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      (e.currentTarget as HTMLAnchorElement).click();
    }
  };

  const handleDropdownKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setIsDropdownOpen(!isDropdownOpen);
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedLanguage(selectedLanguage === 'en' ? 'fi' : 'en');
    }
  };

  const handleLanguageSelect = (language: 'en' | 'fi') => {
    setSelectedLanguage(language);
    setIsDropdownOpen(false);
  };

  const handleLanguageKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, language: 'en' | 'fi') => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleLanguageSelect(language);
    }
  };

  return (
    <section>
      <div className="mb-6">
        <SectionTitle>Resume</SectionTitle>
        <div className="mt-4 relative" ref={dropdownRef}>
          <div className="flex items-center">
            <div
              className="inline-flex items-center px-4 py-2 bg-yellow-500 text-zinc-900 rounded-l-md hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-zinc-900 cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onKeyDown={handleDropdownKeyDown}
              tabIndex={0}
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
              aria-label="Select resume language"
            >
              <span className="font-medium mr-1 w-9 inline-block text-center">{selectedLanguage === 'en' ? 'Eng' : 'Fin'}</span>
              <ChevronDownIcon size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
            <a 
              href={resumeFiles[selectedLanguage]} 
              download
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-zinc-900 rounded-r-md border-l border-yellow-600 hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
              aria-label={`Download ${selectedLanguage === 'en' ? 'English' : 'Finnish'} resume as PDF`}
              tabIndex={0}
              onKeyDown={handleKeyDown}
            >
              <DownloadIcon size={16} />
              <span className="font-medium">PDF</span>
            </a>
          </div>
          
          {isDropdownOpen && (
            <div className="absolute mt-1 w-32 bg-zinc-800 rounded-md shadow-lg z-10 border border-zinc-700 overflow-hidden">
              <div 
                className={`px-4 py-2 flex items-center justify-between ${selectedLanguage === 'en' ? 'bg-zinc-700 text-white' : 'text-zinc-300 hover:bg-zinc-700'} cursor-pointer`}
                onClick={() => handleLanguageSelect('en')}
                onKeyDown={(e) => handleLanguageKeyDown(e, 'en')}
                tabIndex={0}
                aria-label="Select English resume"
              >
                <span>English</span>
                {selectedLanguage === 'en' && <CheckIcon size={16} />}
              </div>
              <div 
                className={`px-4 py-2 flex items-center justify-between ${selectedLanguage === 'fi' ? 'bg-zinc-700 text-white' : 'text-zinc-300 hover:bg-zinc-700'} cursor-pointer`}
                onClick={() => handleLanguageSelect('fi')}
                onKeyDown={(e) => handleLanguageKeyDown(e, 'fi')}
                tabIndex={0}
                aria-label="Select Finnish resume"
              >
                <span>Finnish</span>
                {selectedLanguage === 'fi' && <CheckIcon size={16} />}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Experience Section */}
      <div className="mb-12">
        <SectionTitle as="h3" color="yellow" className="text-xl mb-6">
          <div className="flex items-center gap-2">
            <BriefcaseIcon size={20} className="text-yellow-500" />
            <span>Experience</span>
          </div>
        </SectionTitle>
        <div className="space-y-8">
          {experience.map((exp, index) => (
            <div key={index} className="relative pl-6 border-l border-zinc-700">
              <div className="absolute w-3 h-3 bg-yellow-500 rounded-full -left-[6.5px] top-1.5" />
              <h4 className="font-medium text-lg text-white">{exp.company}</h4>
              <p className="text-yellow-500 mt-1">{exp.position}</p>
              <p className="text-sm text-zinc-500 mt-1 mb-3">{exp.duration}</p>
              <ul className="list-disc pl-4 space-y-1">
                {exp.responsibilities.map((resp, idx) => (
                  <li key={idx} className="text-zinc-400 text-sm">{resp}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div>
        <SectionTitle as="h3" color="yellow" className="text-xl mb-6">
          <div className="flex items-center gap-2">
            <GraduationCapIcon size={20} className="text-yellow-500" />
            <span>Education</span>
          </div>
        </SectionTitle>
        <div className="space-y-6">
          {education.map((edu, index) => (
            <div key={index} className="relative pl-6 border-l border-zinc-700">
              <div className="absolute w-3 h-3 bg-yellow-500 rounded-full -left-[6.5px] top-1.5" />
              <h4 className="font-medium text-lg text-white">{edu.school}</h4>
              <p className="text-zinc-400 mt-1">{edu.degree}</p>
              <p className="text-sm text-zinc-500 mt-1">{edu.duration}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 