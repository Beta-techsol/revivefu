"use client"

import { useState, useRef, useEffect } from "react"
import { Truck, Calendar, Palette, Shield, Headphones, DollarSign, Phone, Mail } from "lucide-react"

export function CommitmentExcellenceSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Add Google Fonts link
  useEffect(() => {
    const link = document.createElement("link")
    link.href = "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap"
    link.rel = "stylesheet"
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  // Intersection Observer for entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: Truck,
      title: "Fast & Reliable Delivery",
      delay: "100ms",
    },
    {
      icon: Calendar,
      title: "Hassle-Free Bookings",
      delay: "200ms",
    },
    {
      icon: Palette,
      title: "Stylish & Functional Designs",
      delay: "300ms",
    },
    {
      icon: Shield,
      title: "100% Secure Payments",
      delay: "400ms",
    },
    {
      icon: Headphones,
      title: "Dedicated Customer Support",
      delay: "500ms",
    },
    {
      icon: DollarSign,
      title: "Best Value for Money",
      delay: "600ms",
    },
  ]

  const customerAvatars = [
    { id: 1, src: "/placeholder-user.jpg", alt: "Customer 1" },
    { id: 2, src: "/placeholder-user.jpg", alt: "Customer 2" },
    { id: 3, src: "/placeholder-user.jpg", alt: "Customer 3" },
    { id: 4, src: "/placeholder-user.jpg", alt: "Customer 4" },
    { id: 5, src: "/placeholder-user.jpg", alt: "Customer 5" },
  ]

  return (
    <section
      ref={sectionRef}
      className={`py-[2%] bg-gradient-to-br from-gray-50 to-white transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ paddingLeft: "5%", paddingRight: "5%" }}
    >
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Image */}
          <div
            className={`relative transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <div className="relative">
              <img
                src="/home2-chair.avif"
                alt="Modern furniture setup with chair, plant, and lamp"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div
            className={`space-y-8 transition-all duration-1000 delay-400 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            {/* Header */}
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-500 tracking-wider uppercase">WHY CHOOSE US</p>
              <h2 className="text-3xl lg:text-4xl font-medium text-gray-900 leading-tight">
                YOUR HOME, OUR COMMITMENT TO{" "}
                <span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500"
                  style={{ fontFamily: "Dancing Script, cursive" }}
                >
                  EXCELLENCE
                </span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                With thousands of satisfied customers, our brand is a trusted name in quality furniture. Our
                thoughtfully designed pieces bring comfort, style, and functionality to every home. Experience the
                difference today!
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div
                    key={index}
                    className={`flex items-center space-x-4 p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 ${
                      isVisible ? "animate-fade-in-up" : "opacity-0"
                    }`}
                    style={{
                      animationDelay: isVisible ? feature.delay : "0ms",
                    }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{feature.title}</h3>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Trust Text Only */}
            <div
              className={`text-center transition-all duration-1000 delay-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <p className="text-lg text-gray-600 font-light" style={{ fontFamily: "Dancing Script, cursive" }}>
                Trusted by Thousands · Loved by Homes
              </p>
            </div>

            {/* Contact Information */}
            <div
              className={`bg-gray-100 rounded-xl p-6 transition-all duration-1000 delay-900 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Call Us Now</p>
                      <p className="text-gray-700 font-medium">(+92)-306-6203252
</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">revivefurniture01@gmail.com </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  )
}
