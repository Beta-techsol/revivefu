"use client"

import { useEffect, useRef, useState } from "react"

export function VideoShowcaseSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [videoDuration, setVideoDuration] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Set video properties for better autoplay compatibility
    video.muted = true
    video.playsInline = true
    video.autoplay = true
    video.loop = false // We'll handle looping manually

    const handleLoadedMetadata = () => {
      console.log("Video metadata loaded")
      const duration = video.duration
      setVideoDuration(duration)
      // Start video at 2 seconds
      if (duration > 2) {
        video.currentTime = 2
      }
    }

    const handleCanPlay = () => {
      console.log("Video can play")
      setIsVideoLoaded(true)
      // Attempt to play the video
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Video started playing")
            setIsVideoPlaying(true)
          })
          .catch((error) => {
            console.error("Video play failed:", error)
            // Try to play again after a short delay
            setTimeout(() => {
              video.play().catch(console.error)
            }, 100)
          })
      }
    }

    const handlePlay = () => {
      console.log("Video is playing")
      setIsVideoPlaying(true)
    }

    const handlePause = () => {
      console.log("Video paused")
      setIsVideoPlaying(false)
    }

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime
      const duration = videoDuration || video.duration

      // If video reaches the point where 8 seconds are left, loop back to 2 seconds
      if (duration && currentTime >= duration - 8) {
        video.currentTime = 2
      }
    }

    const handleError = (e: Event) => {
      console.error("Video error:", e)
      setIsVideoLoaded(true) // Remove loading screen even on error
    }

    const handleLoadStart = () => {
      console.log("Video load started")
    }

    // Add event listeners
    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("canplay", handleCanPlay)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("loadstart", handleLoadStart)
    video.addEventListener("error", handleError)

    // Force load and play
    video.load()

    // Intersection Observer to play video when in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && video.paused) {
            video.play().catch(console.error)
          }
        })
      },
      { threshold: 0.5 },
    )

    observer.observe(video)

    // Cleanup
    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("canplay", handleCanPlay)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("loadstart", handleLoadStart)
      video.removeEventListener("error", handleError)
      observer.disconnect()
    }
  }, [videoDuration])

  // Click handler to ensure video plays on user interaction
  const handleVideoClick = () => {
    const video = videoRef.current
    if (video) {
      if (video.paused) {
        video.play().catch(console.error)
      }
    }
  }

  return (
    <section className="relative w-full h-[70vh] overflow-hidden">
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

        /* Pulse animation for play indicator */
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* Full-screen video background */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover cursor-pointer ${isVideoLoaded ? "video-fade-in" : "opacity-0"}`}
        autoPlay
        muted
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        onClick={handleVideoClick}
        onContextMenu={(e) => e.preventDefault()} // Disable right-click menu
      >
        <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/showcase-jVlh9kOxz3TwONQq7pv0DenjRf4Cyo.mp4" type="video/mp4" />
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
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
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

      {/* Loading indicator */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
            </div>
            <p className="text-white text-sm font-medium">Loading video...</p>
          </div>
        </div>
      )}

      {/* Play indicator when video is not playing */}
      {isVideoLoaded && !isVideoPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center pulse">
            <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
          </div>
        </div>
      )}
    </section>
  )
}
