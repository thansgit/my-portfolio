import { Card, CardContent } from "@/components/ui/card";
import { SectionTitle } from "@/components/SectionTitle";

interface ServiceItem {
  title: string;
  description: string;
}

export function AboutSection() {
  const services: ServiceItem[] = [
    {
      title: "Frontend Development",
      description: "Building and maintaining websites and web applications with a focus on clean code and great user experiences.",
    },
    {
      title: "Backend Development",
      description: "Creating and maintaining backend services that are scalable and performant.",
    },
    {
      title: "UI/UX Design",
      description: "Designing and implementing interfaces that are intuitive, responsive, and visually appealing.",
    },
    {
      title: "Mobile Development",
      description: "Developing Android applications using modern tools and frameworks.",
    },
  ];

  const skills = ["React", "Node.js", "TypeScript", "Django", "Kotlin", "Python", "Three.js", "Cypress"];

  return (
    <section>
      <SectionTitle>About Me</SectionTitle>
      
      {/* About Text */}
      <div className="text-zinc-400 space-y-4 mb-12">
        <p>
        Developer with experience in both consultancy work and product companies.
        I’m comfortable working across the stack, but I especially enjoy frontend development.
        </p>
        <p>
        My time as a consultant taught me to solve problems flexibly for different clients, while working in a larger product company gave me hands-on experience with CI/CD pipelines,
        automated testing, and building maintainable systems at scale.
        I aim to write code that's straightforward to use today and easy to improve tomorrow.
        </p>
        <p>
        If you're looking for a developer who can adapt to your needs and deliver results, let's talk!
        I'm open to new opportunities and excited to discuss how I could contribute to your team.
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
