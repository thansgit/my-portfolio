'use client'

import { ReactNode, Suspense, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/layout'
import { LoadingProvider, useLoading } from '@/components/three'
import { theme } from '@/lib/theme'
import { ThreeDLoadingIndicators } from '@/components/ui'

// Dynamically import the Scene component with no SSR
const Scene = dynamic(() => import('@/components/three').then((mod) => mod.Scene), {
  ssr: false,
  loading: () => <div className='fixed inset-0 bg-black' />,
})

const RoutePrefetcher = () => {
  const router = useRouter()
  const { isLoaded } = useLoading()

  useEffect(() => {
    // Prefetch routes after 3D content is loaded
    if (isLoaded) {
      console.log('3D content loaded, prefetching routes...')
      router.prefetch('/')
      router.prefetch('/about')
      router.prefetch('/portfolio')
      router.prefetch('/resume')
      router.prefetch('/contact')
    }
  }, [router, isLoaded])

  return null
}

const SceneContainer = () => {
  const { isLoaded } = useLoading()

  return (
    <div className='pointer-events-none fixed inset-0'>
      {/* Always show placeholder gradient until 3D scene is loaded */}
      <div className={`absolute inset-0 bg-black ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />

      {/* Load 3D scene in parallel */}
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </div>
  )
}

interface ClientLayoutProps {
  children: ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className='min-h-screen text-white'>
      <LoadingProvider>
        <RoutePrefetcher />
        <ThreeDLoadingIndicators />
        <SceneContainer />

        {/* Main Content */}
        <div className='relative z-10 mt-[60vh] p-8 pb-24 md:ml-[35%] md:mt-0 md:pb-8'>
          <main className='max-w-4xl'>
            {/* Main container */}
            <div className='relative overflow-hidden rounded-xl'>
              {/* Metallic border */}
              <div className='absolute inset-0 rounded-xl border border-zinc-500 bg-gradient-to-b from-zinc-600 via-zinc-700 to-zinc-800 shadow-[0_0_25px_rgba(0,0,0,0.6)]'>
                {/* Metallic inner border */}
                <div className='absolute inset-[5px] overflow-hidden rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900'>
                  <div className='absolute inset-0 bg-gradient-to-br from-zinc-400/40 via-zinc-600/60 to-zinc-900/80 backdrop-blur-[1px]'></div>
                </div>
              </div>

              {/* Dark leather texture container */}
              <div className='relative z-10 m-[8px] overflow-hidden rounded-lg bg-zinc-900'>
                <div className='absolute inset-0 bg-zinc-800/20 bg-[radial-gradient(#333_1px,transparent_1px)] bg-[size:4px_4px] opacity-10'></div>

                {/* Content container */}
                <div className='relative z-10 p-6'>
                  {/* Desktop Navigation with Social Links */}
                  <div className='hidden md:block'>
                    <div className='flex items-center justify-between'>
                      <Navigation />
                      <div className='flex items-center space-x-4'>
                        <a
                          href='https://linkedin.com/in/timo-hanski-731413247'
                          target='_blank'
                          rel='noopener noreferrer'
                          className='link-style'
                          aria-label='LinkedIn Profile'
                          tabIndex={0}
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='20'
                            height='20'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
                          </svg>
                        </a>
                        <a
                          href='https://github.com/thansgit'
                          target='_blank'
                          rel='noopener noreferrer'
                          className='link-style'
                          aria-label='GitHub Profile'
                          tabIndex={0}
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='20'
                            height='20'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Active Section Content */}
                  <div className='w-full'>{children}</div>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Mobile Navigation with Social Links */}
        <div className='md:hidden'>
          <Navigation />

          <div className='fixed right-4 top-4 z-50 flex space-x-4'>
            <a
              href='https://linkedin.com/in/timo-hanski-731413247'
              target='_blank'
              rel='noopener noreferrer'
              className='mobile-icon-button'
              aria-label='LinkedIn Profile'
              tabIndex={0}
            >
              <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
              </svg>
            </a>
            <a
              href='https://github.com/thansgit'
              target='_blank'
              rel='noopener noreferrer'
              className='mobile-icon-button'
              aria-label='GitHub Profile'
              tabIndex={0}
            >
              <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
              </svg>
            </a>
          </div>
        </div>
      </LoadingProvider>
    </div>
  )
}
