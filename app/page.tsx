'use client'

import { useState, useEffect } from 'react'
import CameraComponent from './components/CameraComponent'

export default function Home() {
  const [emotions, setEmotions] = useState<Record<string, number>>({})
  const [themeColor, setThemeColor] = useState('#3730a3') // Default theme color (indigo)
  const [backgroundStyle, setBackgroundStyle] = useState('')
  
  // Update theme color and background based on all emotions
  useEffect(() => {
    if (Object.keys(emotions).length === 0) return;
    
    // Find the dominant emotion for the theme color
    const dominantEmotion = Object.entries(emotions)
      .sort(([_, scoreA], [__, scoreB]) => scoreB - scoreA)[0];
    
    if (!dominantEmotion) return;
    
    const emotionType = dominantEmotion[0];
    
    // Set color based on emotion type
    switch(emotionType) {
      case 'joy':
        setThemeColor('#FFDD00');
        break;
      case 'sadness':
        setThemeColor('#0080FF');
        break;
      case 'anger':
        setThemeColor('#FF2D00');
        break;
      case 'fear':
        setThemeColor('#9900FF');
        break;
      case 'surprise':
        setThemeColor('#00FFFF');
        break;
      case 'disgust':
        setThemeColor('#00FF80');
        break;
      case 'contempt':
        setThemeColor('#FF6600');
        break;
      default:
        setThemeColor('#3730a3');
    }
    
    // Create background with all present emotions
    const significantEmotions = Object.entries(emotions)
      .filter(([_, score]) => score > 0.1)
      .sort(([_, scoreA], [__, scoreB]) => scoreB - scoreA);
    
    if (significantEmotions.length > 0) {
      // Create gradient stops based on emotions
      let gradientStops = '';
      
      // Add multiple radial gradients with emotion colors
      significantEmotions.forEach(([emotion, intensity], index) => {
        const color = getEmotionColor(emotion);
        const opacity = Math.min(0.4, intensity * 0.5); // Cap at 0.4 opacity
        const opacityHex = Math.round(opacity * 255).toString(16).padStart(2, '0');
        const x = 10 + (index * 30) % 80; // Distribute horizontally
        const y = 20 + (index * 25) % 60; // Distribute vertically
        const size = 40 + (intensity * 60); // Size based on intensity
        
        gradientStops += `radial-gradient(circle at ${x}% ${y}%, ${color}${opacityHex} 0%, transparent ${size}%),`;
      });
      
      // Add base gradient
      gradientStops += 'radial-gradient(circle at center, rgba(0,0,10,0.9) 0%, rgba(0,0,20,1) 100%)';
      
      setBackgroundStyle(gradientStops);
    } else {
      setBackgroundStyle('radial-gradient(circle at center, rgba(0,0,10,0.9) 0%, rgba(0,0,20,1) 100%)');
    }
  }, [emotions]);
  
  // Helper function to get emotion color
  const getEmotionColor = (emotion: string): string => {
    switch(emotion) {
      case 'joy': return '#FFDD00';
      case 'sadness': return '#0080FF';
      case 'anger': return '#FF2D00';
      case 'fear': return '#9900FF';
      case 'surprise': return '#00FFFF';
      case 'disgust': return '#00FF80';
      case 'contempt': return '#FF6600';
      default: return '#AAAAAA';
    }
  };
  
  return (
    <div 
      className="container mx-auto px-4 py-8 min-h-screen relative overflow-hidden" 
      style={{
        background: backgroundStyle || 'radial-gradient(circle at top, rgba(0,0,10,0.9) 0%, rgba(0,0,20,1) 100%)'
      }}
    >
      {/* Dynamic Background Pattern */}
      <div 
        className="fixed inset-0 -z-10 opacity-30" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23${themeColor.substring(1)}' fill-opacity='0.1'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.05
        }}
      />
      
      {/* High-tech header with subtle accent color */}
      <header className="mb-8 text-center lg:text-left relative z-10">
        <h1 
          className="text-5xl font-black mb-2 tracking-tighter"
          style={{ 
            background: `linear-gradient(90deg, #fff 0%, ${themeColor} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(255,255,255,0.1)'
          }}
        >
          Aura Aurora
        </h1>
        <p className="text-xl font-light text-white/80">
          Visualize emotions as dynamic aurora patterns
        </p>
      </header>
      
      {/* Responsive container for side-by-side layout */}
      <div className="responsive-container relative z-10">
        {/* Video container - left side on desktop */}
        <div className="video-container">
          <CameraComponent setEmotions={setEmotions} />
        </div>
        
        {/* Info container - right side on desktop */}
        <div className="info-container pt-6 lg:pt-0 lg:pl-8">
          <div className="glass p-6 mb-8" style={{ borderLeft: `3px solid ${themeColor}40` }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: themeColor }}>
              About Aura Aurora
            </h2>
            <p className="mb-4">
              Aura Aurora creates a visual representation of your emotions, displayed as a dynamic, flowing aurora around you. The colors and patterns shift in real-time to reflect your emotional state.
            </p>
            <p>
              The intensity of each color corresponds to the strength of the associated emotion, while the aurora's movement and form create a unique emotional fingerprint.
            </p>
          </div>
          
          {/* How it works section */}
          <div className="glass p-6" style={{ borderLeft: `3px solid ${themeColor}40` }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: themeColor }}>
              How It Works
            </h2>
            <ol className="space-y-4 list-decimal list-inside">
              <li className="opacity-90">Click "Start Camera" to activate your webcam</li>
              <li className="opacity-90">Click "Start Analysis" to begin emotion detection</li>
              <li className="opacity-90">Your emotional aura will appear around your video</li>
              <li className="opacity-90">Watch as the aurora changes with your emotions</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
} 