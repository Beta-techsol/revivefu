"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function OurClients() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [screenSize, setScreenSize] = useState("desktop")

  const clients = [
    {
      name: "Community World Service Asia",
      logo: "/clients/community-world-service.webp",
    },
    {
      name: "Ingenious Zone",
      logo: "/clients/ingenious-zone.webp",
    },
    {
      name: "Meezan Bank",
      logo: "/clients/meezan-bank.webp",
    },
    {
      name: "Forrun Office",
      logo: "/clients/forrun-office.webp",
    },
    {
      name: "Eastern Scientific Corporation",
      logo: "/clients/eastern-scientific.jpeg",
    },
    {
      name: "Construction Company",
      logo: "/clients/construction-logo.gif",
    },
    {
      name: "Lambda Logics",
      logo: "/clients/lambda-logics.webp",
    },
    {
      name: "Cowo",
      logo: "/clients/cowo-logo.webp",
    },
  ]

  const clientsPerView = {
    mobile: 2,
    tablet: 3,
    desktop: 4,
  }

  useEffect(() => {
    const updateScreenSize = () => {
      if (window.innerWidth < 640) {
        setScreenSize("mobile")
      } else if (window.innerWidth < 1024) {
        setScreenSize("tablet")
      } else {
        setScreenSize("desktop")
      }
    }

    updateScreenSize()
    window.addEventListener("resize", updateScreenSize)
    return () => window.removeEventListener("resize", updateScreenSize)
  }, [])

  const getCurrentClientsPerView = () => {
    switch (screenSize) {
      case "mobile":
        return clientsPerView.mobile
      case "tablet":
        return clientsPerView.tablet
      default:
        return clientsPerView.desktop
    }
  }

  const totalSlides = Math.ceil(clients.length / getCurrentClientsPerView())

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

  useEffect(() => {
    const startAutoPlay = () => {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides)
      }, 4000)
    }

    const stopAutoPlay = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    if (isInView) {
      startAutoPlay()
    } else {
      stopAutoPlay()
    }

    return () => stopAutoPlay()
  }, [isInView, totalSlides])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const handleMouseEnter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleMouseLeave = () => {
    if (isInView) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides)
      }, 4000)
    }
  }

  return (
    <section ref={sectionRef} className="py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C53D39] to-[#F1BA69]">Trusted</span>{" "}
            Clients
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're proud to work with leading companies and organizations who trust us with their furniture needs
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className={`relative transition-all duration-1000 delay-300 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md hover:bg-gradient-to-r hover:from-[#C53D39] hover:to-[#F1BA69] hover:text-white hover:border-transparent transition-all duration-300 flex items-center justify-center group"
            aria-label="Previous clients"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md hover:bg-gradient-to-r hover:from-[#C53D39] hover:to-[#F1BA69] hover:text-white hover:border-transparent transition-all duration-300 flex items-center justify-center group"
            aria-label="Next clients"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
          </button>

          {/* Clients Grid */}
          <div className="overflow-hidden mx-12">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-4">
                    {clients
                      .slice(slideIndex * getCurrentClientsPerView(), (slideIndex + 1) * getCurrentClientsPerView())
                      .map((client, index) => (
                        <div
                          key={`${slideIndex}-${index}`}
                          className="group flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6 transition-all duration-300 hover:-translate-y-2 hover:scale-110"
                        >
                          <div className="relative w-full h-12 sm:h-14 lg:h-16 flex items-center justify-center">
                            <img
                              src={client.logo || "/placeholder.svg"}
                              alt={client.name}
                              className="max-w-full max-h-full object-contain transition-all duration-300"
                            />
                          </div>
                          <div className="mt-2 sm:mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-xs text-gray-600 text-center font-medium">{client.name}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
