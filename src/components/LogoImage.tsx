'use client'

import Image from 'next/image'
import { useState } from 'react'

interface LogoImageProps {
  width: number
  height: number
  className?: string
  priority?: boolean
}

export function LogoImage({ width, height, className, priority = false }: LogoImageProps) {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    // Fallback to a simple text logo if image fails
    return (
      <div 
        className={`flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg ${className}`}
        style={{ width, height }}
      >
        MP
      </div>
    )
  }

  return (
    <Image 
      src="/MyPath.png" 
      alt="MyPath Logo" 
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={() => {
        console.error('Failed to load MyPath.png logo, using fallback');
        setImageError(true);
      }}
      // Add unoptimized as fallback for deployment issues
      unoptimized={process.env.NODE_ENV === 'production'}
    />
  )
}
