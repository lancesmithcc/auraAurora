'use client'

import React, { useEffect, useState, useRef } from 'react'

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
  const [allEmojis, setAllEmojis] = useState<any[]>([]);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  
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
        
        // Generate new emojis based on emotions
        generateEmojisOverTime(emotions);
      }
    }
    
    return () => {
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
      }
    };
  }, [emotions]);
  
  // Generate emojis randomly over time based on emotions
  const generateEmojisOverTime = (emotions: Record<string, number>) => {
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
    }
    
    // Start with initial batch
    const initialEmojis = generateRandomEmojis(emotions, 20);
    setAllEmojis(initialEmojis);
    
    // Add new emojis periodically and remove old ones
    animationTimerRef.current = setInterval(() => {
      setAllEmojis(prevEmojis => {
        // Filter out emojis that have expired
        const currentTime = Date.now();
        const remainingEmojis = prevEmojis.filter(emoji => emoji.expiresAt > currentTime);
        
        // Add new emojis (1-3 at a time)
        const newCount = Math.floor(Math.random() * 3) + 1;
        const newEmojis = generateRandomEmojis(emotions, newCount);
        
        return [...remainingEmojis, ...newEmojis];
      });
    }, 1000); // Add new emojis every second
  };
  
  // Generate a batch of random emojis based on emotion intensities
  const generateRandomEmojis = (emotions: Record<string, number>, count: number) => {
    const newEmojis = [];
    
    // Get total intensity to use for probability
    const totalIntensity = Object.values(emotions).reduce((sum, intensity) => sum + intensity, 0);
    
    for (let i = 0; i < count; i++) {
      // Select an emotion based on its relative intensity
      let randomValue = Math.random() * totalIntensity;
      let selectedEmotion = "";
      let cumulativeIntensity = 0;
      
      // Weighted random selection based on intensity
      for (const [emotion, intensity] of Object.entries(emotions)) {
        cumulativeIntensity += intensity;
        if (randomValue <= cumulativeIntensity) {
          selectedEmotion = emotion;
          break;
        }
      }
      
      // If no emotion was selected (shouldn't happen, but just in case)
      if (!selectedEmotion && Object.keys(emotions).length > 0) {
        selectedEmotion = Object.keys(emotions)[0];
      }
      
      // Get emoji data
      const emotionData = emotionMap[selectedEmotion as keyof typeof emotionMap];
      if (!emotionData) continue;
      
      const { emoji, color } = emotionData;
      const intensity = emotions[selectedEmotion] || 0.1;
      
      // Random position across the entire viewport (0-100%)
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      // Size based on emotion intensity
      const size = 24 + (intensity * 40);
      
      // Random duration for animations (5-10 seconds)
      const duration = 5 + Math.random() * 5;
      
      // Random fade-in time (0.5-2 seconds)
      const fadeInDuration = 0.5 + Math.random() * 1.5;
      
      // Random movement distance (5-15% of screen)
      const moveDistance = 5 + Math.random() * 10;
      
      // Random direction (up, down, left, right with slight variations)
      const direction = Math.floor(Math.random() * 8) * 45; // 0, 45, 90, 135, 180, 225, 270, 315 degrees
      
      // Random rotation (-10 to 10 degrees)
      const rotation = -10 + Math.random() * 20;
      
      // Movement with direction
      const deltaX = Math.cos(direction * Math.PI / 180) * moveDistance;
      const deltaY = Math.sin(direction * Math.PI / 180) * moveDistance;
      
      // Expiration time (now + duration in ms)
      const expiresAt = Date.now() + (duration * 1000);
      
      // Opacity varies with intensity (0.5-1.0)
      const opacity = 0.5 + (intensity * 0.5);
      
      // Create emoji object
      newEmojis.push({
        id: `emoji-${Date.now()}-${i}-${selectedEmotion}`,
        emoji,
        color,
        x,
        y,
        size,
        duration,
        fadeInDuration,
        deltaX,
        deltaY,
        rotation,
        expiresAt,
        opacity,
        intensity,
        emotion: selectedEmotion
      });
    }
    
    return newEmojis;
  };

  // Generate aurora blobs for each emotion
  const generateAuroraBlobs = () => {
    if (Object.keys(emotions).length === 0) {
      return [];
    }

    type AuroraBlob = {
      id: string;
      x: string;
      y: string;
      width: string;
      height: string;
      rotation: number;
      color: string;
      opacity: number;
      animationDuration: string;
      animationDelay: string;
      scale: number;
      borderRadius: string;
      blur: string;
    };

    const blobs: AuroraBlob[] = [];
    
    // Create large aurora blobs for each emotion with intensity > 0.05
    Object.entries(emotions)
      .filter(([_, score]) => score > 0.05)
      .forEach(([emotion, intensity], emotionIndex) => {
        if (!emotionMap[emotion as keyof typeof emotionMap]) return;
        
        const { color } = emotionMap[emotion as keyof typeof emotionMap];
        // Larger blobs that cover more of the screen, adjusted by intensity
        const blobCount = Math.max(2, Math.round(intensity * 5)); 
        
        for (let i = 0; i < blobCount; i++) {
          // Position blobs more centered with some gentle randomness
          const angle = (i / blobCount) * Math.PI * 2 + (emotionIndex * Math.PI / 5);
          // Smaller distance to keep blobs more centered
          const randomOffset = Math.random() * 20 - 10;
          const distance = 25 + (i * 10) + (intensity * 20) + randomOffset;
          
          const x = 50 + Math.cos(angle) * distance;
          const y = 50 + Math.sin(angle) * distance;
          
          // Much larger sizes for more coverage
          const baseSize = 100 + (intensity * 150) + (Math.random() * 60 - 30);
          const width = baseSize * (0.8 + Math.random() * 0.5);
          const height = baseSize * (0.8 + Math.random() * 0.5);
          
          // Slower rotation for more subtle movement
          const rotation = Math.random() * 360;
          
          // Slower animation speeds for more gentle movement
          const animationDuration = 8 + Math.random() * 7 + 's';
          const animationDelay = i * 0.8 + emotionIndex * 0.7 + Math.random() * 3 + 's';
          
          // Higher base opacity but still subtle
          const opacity = 0.15 + (intensity * 0.25) + (Math.random() * 0.1);
          
          // Varied scale
          const scale = 0.9 + Math.random() * 0.3;
          
          // Very soft edges for smooth transitions
          const radius1 = 40 + Math.random() * 40;
          const radius2 = 40 + Math.random() * 40;
          const radius3 = 40 + Math.random() * 40;
          const radius4 = 40 + Math.random() * 40;
          const borderRadius = `${radius1}% ${radius2}% ${radius3}% ${radius4}%`;
          
          // Increased blur for softer edges
          const blur = `${15 + Math.random() * 15}px`;
          
          blobs.push({
            id: `aurora-${emotion}-${i}`,
            x: `${x}%`,
            y: `${y}%`,
            width: `${width}px`,
            height: `${height}px`,
            rotation,
            color,
            opacity,
            animationDuration,
            animationDelay,
            scale,
            borderRadius,
            blur
          });
        }
      });
    
    return blobs;
  };
  
  // Generate base glow effect
  const generateBaseGlow = () => {
    if (Object.keys(emotions).length === 0) {
      return null;
    }
    
    // Find top emotions
    const topEmotions = Object.entries(emotions)
      .filter(([_, score]) => score > 0.1)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 3);
    
    if (topEmotions.length === 0) return null;
    
    // Blend colors from top emotions
    const gradientStops = topEmotions.map(([emotion, intensity], index) => {
      const color = emotionMap[emotion as keyof typeof emotionMap]?.color || '#FFFFFF';
      const position = index === 0 ? '0%' : `${index * 30 + 10}%`;
      return `${color}${Math.round(intensity * 99).toString(16).padStart(2, '0')} ${position}`;
    });
    
    // Add transparent stop at the end
    gradientStops.push('transparent 80%');
    
    return {
      background: `radial-gradient(circle at center, ${gradientStops.join(', ')})`,
      animationDuration: '15s',
      filter: 'blur(30px)',
      opacity: 0.7
    };
  };

  const auroraBlobs = generateAuroraBlobs();
  const baseGlow = generateBaseGlow();
  
  return (
    <>
      {/* Fixed overlay that covers the whole screen - emojis container */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[999]">
        {/* CSS for animations */}
        <style jsx>{`
          @keyframes fadeInOut {
            0% { opacity: 0; }
            15% { opacity: var(--max-opacity, 1); }
            85% { opacity: var(--max-opacity, 1); }
            100% { opacity: 0; }
          }
          
          @keyframes floatMove {
            0% { 
              transform: translate(0, 0) rotate(0deg); 
            }
            100% { 
              transform: translate(var(--move-x, 0), var(--move-y, 0)) rotate(var(--rotation, 0deg)); 
            }
          }
        `}</style>
        
        {/* Floating emojis throughout the viewport */}
        {allEmojis.map(emoji => (
          <div
            key={emoji.id}
            className="absolute"
            style={{
              left: `${emoji.x}%`,
              top: `${emoji.y}%`,
              fontSize: `${emoji.size}px`,
              color: 'white',
              filter: `drop-shadow(0 0 10px ${emoji.color})`,
              opacity: 0,
              animation: `fadeInOut ${emoji.duration}s ease-in-out, floatMove ${emoji.duration}s ease-in-out`,
              animationFillMode: 'forwards',
              '--max-opacity': emoji.opacity,
              '--move-x': `${emoji.deltaX}vw`,
              '--move-y': `${emoji.deltaY}vh`,
              '--rotation': `${emoji.rotation}deg`,
              zIndex: Math.round(emoji.intensity * 100) + 1000
            } as React.CSSProperties}
          >
            {emoji.emoji}
          </div>
        ))}
      </div>
      
      {/* Contained aurora effect over video */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1000 }}>
        {/* CSS for Aurora-style animations */}
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { transform: scale(var(--scale, 1)); opacity: var(--base-opacity, 0.5); }
            50% { transform: scale(calc(var(--scale, 1) * 1.05)); opacity: calc(var(--base-opacity, 0.5) * 1.2); }
          }
          
          @keyframes floatEmoji {
            0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
            50% { transform: translate(-50%, calc(-50% - var(--float-y, 10px))) rotate(var(--float-rotation, 0deg)); }
          }
          
          @keyframes morph {
            0%, 100% { border-radius: var(--border-radius-start, 40% 60% 60% 40%); }
            33% { border-radius: var(--border-radius-mid1, 60% 40% 30% 70%); }
            66% { border-radius: var(--border-radius-mid2, 30% 60% 70% 40%); }
          }
          
          @keyframes rotate {
            from { transform: translate(-50%, -50%) rotate(0deg) scale(var(--scale, 1)); }
            to { transform: translate(-50%, -50%) rotate(360deg) scale(var(--scale, 1)); }
          }
          
          @keyframes glow {
            0%, 100% { opacity: var(--base-opacity, 0.5); filter: hue-rotate(0deg); }
            33% { opacity: calc(var(--base-opacity, 0.5) * 1.3); filter: hue-rotate(10deg); }
            66% { opacity: calc(var(--base-opacity, 0.5) * 1.1); filter: hue-rotate(-10deg); }
          }
        `}</style>
        
        {/* Background blur/glow effect */}
        {baseGlow && (
          <div 
            className="absolute inset-0 rounded-full"
            style={{ 
              background: baseGlow.background,
              opacity: 0.7,
              mixBlendMode: 'screen',
              zIndex: 1001,
              filter: baseGlow.filter,
              animation: 'glow 15s infinite ease-in-out alternate',
              '--base-opacity': '0.7'
            } as React.CSSProperties}
          />
        )}
        
        {/* Aurora blobs - now larger, softer and more amorphous */}
        {auroraBlobs.map(blob => {
          // Create unique border-radius values for morphing animation
          const radius1Start = 40 + Math.random() * 40;
          const radius2Start = 40 + Math.random() * 40;
          const radius3Start = 40 + Math.random() * 40;
          const radius4Start = 40 + Math.random() * 40;
          
          const radius1Mid1 = 40 + Math.random() * 40;
          const radius2Mid1 = 40 + Math.random() * 40;
          const radius3Mid1 = 40 + Math.random() * 40;
          const radius4Mid1 = 40 + Math.random() * 40;
          
          const radius1Mid2 = 40 + Math.random() * 40;
          const radius2Mid2 = 40 + Math.random() * 40;
          const radius3Mid2 = 40 + Math.random() * 40;
          const radius4Mid2 = 40 + Math.random() * 40;
          
          const borderRadiusStart = `${radius1Start}% ${radius2Start}% ${radius3Start}% ${radius4Start}%`;
          const borderRadiusMid1 = `${radius1Mid1}% ${radius2Mid1}% ${radius3Mid1}% ${radius4Mid1}%`;
          const borderRadiusMid2 = `${radius1Mid2}% ${radius2Mid2}% ${radius3Mid2}% ${radius4Mid2}%`;
          
          return (
            <div
              key={blob.id}
              className="absolute"
              style={{
                left: blob.x,
                top: blob.y,
                width: blob.width,
                height: blob.height,
                background: `radial-gradient(circle, ${blob.color}90 20%, ${blob.color}50 60%, transparent 100%)`,
                opacity: blob.opacity,
                mixBlendMode: 'screen',
                position: 'absolute',
                transform: `translate(-50%, -50%) rotate(${blob.rotation}deg) scale(${blob.scale})`,
                animation: 'morph 15s infinite ease-in-out alternate, pulse 8s infinite ease-in-out alternate',
                animationDuration: blob.animationDuration,
                animationDelay: blob.animationDelay,
                zIndex: 1005,
                borderRadius: blob.borderRadius,
                filter: `blur(${blob.blur})`,
                boxShadow: `0 0 30px 10px ${blob.color}30`,
                '--border-radius-start': borderRadiusStart,
                '--border-radius-mid1': borderRadiusMid1,
                '--border-radius-mid2': borderRadiusMid2,
                '--base-opacity': String(blob.opacity),
                '--scale': String(blob.scale)
              } as React.CSSProperties}
            />
          );
        })}
      </div>
    </>
  );
};

export default EmotionDisplay; 