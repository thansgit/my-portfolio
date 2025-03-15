'use client'
//TODO: selvitä mikä järki tässä on
import React, { Suspense, useState, useEffect, ReactNode } from 'react'
import { Html } from '@react-three/drei'

interface ModelWrapperProps {
  children: ReactNode
  fallbackSize?: number
  loadingMessage?: string
  errorMessage?: string
}

// Error boundary component to catch rendering errors
class ErrorBoundary extends React.Component<
  { children: ReactNode; onError: (error: Error) => void },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; onError: (error: Error) => void }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    this.props.onError(error)
  }

  render() {
    if (this.state.hasError) {
      return null
    }

    return this.props.children
  }
}

export const ModelWrapper: React.FC<ModelWrapperProps> = ({
  children,
  fallbackSize = 1,
  loadingMessage = 'Loading model...',
  errorMessage = 'Failed to load model',
}) => {
  const [error, setError] = useState<Error | null>(null)

  // Simple fallbacks
  const ErrorFallback = () => (
    <Html center>
      <div className='rounded bg-red-500/80 p-2 text-center text-white'>
        <p>{errorMessage}</p>
        <p className='text-xs'>{error?.message}</p>
      </div>
    </Html>
  )

  const LoadingFallback = () => (
    <Html center>
      <div className='rounded bg-black/50 p-2 text-center text-white'>
        <p>{loadingMessage}</p>
      </div>
    </Html>
  )

  return (
    <ErrorBoundary onError={setError}>
      {error ? <ErrorFallback /> : <Suspense fallback={<LoadingFallback />}>{children}</Suspense>}
    </ErrorBoundary>
  )
}
