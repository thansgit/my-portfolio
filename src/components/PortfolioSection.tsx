import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { SectionTitle } from "@/components/SectionTitle";
import { FaGithub } from "react-icons/fa";

interface PortfolioItem {
  title: string;
  category: string;
  imageUrl: string;
  githubUrl?: string; // Optional GitHub URL
}

export function PortfolioSection() {
  const portfolioItems: PortfolioItem[] = [
    {
      title: "Blog / Social media",
      category: "Application",
      imageUrl: "/blogapp.gif",
      githubUrl: "https://github.com/yourusername/blog-app",
    },
    {
      title: "Old portfolio site",
      category: "Application",
      imageUrl: "/portfolio.gif",
      githubUrl: "https://github.com/yourusername/portfolio",
    },
    {
      title: "Mine Sweeper GUI",
      category: "Application",
      imageUrl: "/minesweeper.gif",
      githubUrl: "https://github.com/yourusername/minesweeper",
    },
    {
      title: "To-Do app",
      category: "Application",
      imageUrl: "/todo.gif",
      githubUrl: "https://github.com/yourusername/todo-app",
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
              <div className="aspect-video relative overflow-hidden bg-black">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="h-px w-full bg-zinc-700"></div>
              <div className="p-4 flex justify-between items-center bg-zinc-800">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-zinc-400">{item.category}</p>
                </div>
                {item.githubUrl && (
                  <a 
                    href={item.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white transition-colors p-2 rounded-full hover:bg-zinc-700"
                    aria-label={`View ${item.title} source code on GitHub`}
                    onClick={(e) => e.stopPropagation()}
                    tabIndex={0}
                  >
                    <FaGithub className="w-5 h-5" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
} 