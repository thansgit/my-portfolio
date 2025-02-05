import { Card, CardContent } from "@/components/ui/card";
import { SectionTitle } from "@/components/SectionTitle";

interface ServiceItem {
  title: string;
  description: string;
}

export function AboutSection() {
  const services: ServiceItem[] = [
    {
      title: "Mobile Apps",
      description: "Professional development of applications for Android and iOS.",
    },
    {
      title: "Web Development",
      description: "High-quality development of sites at the professional level.",
    },
    {
      title: "UI/UX Design",
      description: "The most modern and high-quality design made at a professional level.",
    },
    {
      title: "Backend Development",
      description: "High-performance backend services designed for scalability and seamless user experience.",
    },
  ];

  const skills = ["React", "Node.js", "TypeScript", "MongoDB"];

  return (
    <section>
      <SectionTitle>About Me</SectionTitle>
      
      {/* About Text */}
      <div className="text-zinc-400 space-y-4 mb-12">
        <p>
          A passionate full-stack developer with strong expertise in web
          development, REST APIs, UI/UX, and data management solutions. Proven
          track record in delivering cutting-edge solutions, including API
          integration and performance optimization.
        </p>
        <p>
          If you're seeking a skilled developer to breathe life into your
          project and exceed your expectations, I'm here to collaborate and
          create magic together. Reach out, and let's transform your vision into
          reality!
        </p>
      </div>

      {/* Services Section */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold text-yellow-500 mb-6">What I'm Doing</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {services.map((service) => (
            <Card key={service.title} className="bg-zinc-800 border-zinc-700">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold mb-2 text-white">
                  {service.title}
                </h4>
                <p className="text-zinc-400 text-sm">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Skills Section */}
      <div>
        <h3 className="text-xl font-semibold text-yellow-500 mb-6">Skills</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {skills.map((skill) => (
            <Card key={skill} className="bg-zinc-800 border-zinc-700">
              <CardContent className="p-6 flex items-center justify-center">
                <span className="font-medium text-white">{skill}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
