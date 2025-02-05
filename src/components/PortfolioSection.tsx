import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { SectionTitle } from "@/components/SectionTitle";

interface PortfolioItem {
  title: string;
  category: string;
  imageUrl: string;
}

export function PortfolioSection() {
  const portfolioItems: PortfolioItem[] = [
    {
      title: "Nagark App",
      category: "Application",
      imageUrl: "/cardplaceholder.jpg",
    },
    {
      title: "Ambition Guru",
      category: "Application",
      imageUrl: "/cardplaceholder.jpg",
    },
    {
      title: "Soclair",
      category: "Application",
      imageUrl: "/cardplaceholder.jpg",
    },
    {
      title: "Tolma",
      category: "Application",
      imageUrl: "/cardplaceholder.jpg",
    },
    {
      title: "Saara",
      category: "Application",
      imageUrl: "/cardplaceholder.jpg",
    },
    {
      title: "Ifood",
      category: "Application",
      imageUrl: "/cardplaceholder.jpg",
    },
    {
      title: "MeroDate",
      category: "Application",
      imageUrl: "/cardplaceholder.jpg",
    },
    {
      title: "Weather App",
      category: "Application",
      imageUrl: "/cardplaceholder.jpg",
    },
    {
      title: "Music App",
      category: "Application",
      imageUrl: "/cardplaceholder.jpg",
    },
  ];

  return (
    <section>
      <SectionTitle>Portfolio</SectionTitle>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.map((item) => (
          <Card 
            key={item.title} 
            className="group bg-zinc-800 border-zinc-700 overflow-hidden cursor-pointer"
            tabIndex={0}
            role="button"
            aria-label={`View ${item.title} project`}
          >
            <CardContent className="p-0 relative">
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-zinc-400">{item.category}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
} 