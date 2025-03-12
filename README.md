# Timo Hanski - Portfolio

A modern, optimized portfolio website built with Next.js 14, React, TypeScript, and Three.js featuring a 3D interactive
background, responsive design, and server components architecture.

## Project Structure

The project follows a well-organized structure with server/client component separation:

```
src/
├── app/                      # Next.js app directory (App Router)
│   ├── about/                # About page
│   ├── contact/              # Contact page
│   ├── portfolio/            # Portfolio page
│   ├── resume/               # Resume page
│   ├── page.tsx              # Home page (redirects to About)
│   ├── layout.tsx            # Root layout (server component)
│   ├── fonts.ts              # Font optimization
│   ├── metadata.ts           # SEO metadata
│   └── globals.css           # Global styles and utility classes
├── components/               # React components
│   ├── layout/               # Layout components
│   │   ├── ClientLayout.tsx  # Client-side layout wrapper
│   │   ├── Navigation.tsx    # Navigation component
│   │   ├── constants.ts      # Layout-related constants
│   │   └── index.ts          # Barrel exports
│   ├── sections/             # Section components
│   │   ├── AboutSection.tsx
│   │   ├── ResumeSection.tsx
│   │   ├── PortfolioSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── types.ts
│   │   └── index.ts
│   ├── three/                # Three.js components
│   │   ├── canvas/           # Canvas and scene setup
│   │   │   ├── Scene.tsx
│   │   │   ├── ViewportManager.tsx
│   │   │   └── LoadingProvider.tsx
│   │   ├── hooks/            # Custom React hooks
│   │   │   ├── useLoading.ts
│   │   │   └── useViewport.ts
│   │   ├── objects/          # 3D objects and models
│   │   ├── environment/      # Lighting and environment
│   │   ├── effects/          # Post-processing effects
│   │   ├── utils/            # Utility functions
│   │   └── index.ts
│   └── ui/                   # UI components
│       ├── form/             # Form components
│       │   ├── Button.tsx
│       │   └── TextField.tsx
│       ├── Section.tsx
│       ├── SectionTitle.tsx
│       ├── card.tsx
│       ├── Timeline.tsx
│       ├── IconCard.tsx
│       ├── VideoPlayer.tsx   # Optimized video player
│       ├── SplashScreen.tsx
│       └── index.ts
└── lib/                      # Utility functions and shared logic
    ├── theme.ts              # Theme configuration
    └── utils.ts              # General utilities
```

## Architectural Decisions

This portfolio follows modern Next.js development best practices:

### Server/Client Component Separation

- **Root Layout**: Server component for faster initial load
- **ClientLayout**: Client component for interactive elements
- Components are marked with `"use client"` only when needed

### Performance Optimizations

- **Dynamic Imports**: Heavy components like Three.js scene are lazy-loaded
- **Optimized Media Loading**: Videos only load when visible using Intersection Observer
- **Image Optimization**: Next.js Image component for automatic optimization
- **Server Components**: Static content renders on the server for improved SEO and performance
- **Tailwind Utility Classes**: Limited set of custom utility classes for common patterns

### UI Component Design

- **Composable Components**: UI elements designed for reusability
- **Tailwind + Component Extraction**: Balance between utility classes and component extraction
- **Accessibility Focus**: Proper ARIA attributes and keyboard navigation

## Technologies Used

- **Next.js 14**: React framework with App Router
- **React 18**: JavaScript library for building user interfaces
- **TypeScript**: Typed superset of JavaScript
- **Three.js**: 3D library for creating 3D graphics in the browser
- **React Three Fiber**: React renderer for Three.js
- **React Three Drei**: Useful helpers for React Three Fiber
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Lightweight icon library
- **Vercel Analytics**: Performance monitoring

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build and Deploy

To build the project for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Key Features

- **Interactive 3D Background**: Three.js scene with dynamic elements
- **Non-blocking Loading**: Content is available immediately, with 3D loading in background
- **Multi-language Resume**: Download resume in English or Finnish
- **Responsive Design**: Fully responsive across mobile, tablet, and desktop
- **Optimized Performance**: Fast page loads and transitions
- **Contact Form**: Working contact form with feedback
- **Portfolio Showcase**: Video demos of previous projects

## Deployment

The portfolio is optimized for deployment on Vercel, but can be deployed to any Next.js-compatible hosting platform.

```bash
npm run build
```

Then deploy the `out` directory to your hosting provider.
