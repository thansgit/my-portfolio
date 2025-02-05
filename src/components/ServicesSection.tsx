import { Card, CardContent } from "@/components/ui/card";

export function ServicesSection() {
  const services = [
    {
      title: "Mobile Apps",
      description:
        "Professional development of applications for Android and iOS.",
    },
    {
      title: "Web Development",
      description:
        "High-quality development of sites at the professional level.",
    },
    {
      title: "UI/UX Design",
      description:
        "The most modern and high-quality design made at a professional level.",
    },
    {
      title: "Backend Development",
      description:
        "High-performance backend services designed for scalability and seamless user experience.",
    },
  ];

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-6">What I'm Doing</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {services.map((service) => (
          <Card key={service.title} className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2 text-white">
                {service.title}
              </h3>
              <p className="text-zinc-400 text-sm">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
