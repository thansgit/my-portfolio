import { ReactNode } from "react";

// AboutSection types
export interface ServiceItem {
  title: string;
  description: string;
  icon?: string | ReactNode;
}

// ResumeSection types
export interface EducationItem {
  school: string;
  degree: string;
  duration: string;
}

export interface ExperienceItem {
  company: string;
  position: string;
  duration: string;
  responsibilities: string[];
}

// PortfolioSection types
export interface PortfolioItem {
  title: string;
  imageUrl: string;
  technologies: string[]; // Array of technologies used
  githubUrl?: string; // Optional GitHub URL
  liveUrl?: string; // Optional live demo URL
}

// ContactSection types
export interface ContactFormData {
  fullName: string;
  email: string;
  message: string;
}

export interface SubmitStatus {
  success?: boolean;
  message?: string;
} 