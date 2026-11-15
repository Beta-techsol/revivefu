"use client"

import { useState, useRef, useEffect } from "react"
import { Instagram } from "lucide-react"

export function InstagramFollow() {
  const [isInView, setIsInView] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
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
  }, [])

  const handleInstagramClick = () => {
    window.open("https://www.instagram.com/revivefurniturepk/?hl=en", "_blank", "noopener,noreferrer")
  }

  return (
    <section
      ref={sectionRef}
      className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
    >
      {/* Background Decorative Elements - Hide some on mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-12 sm:w-16 lg:w-24 h-12 sm:h-16 lg:h-24 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div className="hidden sm:block absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full opacity-20 animate-bounce"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-8 sm:mb-10 lg:mb-12 px-4 transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Stay{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
              Connected
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Follow us on Instagram for the latest furniture collections, design inspiration, and exclusive
            behind-the-scenes content
          </p>
        </div>

        {/* Instagram Follow Button - Responsive */}
        <div className="flex justify-center px-4">
          <div
            className={`transition-all duration-1000 delay-300 ${
              isInView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
            }`}
          >
            <div className="relative flex items-center">
              {/* Instagram Icon Container - Responsive sizing */}
              <div
                className={`relative flex items-center justify-center w-16 sm:w-20 lg:w-[120px] h-16 sm:h-20 lg:h-[120px] rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 z-10 transition-all duration-300 ${
                  isHovered ? "scale-110 shadow-lg" : "hover:scale-105"
                }`}
              >
                <Instagram className="w-8 sm:w-10 lg:w-[65px] h-8 sm:h-10 lg:h-[65px] text-white" />

                {/* Animated Ring */}
                <div
                  className={`absolute inset-0 rounded-full border-2 border-white opacity-0 transition-all duration-300 ${
                    isHovered ? "opacity-100 scale-125" : ""
                  }`}
                ></div>
              </div>

              {/* Button Container - Responsive sizing */}
              <button
                onClick={handleInstagramClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`group relative flex items-center min-w-[280px] sm:min-w-[350px] lg:min-w-[450px] max-w-[320px] sm:max-w-[400px] lg:max-w-[550px] h-12 sm:h-16 lg:h-[90px] bg-white border-2 border-gray-300 rounded-full shadow-lg transition-all duration-300 overflow-hidden -ml-8 sm:-ml-10 lg:-ml-[60px] pl-10 sm:pl-12 lg:pl-[80px] ${
                  isHovered
                    ? "shadow-2xl border-gray-400 -translate-y-1 scale-105"
                    : "hover:shadow-xl hover:border-gray-400"
                }`}
              >
                {/* Subtle Background Gradient on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 opacity-0 transition-opacity duration-300 ${isHovered ? "opacity-100" : ""}`}
                ></div>

                {/* Follow Text - Responsive sizing */}
                <div className="flex-1 flex items-center justify-center pr-2 sm:pr-3 lg:pr-4">
                  <span
                    className={`text-sm sm:text-lg lg:text-2xl font-normal text-gray-900 transition-all duration-300 ${
                      isHovered ? "text-gray-700 scale-105" : "group-hover:text-gray-700"
                    }`}
                  >
                    <span className="hidden sm:inline">Follow us for updates</span>
                    <span className="sm:hidden">Follow us</span>
                  </span>
                </div>

                {/* Subtle Shine Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 -skew-x-12 transition-all duration-700 ${
                    isHovered ? "opacity-20 translate-x-full" : "-translate-x-full"
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info - Responsive */}
        <div
          className={`text-center mt-6 sm:mt-8 px-4 transition-all duration-1000 delay-500 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <span>Daily Updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full"></div>
              <span>Design Inspiration</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"></div>
              <span>Exclusive Content</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
