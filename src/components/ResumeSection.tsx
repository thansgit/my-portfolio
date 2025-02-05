import { SectionTitle } from "@/components/SectionTitle";

interface EducationItem {
  school: string;
  degree: string;
  duration: string;
}

interface ExperienceItem {
  company: string;
  position: string;
  duration: string;
  responsibilities: string[];
}

export const ResumeSection = () => {
  const education: EducationItem[] = [
    {
      school: "Lorem Ipsum University",
      degree: "Master of Science in Computer Engineering",
      duration: "2018 — 2020"
    },
    {
      school: "Dolor Sit Academy",
      degree: "Bachelor of Technology",
      duration: "2014 — 2018"
    }
  ];

  const experience: ExperienceItem[] = [
    {
      company: "Tech Innovations Corp",
      position: "Senior Software Engineer",
      duration: "2022 — Present",
      responsibilities: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse."
      ]
    },
    {
      company: "Digital Solutions Ltd",
      position: "Software Developer",
      duration: "2020 — 2022",
      responsibilities: [
        "Consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
        "Ut labore et dolore magna aliqua, ut enim ad minim veniam.",
        "Quis nostrud exercitation ullamco laboris nisi ut aliquip.",
        "Ex ea commodo consequat, duis aute irure dolor in reprehenderit."
      ]
    },
    {
      company: "Creative Tech Labs",
      position: "Junior Developer",
      duration: "2019 — 2020",
      responsibilities: [
        "Excepteur sint occaecat cupidatat non proident.",
        "Sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit."
      ]
    }
  ];

  return (
    <section>
      <SectionTitle>Resume</SectionTitle>
      
      {/* Experience Section */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold text-yellow-500 mb-6">Experience</h3>
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
        <h3 className="text-xl font-semibold text-yellow-500 mb-6">Education</h3>
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