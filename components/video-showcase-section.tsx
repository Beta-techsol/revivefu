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

    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("timeupdate", handleTimeUpdate)

    // Ensure video loads and plays with priority
    video.load()

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("timeupdate", handleTimeUpdate)
    }
  }, [])

  return (
    <section className="relative w-full h-screen overflow-hidden">
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
          line-height: 1;
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
            background-position: 200% 50%;
            transform: scale(1);
          }
          75% {
            background-position: 100% 50%;
            transform: scale(1.02);
          }
        }

        /* Mirror reflection effect */
        .glass-text::before {
          content: 'Crafted';
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.2) 0%,
            rgba(255, 255, 255, 0.1) 25%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 255, 255, 0.1) 75%,
            rgba(255, 255, 255, 0.2) 100%
          );
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          transform: scaleY(-1);
          opacity: 0.3;
          filter: blur(1px);
          mask: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
          -webkit-mask: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
        }

        /* Responsive font sizes */
        @media (max-width: 1024px) {
          .glass-text {
            font-size: 100px;
          }
        }

        @media (max-width: 768px) {
          .glass-text {
            font-size: 80px;
          }
        }

        @media (max-width: 640px) {
          .glass-text {
            font-size: 60px;
          }
        }

        @media (max-width: 480px) {
          .glass-text {
            font-size: 48px;
          }
        }
      `}</style>

      {/* Full-width video background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            filter: "brightness(0.7) contrast(1.1)",
          }}
        >
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/showcase-3Dw3r3hPJJzrxhprWa2s7SsgXni7BO.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Centered glass text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative text-center">
          <h1 className="glass-text select-none">Crafted</h1>
        </div>
      </div>

      {/* Loading indicator */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <p className="text-white/70 text-lg">Loading showcase...</p>
          </div>
        </div>
      )}

      {/* Subtle gradient borders */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
    </section>
  )
}
