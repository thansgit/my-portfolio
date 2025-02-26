import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  color?: "default" | "yellow" | "white";
}

export const SectionTitle = ({
  children,
  className,
  as: Component = "h2",
  color = "default",
}: SectionTitleProps) => {
  const colorClasses = {
    default: "text-yellow-500",
    yellow: "text-yellow-500",
    white: "text-white",
  };

  return (
    <Component
      className={cn(
        "text-2xl font-bold mb-6",
        colorClasses[color],
        className
      )}
    >
      {children}
    </Component>
  );
}; 