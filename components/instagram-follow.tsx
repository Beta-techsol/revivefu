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
    // Replace with your actual Instagram URL
    window.open("https://www.instagram.com/yourcompany", "_blank")
  }

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full opacity-20 animate-bounce"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Stay{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
              Connected
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Follow us on Instagram for the latest furniture collections, design inspiration, and exclusive
            behind-the-scenes content
          </p>
        </div>

        {/* Instagram Follow Button */}
        <div className="flex justify-center">
          <div
            className={`transition-all duration-1000 delay-300 ${
              isInView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
            }`}
          >
            <div className="relative flex items-center">
              {/* Instagram Icon Container - Perfect Circle 120px */}
              <div
                className={`relative flex items-center justify-center w-[120px] h-[120px] rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 z-10 transition-all duration-300 ${
                  isHovered ? "scale-110 shadow-lg" : "hover:scale-105"
                }`}
              >
                <Instagram className="w-[65px] h-[65px] text-white" />

                {/* Animated Ring */}
                <div
                  className={`absolute inset-0 rounded-full border-2 border-white opacity-0 transition-all duration-300 ${
                    isHovered ? "opacity-100 scale-125" : ""
                  }`}
                ></div>
              </div>

              {/* Button Container - Height 90px */}
              <button
                onClick={handleInstagramClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`group relative flex items-center min-w-[450px] max-w-[550px] h-[90px] bg-white border-2 border-gray-300 rounded-full shadow-lg transition-all duration-300 overflow-hidden -ml-[60px] pl-[80px] ${
                  isHovered
                    ? "shadow-2xl border-gray-400 -translate-y-1 scale-105"
                    : "hover:shadow-xl hover:border-gray-400"
                }`}
              >
                {/* Subtle Background Gradient on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 opacity-0 transition-opacity duration-300 ${isHovered ? "opacity-100" : ""}`}
                ></div>

                {/* Follow Text - Centered in button */}
                <div className="flex-1 flex items-center justify-center pr-4">
                  <span
                    className={`text-2xl font-normal text-gray-900 transition-all duration-300 ${
                      isHovered ? "text-gray-700 scale-105" : "group-hover:text-gray-700"
                    }`}
                  >
                    Follow us for updates
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

        {/* Additional Info */}
        <div
          className={`text-center mt-8 transition-all duration-1000 delay-500 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
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
