# My Portfolio

A modern portfolio website built with Next.js, React, TypeScript, and Three.js.

## Project Structure

The project follows a well-organized structure:

```
src/
├── app/                  # Next.js app directory
│   ├── page.tsx          # Main page component
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── layout/           # Layout components
│   │   ├── Navigation.tsx
│   │   ├── constants.ts
│   │   └── index.ts
│   ├── sections/         # Section components
│   │   ├── AboutSection.tsx
│   │   ├── ResumeSection.tsx
│   │   ├── PortfolioSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── types.ts
│   │   └── index.ts
│   ├── three/            # Three.js components
│   │   ├── Scene.tsx
│   │   ├── Background.tsx
│   │   ├── Band.tsx
│   │   ├── LightformerConfig.tsx
│   │   ├── constants/
│   │   ├── types/
│   │   ├── viewport/
│   │   └── index.ts
│   └── ui/               # UI components
│       ├── SectionTitle.tsx
│       └── card.tsx
└── lib/                  # Utility functions
    └── utils.ts
```

## Technologies Used

- **Next.js**: React framework for server-rendered applications
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Typed superset of JavaScript
- **Three.js**: 3D library for creating 3D graphics in the browser
- **React Three Fiber**: React renderer for Three.js
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: UI component library

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

## Code Organization

- **Named Exports**: Components use named exports for consistency
- **Type Definitions**: Types are organized in dedicated type files
- **Constants**: Constants are extracted to dedicated files
- **Reusable Components**: UI components are designed to be reusable
- **Responsive Design**: The site is fully responsive for all device sizes

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
