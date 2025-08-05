"use client"

import { useEffect, useRef, useState } from "react"

export function VideoShowcaseSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedData = () => {
      setIsVideoLoaded(true)
      // Set start time to 2 seconds to skip first 2 seconds
      video.currentTime = 2
      video.play().catch(console.error)
    }

    const handleTimeUpdate = () => {
      // Skip last 8 seconds - stop video 8 seconds before end
      if (video.duration && video.currentTime >= video.duration - 8) {
        video.currentTime = 2 // Loop back to start (after skipping first 2 seconds)
      }
    }

    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('timeupdate', handleTimeUpdate)

    // Ensure video loads and plays with priority
    video.load()

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [])

  return (
    <section className="relative w-full h-h-[70vh] overflow-hidden">
      {/* Add custom styles for glass/mirror text effect */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700;800&display=swap');
        
        .glass-text {
          font-family: 'Dancing Script', cursive;
          font-size: 120px;
          font-weight: 700;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.7) 25%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0.7) 75%,
            rgba(255, 255, 255, 0.9) 100%
          );
          background-size: 200% 200%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 
            0 0 20px rgba(255, 255, 255, 0.5),
            0 0 40px rgba(255, 255, 255, 0.3),
            0 0 60px rgba(255, 255, 255, 0.2);
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          animation: glass-shimmer 4s ease-in-out infinite;
          letter-spacing: 0.05em;
          line-height: 1.3;
        }

        @keyframes glass-shimmer {
          0%, 100% {
            background-position: 0% 50%;
            transform: scale(1);
          }
          25% {
            background-position: 100% 50%;
            transform: scale(1.02);
          }
          50% {
            background-position:
