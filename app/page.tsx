'use client'

import { useState } from 'react'
import CameraComponent from './components/CameraComponent'

export default function Home() {
  const [emotions, setEmotions] = useState<Record<string, number>>({})
  
  return (
    <div className="container mx-auto px-4 py-4">
      {/* Simple header with strong visual impact */}
      <div className="mb-4 text-center">
        <h2 className="text-4xl font-black mb-0 text-white">
          Aura Aurora
        </h2>
        <p className="text-lg font-light text-white/80">
          See your emotions visualized
        </p>
      </div>
      
      {/* Camera Component - Main focus */}
      <CameraComponent setEmotions={setEmotions} />
    </div>
  )
} 