import { Card, CardContent } from "@/components/ui/card";

export function SkillsSection() {
  const skills = ["React", "Node.js", "TypeScript", "MongoDB"];

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Skills</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {skills.map((skill) => (
          <Card key={skill} className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-6 flex items-center justify-center">
              <span className="font-medium text-white">{skill}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
