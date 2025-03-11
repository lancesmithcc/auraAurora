'use client'

import React, { useEffect, useState } from 'react'

// Define emotion mapping with labels for autism support
export const emotionMap = {
  joy: { emoji: '😊', color: '#FFDD00', label: 'Happy' },
  sadness: { emoji: '😢', color: '#0080FF', label: 'Sad' },
  anger: { emoji: '😠', color: '#FF2D00', label: 'Angry' },
  fear: { emoji: '😨', color: '#9900FF', label: 'Afraid' },
  surprise: { emoji: '😲', color: '#00FFFF', label: 'Surprised' },
  disgust: { emoji: '🤢', color: '#00FF80', label: 'Disgusted' },
  contempt: { emoji: '😏', color: '#FF6600', label: 'Contempt' },
  neutral: { emoji: '😐', color: '#AAAAAA', label: 'Neutral' }
}

interface EmotionDisplayProps {
  emotions: Record<string, number>
  overlay?: boolean
}

const EmotionDisplay: React.FC<EmotionDisplayProps> = ({ emotions, overlay = false }) => {
  const [dominantEmotion, setDominantEmotion] = useState<string | null>(null);
  const [dominantColor, setDominantColor] = useState<string>('#FFFFFF');
  const [emotionIntensity, setEmotionIntensity] = useState<number>(0);
  const [renderCount, setRenderCount] = useState<number>(0);
  
  // Effect to handle emotions update and get dominant emotion
  useEffect(() => {
    console.log("EmotionDisplay - emotions updated:", emotions);
    setRenderCount(prev => prev + 1);
    
    // Find dominant emotion
    if (Object.keys(emotions).length > 0) {
      const sortedEmotions = Object.entries(emotions)
        .filter(([_, score]) => score > 0.05)
        .sort(([_, a], [__, b]) => b - a);
      
      if (sortedEmotions.length > 0) {
        const [emotion, intensity] = sortedEmotions[0];
        console.log(`Dominant emotion: ${emotion} (${intensity})`);
        setDominantEmotion(emotion);
        setEmotionIntensity(intensity);
        
        if (emotionMap[emotion as keyof typeof emotionMap]) {
          const { color } = emotionMap[emotion as keyof typeof emotionMap];
          setDominantColor(color);
        }
      }
    }
  }, [emotions]);

  // Generate circles for the aura
  const generateAuraCircles = () => {
    if (!dominantEmotion || Object.keys(emotions).length === 0) {
      return [];
    }

    type AuraCircle = {
      id: string;
      x: string;
      y: string;
      size: string;
      color: string;
      opacity: number;
      animationDelay: string;
    };

    const circles: AuraCircle[] = [];
    const baseCount = 8; // Base number of circles
    
    // Create circles for each emotion with intensity > 0.1
    Object.entries(emotions)
      .filter(([_, score]) => score > 0.1)
      .forEach(([emotion, intensity], emotionIndex) => {
        if (!emotionMap[emotion as keyof typeof emotionMap]) return;
        
        const { color } = emotionMap[emotion as keyof typeof emotionMap];
        const circleCount = Math.max(3, Math.round(intensity * 10)); // More circles for stronger emotions
        
        for (let i = 0; i < circleCount; i++) {
          // Position circles in a spiral pattern
          const angle = (i / circleCount) * Math.PI * 2 + (emotionIndex * Math.PI / 4);
          const distance = 40 + (i * 15) + (intensity * 60);
          
          const x = 50 + Math.cos(angle) * distance;
          const y = 50 + Math.sin(angle) * distance;
          
          // Size based on emotion intensity
          const size = 20 + (intensity * 40) + (Math.random() * 20);
          
          // Add a pulsing animation delay
          const delay = i * 0.2 + emotionIndex * 0.5;
          
          circles.push({
            id: `${emotion}-${i}`,
            x: `${x}%`,
            y: `${y}%`,
            size: `${size}px`,
            color,
            opacity: 0.2 + (intensity * 0.6),
            animationDelay: `${delay}s`
          });
        }
      });
    
    return circles;
  };
  
  // Generate rays emanating from center
  const generateRays = () => {
    if (!dominantEmotion || Object.keys(emotions).length === 0) {
      return [];
    }
    
    type AuraRay = {
      id: string;
      startX: string;
      startY: string;
      endX: string;
      endY: string;
      angle: number;
      color: string;
      width: number;
      opacity: number;
      animationDelay: string;
    };
    
    const rays: AuraRay[] = [];
    const dominantIntensity = emotionIntensity || 0.5;
    const rayCount = Math.max(8, Math.round(dominantIntensity * 24)); // More rays for stronger emotions
    
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      const length = 100 + (Math.random() * 50); // Length as percentage of container
      
      const startX = 50;
      const startY = 50;
      const endX = 50 + Math.cos(angle) * length;
      const endY = 50 + Math.sin(angle) * length;
      
      // Get a semi-random color from the detected emotions
      const emotionsArray = Object.entries(emotions).filter(([_, score]) => score > 0.1);
      const randomEmotionIndex = Math.floor(Math.random() * emotionsArray.length);
      const [randomEmotion] = emotionsArray[randomEmotionIndex] || [dominantEmotion];
      
      const rayColor = emotionMap[randomEmotion as keyof typeof emotionMap]?.color || dominantColor;
      
      rays.push({
        id: `ray-${i}`,
        startX: `${startX}%`,
        startY: `${startY}%`,
        endX: `${endX}%`,
        endY: `${endY}%`,
        angle: Math.atan2(endY - startY, endX - startX),
        color: rayColor,
        width: 5 + (dominantIntensity * 15),
        opacity: 0.3 + (Math.random() * 0.4),
        animationDelay: `${i * 0.1}s`
      });
    }
    
    return rays;
  };

  // Create emoji elements for each detected emotion
  const renderEmojis = () => {
    return Object.entries(emotions)
      .filter(([_, score]) => score > 0.1)
      .map(([emotion, intensity]) => {
        if (!emotionMap[emotion as keyof typeof emotionMap]) return null;
        
        const { emoji, color, label } = emotionMap[emotion as keyof typeof emotionMap];
        const count = Math.min(8, Math.max(1, Math.round(intensity * 12))); // More emojis for stronger emotions
        
        // Create multiple instances of the same emoji
        return Array.from({ length: count }).map((_, i) => {
          // Random position, with stronger emotions more centered
          const angle = (i / count) * Math.PI * 2;
          const distance = 30 + (1 - intensity) * 25 + (Math.random() * 15);
          
          const x = 50 + Math.cos(angle) * distance;
          const y = 50 + Math.sin(angle) * distance;
          
          // Size based on emotion intensity
          const size = 20 + (intensity * 30);
          
          return (
            <div
              key={`emoji-${emotion}-${i}`}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-pulse"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                zIndex: 9500,
                animationDuration: `${1.5 + Math.random()}s`,
                animationDelay: `${i * 0.2}s`,
                filter: `drop-shadow(0 0 10px ${color})`
              }}
            >
              <div 
                className="text-4xl"
                style={{ fontSize: `${size}px` }}
              >
                {emoji}
              </div>
              <div 
                className="mt-1 text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ 
                  backgroundColor: color,
                  color: '#000',
                  opacity: 0.9
                }}
              >
                {label}
              </div>
            </div>
          );
        });
      }).flat().filter(Boolean);
  };

  const auraCircles = generateAuraCircles();
  const rays = generateRays();
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1000 }}>
      {/* Base glow effect */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{ 
          background: dominantEmotion 
            ? `radial-gradient(circle, ${dominantColor}80 0%, ${dominantColor}40 30%, ${dominantColor}20 60%, transparent 80%)`
            : 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
          opacity: emotions && Object.keys(emotions).length > 0 ? 0.9 : 0.3,
          mixBlendMode: 'screen',
          zIndex: 1010,
        }}
      />
      
      {/* Aura circles */}
      {auraCircles.map(circle => (
        <div
          key={circle.id}
          className="absolute rounded-full animate-pulse"
          style={{
            left: circle.x,
            top: circle.y,
            width: circle.size,
            height: circle.size,
            background: `radial-gradient(circle, ${circle.color}cc 0%, ${circle.color}66 60%, transparent 100%)`,
            opacity: circle.opacity,
            transform: 'translate(-50%, -50%)',
            animation: 'pulse 2s infinite',
            animationDelay: circle.animationDelay,
            zIndex: 1020,
            boxShadow: `0 0 20px 5px ${circle.color}80`,
            mixBlendMode: 'screen',
          }}
        />
      ))}
      
      {/* Aura rays */}
      {rays.map(ray => {
        const length = Math.hypot(
          parseFloat(ray.endX) - parseFloat(ray.startX), 
          parseFloat(ray.endY) - parseFloat(ray.startY)
        );
        
        return (
          <div
            key={ray.id}
            className="absolute"
            style={{
              left: ray.startX,
              top: ray.startY,
              width: `${length}%`,
              height: `${ray.width}px`,
              background: `linear-gradient(90deg, transparent 0%, ${ray.color}cc 50%, transparent 100%)`,
              opacity: ray.opacity,
              transform: `rotate(${ray.angle}rad) translateX(0)`,
              transformOrigin: 'left center',
              zIndex: 1015,
              mixBlendMode: 'screen',
              animationDelay: ray.animationDelay,
              animation: 'pulse 3s infinite',
            }}
          />
        );
      })}
      
      {/* Emotion emojis */}
      {renderEmojis()}
      
      {/* Debug indicator - appears clearly on all backgrounds */}
      <div 
        className="absolute bottom-4 right-4 bg-black/80 text-white text-xs py-1 px-2 rounded"
        style={{ zIndex: 9999 }}
      >
        Render #{renderCount} | Emotions: {Object.keys(emotions).length}
        {dominantEmotion && (
          <span> | Main: {dominantEmotion} ({Math.round(emotionIntensity * 100)}%)</span>
        )}
      </div>
    </div>
  );
};

export default EmotionDisplay; 