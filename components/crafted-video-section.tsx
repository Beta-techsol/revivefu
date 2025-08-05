"use client"

import { useState, useRef, useEffect } from "react"

export function CraftedVideoSection() {
  const [isInView, setIsInView] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
        if (entry.isIntersecting && videoRef.current && isVideoLoaded) {
          // Start video from 7 seconds
          videoRef.current.currentTime = 7
          videoRef.current.play().catch(console.error)
        }
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -10% 0px",
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [isVideoLoaded])

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true)
    if (videoRef.current) {
      // Set initial time to 7 seconds
      videoRef.current.currentTime = 7
    }
  }

  const handleVideoTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime < 7) {
      videoRef.current.currentTime = 7
    }
  }

  return (
    <>
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
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.3) 25%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.3) 75%,
            rgba(255, 255, 255, 0.1) 100%
          );
          background-size: 200% 200%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 
            0 0 20px rgba(255, 255, 255, 0.3),
            0 0 40px rgba(255, 255, 255, 0.2),
            0 0 60px rgba(255, 255, 255, 0.1);
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.2));
          animation: glass-shimmer 4s ease-in-out infinite;
        }

        @keyframes glass-shimmer {
          0%, 100% {
            background-position: 0% 50%;
            opacity: 0.6;
          }
          50% {
            background-position: 100% 50%;
            opacity: 0.8;
          }
        }

        /* Text entrance animation */
        .text-entrance {
          animation: textEntrance 2s ease-out forwards;
        }

        @keyframes textEntrance {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
            filter: blur(10px);
          }
          50% {
            opacity: 0.4;
            transform: translateY(15px) scale(0.95);
            filter: blur(5px);
          }
          100% {
            opacity: 0.7;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }
      `}</style>

      <section ref={sectionRef} className="relative w-full h-screen overflow-hidden" style={{ margin: 0, padding: 0 }}>
        {/* Full-screen video background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={handleVideoLoaded}
            onTimeUpdate={handleVideoTimeUpdate}
            style={{
              width: "100vw",
              height: "100vh",
              objectFit: "cover",
            }}
          >
            <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Target%20Furniture%20-%20Chairs%20TV%20advert%20%20VideoTaxi%20-%20Video%20Taxi%20%28720p%2C%20h264%29-WKmZ6ZN390fIJof8H3Wj5Vxk4X5XhR.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Centered "Crafted" text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h2
            className={`dancing-font glass-text text-[80px] sm:text-[100px] md:text-[120px] lg:text-[140px] xl:text-[160px] font-bold select-none text-center leading-none ${
              isInView ? "text-entrance" : "opacity-0"
            }`}
            style={{
              fontSize: "clamp(60px, 8vw, 160px)",
              letterSpacing: "0.02em",
            }}
          >
            Crafted
          </h2>
        </div>

        {/* Subtle gradient overlay at bottom for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/10 to-transparent"></div>
      </section>
    </>
  )
}
