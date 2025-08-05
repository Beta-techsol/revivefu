"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function ReviveMapMarker() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible((prev) => !prev)
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <style jsx>{`
        .wave-animation {
          position: absolute;
          border: 2px solid #C53D39;
          border-radius: 50%;
          animation: wave 2s infinite;
        }
        
        .wave-animation:nth-child(1) {
          animation-delay: 0s;
        }
        
        .wave-animation:nth-child(2) {
          animation-delay: 0.5s;
        }
        
        .wave-animation:nth-child(3) {
          animation-delay: 1s;
        }
        
        @keyframes wave {
          0% {
            width: 40px;
            height: 40px;
            opacity: 1;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          100% {
            width: 120px;
            height: 120px;
            opacity: 0;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
        
        .blink-animation {
          animation: blink 1.5s infinite;
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }
      `}</style>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        {/* Wave effects */}
        <div className="wave-animation"></div>
        <div className="wave-animation"></div>
        <div className="wave-animation"></div>

        {/* Logo marker */}
        <div
          className={`relative w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-[#C53D39] ${isVisible ? "blink-animation" : ""}`}
        >
          <Image src="/logo.webp" alt="Revive Furniture" width={32} height={32} className="rounded-full" />
        </div>
      </div>
    </>
  )
}
