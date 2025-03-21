'use client'

import React from 'react'
import { SkillModel } from './SkillModel'

interface SkillContainerProps {
  skillName: string
  title: string
  description: string
}

export function SkillContainer({ skillName, title, description }: SkillContainerProps) {
  return (
    <div className="w-full h-full flex flex-col">
      {/* 3D Model Container - takes up 70% of the height */}
      <div className="h-[70%] w-full relative">
        <SkillModel skillName={skillName} />
      </div>
      
      {/* Text Overlay - fixed at the bottom */}
      <div className="h-[30%] flex flex-col justify-start p-4">
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className="text-sm text-neutral-300">{description}</p>
      </div>
    </div>
  )
}