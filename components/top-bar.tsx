"use client"
import { useEffect, useState } from "react"

export function TopBar() {
  const [isVisible, setIsVisible] = useState(true)
  const [countdown, setCountdown] = useState("00 days 00:00:00")

  // Set countdown target date
  const targetDate = new Date("2025-07-25T00:00:00")

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance <= 0) {
        clearInterval(interval)
        setCountdown("00 days 00:00:00")
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setCountdown(
        `${String(days).padStart(2, "0")} days ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white py-2 px-4 text-sm relative overflow-hidden">
      {/* Static layout for tablets and up */}
      <div className="hidden sm:flex items-center justify-center gap-3 text-center">
        <span className="font-medium">Today deal sale off 70%</span>
        <span className="opacity-80">End in</span>
        <span className="font-bold">{countdown}</span>
        <span className="opacity-80">Hurry Up</span>
        <span>→</span>
      </div>

      {/* Scrolling ticker on mobile */}
      <div className="sm:hidden">
        <div className="whitespace-nowrap animate-marquee inline-block font-medium">
          <span className="mr-8">
            Today deal sale off 70% • End in {countdown} • Hurry Up →
          </span>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 transform hover:bg-white/20 rounded p-1 transition-colors"
      >
        <span className="text-xs">close</span>
      </button>

      {/* Marquee Animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 8s linear infinite;
        }
      `}</style>
    </div>
  )
}
