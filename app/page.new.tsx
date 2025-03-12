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
    
    // Create background with all present emotions - smoother transitions
    const significantEmotions = Object.entries(emotions)
      .filter(([_, score]) => score > 0.1)
      .sort(([_, scoreA], [__, scoreB]) => scoreB - scoreA);
    
    if (significantEmotions.length > 0) {
      // Create gradient stops based on emotions
      let gradientStops = '';
      
      // Add multiple radial gradients with emotion colors
      significantEmotions.forEach(([emotion, intensity], index) => {
        const color = getEmotionColor(emotion);
        // Smoother opacity transition
        const opacity = Math.min(0.4, intensity * 0.5); // Cap at 0.4 opacity
        const opacityHex = Math.round(opacity * 255).toString(16).padStart(2, '0');
        
        // More distributed positions for smoother effect
        const x = 10 + (index * 20 + Math.random() * 10) % 80;
        const y = 20 + (index * 15 + Math.random() * 10) % 60;
        
        // Larger size for more coverage
        const size = 50 + (intensity * 80);
        
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
        background: backgroundStyle || 'radial-gradient(circle at top, rgba(0,0,10,0.9) 0%, rgba(0,0,20,1) 100%)',
        transition: 'background 1.5s ease-in-out' // Smoother background transition
      }}
    >
      {/* Dynamic Background Pattern */}
      <div 
        className="fixed inset-0 -z-10 opacity-30" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23${themeColor.substring(1)}' fill-opacity='0.1'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.05,
          transition: 'opacity 1s ease-in-out' // Smoother pattern transition
        }}
      />
      
      {/* Background Floating Emojis */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -5 }}>
        {Object.entries(emotions)
          .filter(([_, score]) => score > 0.05)
          .flatMap(([emotion, score]) => {
            const emotionEmoji = 
              emotion === 'joy' ? '😊' :
              emotion === 'sadness' ? '😢' :
              emotion === 'anger' ? '😠' :
              emotion === 'fear' ? '😨' :
              emotion === 'surprise' ? '😲' :
              emotion === 'disgust' ? '🤢' :
              emotion === 'contempt' ? '😏' :
              '😐';
              
            // Generate multiple instances of each emoji based on score
            const count = Math.max(1, Math.floor(score * 10));
            return Array.from({ length: count }).map((_, index) => {
              // Random position and animation
              const left = Math.random() * 100;
              const top = Math.random() * 100;
              const size = 20 + Math.random() * 30;
              const duration = 15 + Math.random() * 20;
              const delay = Math.random() * 10;
              const opacity = 0.1 + Math.random() * 0.2;
              
              return (
                <div 
                  key={`${emotion}-${index}`}
                  className="absolute"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    fontSize: `${size}px`,
                    opacity: opacity,
                    animation: `floatEmoji ${duration}s ease-in-out ${delay}s infinite`,
                    transform: 'translateY(0px)',
                    filter: 'blur(1px)'
                  }}
                >
                  {emotionEmoji}
                </div>
              );
            });
          })}
      </div>
      
      {/* High-tech header with subtle accent color */}
      <header className="mb-8 text-center lg:text-left relative z-10">
        <h1 
          className="text-5xl font-black mb-2 tracking-tighter"
          style={{ 
            background: `linear-gradient(90deg, #fff 0%, ${themeColor} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(255,255,255,0.1)',
            transition: 'background 1s ease-in-out' // Smoother text color transition
          }}
        >
          Aura Aurora
        </h1>
        <p className="text-xl font-light text-white/80">
          Visualize emotions as dynamic aurora patterns
        </p>
      </header>
      
      {/* Responsive container for side-by-side layout */}
      <div className="responsive-container relative z-10 flex flex-col md:flex-row md:items-start md:gap-4">
        {/* Video container */}
        <div className="video-container md:order-2 md:flex-1">
          <CameraComponent setEmotions={setEmotions} />
        </div>
        
        {/* Emotion Emojis Display - without bounding boxes */}
        <div className="emoji-container pt-6 md:pt-0 md:w-[180px] md:order-1">
          <div className="p-3 bg-opacity-20 rounded-lg" style={{ 
            background: `linear-gradient(to right, ${themeColor}10, transparent)`,
            transition: 'background 1s ease-in-out'
          }}>
            {Object.keys(emotions).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(emotions)
                  .filter(([_, score]) => score > 0.05)
                  .sort(([_, scoreA], [__, scoreB]) => scoreB - scoreA)
                  .map(([emotion, score]) => {
                    // Get color for this emotion
                    const emotionColor = getEmotionColor(emotion);
                    
                    const emotionLabel = 
                      emotion === 'joy' ? 'Joy' :
                      emotion === 'sadness' ? 'Sadness' :
                      emotion === 'anger' ? 'Anger' :
                      emotion === 'fear' ? 'Fear' :
                      emotion === 'surprise' ? 'Surprise' :
                      emotion === 'disgust' ? 'Disgust' :
                      emotion === 'contempt' ? 'Contempt' :
                      'Neutral';
                    
                    const emotionEmoji = 
                      emotion === 'joy' ? '😊' :
                      emotion === 'sadness' ? '😢' :
                      emotion === 'anger' ? '😠' :
                      emotion === 'fear' ? '😨' :
                      emotion === 'surprise' ? '😲' :
                      emotion === 'disgust' ? '🤢' :
                      emotion === 'contempt' ? '😏' :
                      '😐';
                    
                    return (
                      <div 
                        key={emotion} 
                        className="flex items-center py-2"
                        style={{
                          transition: 'all 0.5s ease-in-out'
                        }}
                      >
                        <span className="text-3xl mr-2" aria-hidden="true">
                          {emotionEmoji}
                        </span>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium" style={{ color: emotionColor }}>
                              {emotionLabel}
                            </span>
                            <span className="text-xs opacity-70">
                              {Math.round(score * 100)}%
                            </span>
                          </div>
                          <div className="w-full h-1 bg-gray-800/30 rounded-full overflow-hidden mt-1">
                            <div 
                              className="h-full rounded-full"
                              style={{ 
                                width: `${Math.max(5, Math.round(score * 100))}%`,
                                backgroundColor: emotionColor,
                                boxShadow: `0 0 8px ${emotionColor}`,
                                transition: 'width 0.8s ease-in-out, background-color 0.8s ease-in-out'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm opacity-60">No emotions detected yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Add animation keyframes */}
      <style jsx global>{`
        @keyframes floatEmoji {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.1;
          }
          50% {
            transform: translateY(-100px) rotate(10deg);
            opacity: 0.2;
          }
          90% {
            opacity: 0.1;
          }
          100% {
            transform: translateY(-200px) rotate(0deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
