"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export function ScrollNavigation() {
  const [isVisible, setIsVisible] = useState(false)
  const [isScrollingUp, setIsScrollingUp] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Show button when user has scrolled more than 300px
      setIsVisible(currentScrollY > 300)

      // Determine scroll direction with a small threshold to avoid flickering
      const scrollThreshold = 10
      if (currentScrollY > lastScrollY + scrollThreshold) {
        setIsScrollingUp(false) // Scrolling down
      } else if (currentScrollY < lastScrollY - scrollThreshold) {
        setIsScrollingUp(true) // Scrolling up
      }

      setLastScrollY(currentScrollY)
    }

    // Initial check
    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const handleClick = () => {
    if (isScrollingUp) {
      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    } else {
      // Scroll to bottom
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      })
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50">
      <button
        onClick={handleClick}
        className="group relative w-14 h-14 rounded-full bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#C53D39]/90 hover:to-[#F1BA69]/90 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-110 flex items-center justify-center"
        aria-label={isScrollingUp ? "Scroll to top" : "Scroll to bottom"}
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#C53D39] to-[#F1BA69] opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300"></div>

        {/* Arrow icon */}
        <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
          {isScrollingUp ? (
            <ChevronUp
              className="w-6 h-6 text-white transition-transform duration-300 group-hover:-translate-y-0.5"
              strokeWidth={2.5}
            />
          ) : (
            <ChevronDown
              className="w-6 h-6 text-white transition-transform duration-300 group-hover:translate-y-0.5"
              strokeWidth={2.5}
            />
          )}
        </div>

        {/* Pulse ring animation with gradient border */}
        <div className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 animate-ping">
          <div className="w-full h-full rounded-full bg-gradient-to-r from-[#C53D39] to-[#F1BA69] p-0.5">
            <div className="w-full h-full rounded-full bg-transparent"></div>
          </div>
        </div>

        {/* Inner highlight */}
        <div className="absolute inset-1 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      {/* Tooltip */}
      <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap shadow-lg">
        {isScrollingUp ? "Scroll to top" : "Scroll to bottom"}
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
      </div>
    </div>
  )
}
