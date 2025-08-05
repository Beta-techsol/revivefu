"use client"

import { useEffect, useRef, useState } from "react"

export function VideoShowcaseSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [videoDuration, setVideoDuration] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Force video to load
    video.load()

    const handleLoadedData = () => {
      console.log("Video loaded data")
      setIsVideoLoaded(true)
      const duration = video.duration
      setVideoDuration(duration)
      // Start video at 2 seconds
      video.currentTime = 2
      // Ensure autoplay
      video.play().catch(console.error)
    }

    const handleCanPlayThrough = () => {
      console.log("Video can play through")
      setIsVideoLoaded(true)
      // Start video at 2 seconds
      video.currentTime = 2
      // Ensure autoplay
      video.play().catch(console.error)
    }

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime
      const duration = videoDuration || video.duration

      // If video reaches the point where 8 seconds are left, loop back to 2 seconds
      if (duration && currentTime >= duration - 8) {
        video.currentTime = 2
      }
    }

    const handleLoadStart = () => {
      console.log("Video load started")
    }

    const handleError = (e) => {
      console.error("Video error:", e)
      setIsVideoLoaded(true) // Remove loading screen even on error
    }

    // Add event listeners
    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("canplaythrough", handleCanPlayThrough)
    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("loadstart", handleLoadStart)
    video.addEventListener("error", handleError)

    // Cleanup
    return () => {
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("canplaythrough", handleCanPlayThrough)
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("loadstart", handleLoadStart)
      video.removeEventListener("error", handleError)
    }
  }, [videoDuration])

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Add Dancing Script font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
        
        .dancing-font {
          font-family: 'Dancing Script', cursive;
        }

        /* Glass/Mirror effect for text */
        .glass-text {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.7) 25%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0.7) 75%,
            rgba(255, 255, 255, 0.9) 100%
          );
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 
            0 0 20px rgba(255, 255, 255, 0.5),
            0 0 40px rgba(255, 255, 255, 0.3),
            0 0 60px rgba(255, 255, 255, 0.2);
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }

        /* Shimmer animation for glass effect */
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .shimmer-text {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.6) 0%,
            rgba(255, 255, 255, 1) 50%,
            rgba(255, 255, 255, 0.6) 100%
          );
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s ease-in-out infinite;
        }

        /* Fade in animation for video */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .video-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>

      {/* Full-screen video background */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover ${isVideoLoaded ? "video-fade-in" : "opacity-0"}`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        crossOrigin="anonymous"
      >
        <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Modern%20Furniture%20Showcase%20%203D%20Animation%20for%20Interior%20Design%20-%20NoTriangle%20Studio%20%281080p%2C%20h264%29-ZSBVobrLdQJvZ5JC4temDjFf7C8p19.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Fallback background image while video loads */}
      {!isVideoLoaded && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
          }}
        />
      )}

      {/* Centered text only */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center">
          <h1
            className="dancing-font glass-text shimmer-text"
            style={{
              fontSize: "120px",
              lineHeight: "1.1",
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            Crafted
          </h1>
        </div>
      </div>

      {/* Minimal loading indicator */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
          </div>
        </div>
      )}
    </section>
  )
}
