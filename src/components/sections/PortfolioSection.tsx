import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { PortfolioItem } from "./types";

export function PortfolioSection() {
  const portfolioItems: PortfolioItem[] = [
    {
      title: "Blog / Social media",
      imageUrl: "/blogapp.gif",
      technologies: ["React-redux", "Express", "Node", "MongoDB", "tailwindCSS",],
      githubUrl: "https://github.com/thansgit/lol-service",
      liveUrl: "https://lol-blog-app.netlify.app/",
    },
    {
      title: "Old portfolio site",
      imageUrl: "/portfolio.gif",
      technologies: ["React", "Bootstrap", "CSS"],
      githubUrl: "https://github.com/thansgit/portfolio",
      liveUrl: "https://thansgitportfolio.netlify.app/",
    },
    {
      title: "Mine Sweeper GUI",
      imageUrl: "/minesweeper.gif",
      technologies: ["C++17", "QT"],
      githubUrl: "https://github.com/thansgit/minesweeper_gui",
    },
    {
      title: "To-Do app",
      imageUrl: "/todo.gif",
      technologies: ["React", "Express", "Mongoose", "MongoDB"],
      githubUrl: "https://github.com/thansgit/to-do",
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
              <div className="p-4 flex flex-col gap-2 bg-zinc-800">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  
                  <div className="flex space-x-2">
                    {item.liveUrl && (
                      <a 
                        href={item.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-white transition-colors p-2 rounded-full hover:bg-zinc-700"
                        aria-label={`View live demo of ${item.title}`}
                        onClick={(e) => e.stopPropagation()}
                        tabIndex={0}
                      >
                        <FaExternalLinkAlt className="w-4 h-4" />
                      </a>
                    )}
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
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {item.technologies.map((tech) => (
                    <span 
                      key={`${item.title}-${tech}`}
                      className="px-2 py-1 text-xs rounded bg-zinc-700 text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
} 