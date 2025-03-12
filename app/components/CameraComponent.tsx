'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { analyzeEmotions } from '../lib/humeApi'

// Debug constants
const DEBUG_OVERLAY = true; // Set to true to enable mock emotions for overlay testing
const DEBUG_LOGS = true; // Set to true to enable console logs

interface CameraComponentProps {
  setEmotions: (emotions: Record<string, number>) => void
}

const CameraComponent = ({ setEmotions }: CameraComponentProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  
  const [isRecording, setIsRecording] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 })
  const [error, setError] = useState<string | null>(null)
  const [analysisInterval, setAnalysisInterval] = useState<NodeJS.Timeout | null>(null)
  const [localEmotions, setLocalEmotions] = useState<Record<string, number>>({})
  const [debugInfo, setDebugInfo] = useState<string>('')

  // Wait for video to be fully loaded before trying to analyze
  useEffect(() => {
    const checkVideoReady = () => {
      if (videoRef.current && 
          videoRef.current.readyState >= 2 && 
          videoRef.current.videoWidth > 0 && 
          videoRef.current.videoHeight > 0) {
        
        setVideoSize({
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight
        })
        
        setVideoLoaded(true)
        setDebugInfo(`Video ready: ${videoRef.current.videoWidth}x${videoRef.current.videoHeight}`)
      }
    }
    
    // Check immediately and then set an interval to keep checking
    checkVideoReady()
    const interval = setInterval(checkVideoReady, 500)
    
    return () => clearInterval(interval)
  }, [cameraActive])

  // Start camera and microphone
  const handleStartCamera = async () => {
    console.log("START CAMERA BUTTON CLICKED");
    
    if (cameraActive) {
      console.log("Camera already active, ignoring redundant click");
      return; // Already active, prevent double initialization
    }

    try {
      setCameraActive(true);
      setError('');
      console.log("Attempting to access camera...");
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      
      console.log("Camera access granted, setting up video stream");
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log("Video source set to stream");
        
        // Force a ready check after a short delay
        setTimeout(checkVideoReady, 500);
      } else {
        console.error("Video ref is null, cannot set stream");
        setError('Video element not available');
        setCameraActive(false);
      }
    } catch (err) {
      console.error("Camera start error:", err);
      setError('Could not access camera: ' + (err instanceof Error ? err.message : String(err)));
      setCameraActive(false);
    }
  };

  // Check if video is ready to play
  const checkVideoReady = () => {
    console.log("Checking video ready status...");
    if (videoRef.current) {
      const video = videoRef.current;
      
      // Check if video metadata is loaded
      if (video.readyState >= 2) {
        console.log("Video is ready, dimensions:", video.videoWidth, "x", video.videoHeight);
        setVideoSize({
          width: video.videoWidth,
          height: video.videoHeight
        });
        setVideoLoaded(true);
      } else {
        console.log("Video not ready yet, readyState =", video.readyState);
        // Try again after a short delay
        setTimeout(checkVideoReady, 500);
      }
    } else {
      console.error("Video ref is null during ready check");
    }
  };
  
  // Video event handlers
  const handleVideoPlay = () => {
    console.log("Video play event triggered");
    
    if (videoRef.current) {
      const video = videoRef.current;
      
      // Update video dimensions
      console.log("Video dimensions:", video.videoWidth, "x", video.videoHeight);
      setVideoSize({
        width: video.videoWidth,
        height: video.videoHeight
      });
      
      // Mark as loaded
      setVideoLoaded(true);
      
      // Set some mock emotions to debug the overlay
      if (DEBUG_OVERLAY) {
        console.log("Setting debug mock emotions for overlay testing");
        const mockEmotions = {
          joy: 0.7,
          sadness: 0.3,
          anger: 0.5,
          fear: 0.2,
          surprise: 0.4,
          disgust: 0.1,
          contempt: 0.2,
          neutral: 0.1
        };
        setLocalEmotions(mockEmotions);
      }
    }
  }
  
  const handleVideoError = (e: any) => {
    setError('Error loading video stream')
    setDebugInfo(`Video error: ${e.target.error?.message || 'Unknown error'}`)
    setCameraActive(false)
  }

  // Stop camera and microphone
  const handleStopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      setDebugInfo('Stopping camera and microphone')
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
      setCameraActive(false)
      setVideoLoaded(false)
      setVideoSize({ width: 0, height: 0 })
      
      if (isRecording) {
        handleStopRecording()
      }
    }
  }

  // Start recording and emotion analysis
  const handleStartRecording = () => {
    if (!videoRef.current || !videoRef.current.srcObject) {
      setDebugInfo('Cannot start recording: video stream not available')
      return
    }
    
    if (!videoLoaded) {
      setDebugInfo('Video not fully loaded yet, please wait...')
      return
    }
    
    setDebugInfo('Starting recording and emotion analysis')
    const stream = videoRef.current.srcObject as MediaStream
    mediaRecorderRef.current = new MediaRecorder(stream)
    audioChunksRef.current = []
    
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data)
      }
    }
    
    mediaRecorderRef.current.start(1000) // Collect data every second
    setIsRecording(true)
    
    // Set up interval for capturing and analyzing frames
    const interval = setInterval(captureAndAnalyze, 3000) // Analyze every 3 seconds
    setAnalysisInterval(interval)
    
    // Immediately capture and analyze the first frame
    captureAndAnalyze()
    
    // Also show mock emotions immediately to verify the overlay is working
    const mockEmotions = {
      joy: 0.4,
      sadness: 0.2,
      anger: 0.1,
      fear: 0.05,
      surprise: 0.15,
      disgust: 0.05,
      contempt: 0.03,
      neutral: 0.02
    };
    
    setEmotions(mockEmotions);
    setLocalEmotions(mockEmotions);
    setDebugInfo('Using mock emotions to initialize display');
  }

  // Stop recording and emotion analysis
  const handleStopRecording = () => {
    setDebugInfo('Stopping recording and emotion analysis')
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    
    setIsRecording(false)
    
    // Clear analysis interval
    if (analysisInterval) {
      clearInterval(analysisInterval)
      setAnalysisInterval(null)
    }
  }

  // Capture frame and audio, then analyze emotions
  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) {
      setDebugInfo('Cannot analyze: video or canvas not available')
      return
    }
    
    if (!videoLoaded) {
      setDebugInfo('Video dimensions not available yet, waiting...')
      return
    }
    
    try {
      setDebugInfo('Capturing video frame and audio for analysis')
      // Capture video frame
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      if (!context) {
        setDebugInfo('Cannot analyze: canvas context not available')
        return
      }
      
      // Set canvas dimensions to match video
      canvas.width = videoSize.width
      canvas.height = videoSize.height
      
      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // Get image data as blob with error handling
      try {
        canvas.toBlob(async (imageBlob) => {
          if (!imageBlob) {
            setDebugInfo('Cannot analyze: failed to create image blob')
            return
          }
          
          setDebugInfo(`Image captured (${imageBlob.size} bytes), preparing audio data`)
          
          // Get audio data
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
          
          // Reset audio chunks for next capture
          audioChunksRef.current = []
          
          setDebugInfo(`Sending data to Hume.ai API (image: ${imageBlob.size} bytes, audio: ${audioBlob.size} bytes)`)
          
          try {
            // Analyze emotions using Hume API
            const emotionResults = await analyzeEmotions(imageBlob, audioBlob)
            
            setDebugInfo(`Received emotion results: ${JSON.stringify(emotionResults)}`)
            
            // Check if we got any emotions back
            const hasEmotions = Object.values(emotionResults).some(value => value > 0)
            
            if (hasEmotions) {
              setEmotions(emotionResults)
              setLocalEmotions(emotionResults)
            } else {
              setDebugInfo('No emotions detected in the response')
            }
          } catch (err) {
            setDebugInfo(`Error analyzing emotions: ${err instanceof Error ? err.message : String(err)}`)
            console.error('Error analyzing emotions:', err)
          }
        }, 'image/jpeg', 0.8)
      } catch (blobError) {
        setDebugInfo(`Error creating blob: ${blobError instanceof Error ? blobError.message : String(blobError)}`)
        
        // Use mock emotions when blob creation fails
        const mockEmotions = {
          joy: 0,
          sadness: 0,
          anger: 0,
          fear: 0,
          surprise: 0,
          disgust: 0,
          contempt: 0,
          neutral: 0
        };
        
        setEmotions(mockEmotions);
        setLocalEmotions(mockEmotions);
        setDebugInfo('Using mock emotions due to blob creation error');
      }
    } catch (err) {
      setDebugInfo(`Error during capture: ${err instanceof Error ? err.message : String(err)}`)
      console.error('Error during capture:', err)
    }
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      handleStopCamera()
      if (analysisInterval) {
        clearInterval(analysisInterval)
      }
    }
  }, [analysisInterval])

  // Format emotion percentage for display
  const formatPercentage = (value: number) => {
    return `${Math.round(value * 100)}%`;
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-start md:gap-6">
        {/* Ultra minimalist video container */}
        <div 
          className="relative mb-6 md:mb-0 mx-auto" 
          style={{ 
            width: '100%',
            aspectRatio: '1/1',
            maxWidth: '1000px',
            margin: '0 auto'
          }}
        >
          {/* Main container with fluid dimensions */}
          <div 
            ref={containerRef}
            className="relative w-full h-full rounded-full overflow-hidden mx-auto"
            style={{
              background: 'radial-gradient(circle, rgba(5,5,20,0.7) 0%, rgba(0,0,0,0.9) 100%)',
              boxShadow: '0 25px 50px -12px rgba(0, 255, 255, 0.5)',
              border: '11px solid rgba(255, 255, 255, 0.7)', // Added 11px border
              minWidth: '420px'
            }}
          >
            {/* Video element */}
            <video 
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ borderRadius: '50%' }}
              autoPlay
              playsInline
              muted
              onPlay={handleVideoPlay}
              onError={handleVideoError}
            />
            
            {/* Primary Emotion Display Component - Main overlay */}
            {videoLoaded && (
              <></>
            )}
          </div>
          
          {/* Hidden canvas for capturing frames */}
          <canvas ref={canvasRef} className="hidden" width={videoSize.width || 640} height={videoSize.height || 480} />
        </div>
        
        {/* Sleek, modern camera controls */}
        <div className="flex flex-col gap-4 items-center w-full mx-auto">
          <div className="flex gap-4 justify-center mb-2 w-full">
            {!cameraActive ? (
              <button
                onClick={handleStartCamera}
                className="btn btn-primary text-base flex items-center"
                aria-label="Start camera"
                tabIndex={0}
              >
                <span className="mr-2">●</span> Initialize
              </button>
            ) : (
              <>
                <button
                  onClick={handleStopCamera}
                  className="btn btn-danger text-base flex items-center"
                  aria-label="Stop camera"
                  tabIndex={0}
                >
                  <span className="mr-4">💀</span> Hard Reset
                </button>
                
                {!isRecording ? (
                  <button
                    onClick={handleStartRecording}
                    className="btn btn-success text-base flex items-center"
                    aria-label="Start analysis"
                    tabIndex={0}
                    disabled={!videoLoaded}
                  >
                    <span className="mr-2">⚡</span> Activate AuraAurora
                  </button>
                ) : (
                  <button
                    onClick={handleStopRecording}
                    className="btn btn-warning text-base flex items-center"
                    aria-label="Stop analysis"
                    tabIndex={0}
                  >
                    <span className="mr-2"></span>■ Deactivate
                  </button>
                )}
              </>
            )}
          </div>
          
          {/* Moved status indicator below the buttons */}
          {cameraActive && (
            <div className="mt-2 mb-4">
              <span className={`text-sm font-medium px-4 py-1.5 rounded-full backdrop-blur-xl ${
                videoLoaded ? 'bg-emerald-500/30 text-emerald-50' : 
                'bg-amber-500/30 text-amber-50'
              }`}>
                {videoLoaded ? '✨' : '🌀'}
              </span>
            </div>
          )}
        </div>
        
        {/* Clean error message */}
        {error && (
          <div className="mt-4 p-4 glass text-white text-center w-full">
            <span className="text-xl">⚠️</span>
            <p className="text-sm mt-2 text-red-300">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CameraComponent 