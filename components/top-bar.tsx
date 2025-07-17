"use client"
import { useState } from "react"

export function TopBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white py-2 px-4 text-sm relative overflow-hidden">
      {/* Desktop and Tablet Layout */}
      <div className="hidden sm:flex items-center justify-center gap-3 text-center">
        <span className="font-medium">Today deal sale off 70%</span>
        <span className="opacity-80">End in</span>
        <span className="font-bold">00 days 00:00:00</span>
        <span className="opacity-80">Hurry Up</span>
        <span>→</span>
      </div>

      {/* Mobile Scrolling Ticker */}
      <div className="sm:hidden whitespace-nowrap animate-marquee">
        <span className="mr-8 font-medium">
          Today deal sale off 70% • End in 00 days 00:00:00 • Hurry Up →
        </span>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 transform hover:bg-white/20 rounded p-1 transition-colors"
      >
        <span className="text-xs">close</span>
      </button>

      {/* Animation Style */}
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
          display: inline-block;
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </div>
  )
}
