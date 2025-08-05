"use client"

import { useEffect, useRef, useState } from "react"

export default function VideoShowcaseSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedData = () => {
      setIsLoading(false)
      // Set start time to skip first 2 seconds
      video.currentTime = 2
    }

    const handleTimeUpdate = () => {
      // Skip last 8 seconds by looping back to start (2 seconds)
      if (video.duration && video.currentTime >= video.duration - 8) {
        video.currentTime = 2
      }
    }

    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("timeupdate", handleTimeUpdate)

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("timeupdate", handleTimeUpdate)
    }
  }, [])

  return (
    <section className="relative w-full h-[70vh] overflow-hidden">
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        </div>
      )}

      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          filter: "brightness(0.7)",
          objectFit: "cover",
        }}
      >
        <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/showcase-3Dw3r3hPJJzrxhprWa2s7SsgXni7BO.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30 z-20"></div>

      {/* Text Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-30">
        <div className="text-center">
          {/* Main Text with Glass Effect */}
          <h2
            className="relative text-white font-bold leading-none select-none"
            style={{
              fontFamily: "Dancing Script, cursive",
              fontSize: "clamp(60px, 8vw, 120px)",
              textShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
              background:
                "linear-gradient(45deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.9))",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer 3s ease-in-out infinite",
            }}
          >
            Crafted
            {/* Glass Effect Overlay */}
            <span
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.1) 100%)",
                borderRadius: "10px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            />
          </h2>

          {/* Mirror Reflection */}
          <div className="relative mt-2 overflow-hidden" style={{ height: "60px" }}>
            <h2
              className="absolute top-0 text-white font-bold leading-none select-none transform scale-y-[-1] opacity-30"
              style={{
                fontFamily: "Dancing Script, cursive",
                fontSize: "clamp(60px, 8vw, 120px)",
                background:
                  "linear-gradient(45deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3))",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                maskImage: "linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 100%)",
              }}
            >
              Crafted
            </h2>
          </div>
        </div>
      </div>

      {/* Custom CSS for shimmer animation */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </section>
  )
}
