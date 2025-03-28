'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'

interface VideoPlayerProps {
  videoUrl: string
  title: string
  posterUrl?: string
  className?: string
}

export function VideoPlayer({ videoUrl, title, posterUrl, className = '' }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    }

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (!videoRef.current) return

        if (entry.isIntersecting) {
          if (videoRef.current.paused) {
            // Lazy-load video src when in viewport to improve performance
            if (videoRef.current.getAttribute('data-src')) {
              videoRef.current.src = videoRef.current.getAttribute('data-src') || ''
              videoRef.current.removeAttribute('data-src')
            }
            videoRef.current.play().catch((error) => console.log('Video play error:', error))
          }
        } else {
          if (!videoRef.current.paused) {
            videoRef.current.pause()
          }
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, options)

    if (videoRef.current) {
      observer.observe(videoRef.current)
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current)
      }
    }
  }, [])

  return (
    <div className={`relative aspect-video overflow-hidden bg-black ${className}`}>
      {/* Poster image shown during video loading for better UX */}
      {posterUrl && (
        <div className='absolute inset-0 z-0'>
          <Image
            src={posterUrl}
            alt={`${title} thumbnail`}
            fill
            sizes='(max-width: 768px) 100vw, 50vw'
            className='object-cover'
            priority={false}
          />
        </div>
      )}

      <video
        ref={videoRef}
        data-src={videoUrl}
        preload='none'
        loop
        muted
        playsInline
        className='relative z-10 h-full w-full object-contain'
        aria-label={`${title} demo video`}
        poster={posterUrl}
      />
    </div>
  )
}
