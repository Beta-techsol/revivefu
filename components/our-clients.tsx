"use client"

import { useState, useRef, useEffect } from "react"
import { Truck, Shield, DollarSign, Palette, Sofa, Bed, Briefcase, Coffee, Home, Users } from 'lucide-react'

export function OurClients() {
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

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

  const features = [
    {
      icon: Truck,
      title: "Fast & Reliable Delivery",
      description: "Quick and secure delivery to your doorstep"
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Premium materials and craftsmanship guaranteed"
    },
    {
      icon: DollarSign,
      title: "Best Value for Money",
      description: "Competitive prices without compromising quality"
    },
    {
      icon: Palette,
      title: "Stylish & Functional",
      description: "Beautiful designs that enhance your lifestyle"
    }
  ]

  const categories = [
    { icon: Sofa, title: "Living Room", count: "150+ Products" },
    { icon: Bed, title: "Bedroom", count: "120+ Products" },
    { icon: Briefcase, title: "Office", count: "80+ Products" },
    { icon: Coffee, title: "Dining", count: "90+ Products" },
    { icon: Home, title: "Home Decor", count: "200+ Products" },
    { icon: Users, title: "Commercial", count: "60+ Products" }
  ]

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

  // Auto-scroll effect for client logos
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer || !isInView) return

    let scrollAmount = 0
    const scrollStep = 1
    const scrollInterval = setInterval(() => {
      scrollAmount += scrollStep
      scrollContainer.scrollLeft = scrollAmount
      
      // Reset when reaching the end
      if (scrollAmount >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        scrollAmount = 0
      }
    }, 30)

    return () => clearInterval(scrollInterval)
  }, [isInView])

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Trusted Partners Section */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            POWERFUL PARTNERS
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-12">
            OUR TRUSTED PARTNERS
          </h2>

          {/* Auto-scrolling Client Logos */}
          <div className="relative">
            {/* Fade effect on sides */}
            <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
            
            <div 
              ref={scrollRef}
              className="flex gap-8 overflow-x-hidden py-8"
              style={{ scrollBehavior: 'smooth' }}
            >
              {/* Duplicate logos for seamless loop */}
              {[...clients, ...clients].map((client, index) => (
                <div
                  key={`${client.name}-${index}`}
                  className="flex-shrink-0 w-48 h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center p-6 hover:shadow-md transition-shadow duration-300"
                >
                  <img
                    src={client.logo || "/placeholder.svg"}
                    alt={client.name}
                    className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div
          className={`text-center mb-16 transition-all duration-1000 delay-300 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
            WHY CHOOSE US
          </p>
          <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-8 max-w-4xl mx-auto leading-relaxed">
            "At Minicom, we craft furniture that blends style, comfort, and quality—creating spaces where life happens."
          </h3>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
            With thousands of satisfied customers, Minicom has become a trusted name in high-quality furniture. We are dedicated to crafting thoughtfully designed pieces that blend comfort, style, and functionality, ensuring they fit seamlessly into any home. Whether you seek timeless elegance or modern innovation, our collections are created to elevate your living experience.
          </p>

          {/* Feature Icons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`text-center transition-all duration-1000 ${
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 hover:shadow-md transition-shadow duration-300">
                  <feature.icon className="w-8 h-8 text-gray-700" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Categories Sliding Section */}
          <div className="relative mb-16">
            {/* Fade effect on sides */}
            <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
            
            <div className="flex gap-6 overflow-x-auto scrollbar-hide py-4 px-8">
              {categories.map((category, index) => (
                <div
                  key={category.title}
                  className={`flex-shrink-0 bg-white rounded-full px-8 py-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
                    isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                  }`}
                  style={{ transitionDelay: `${600 + index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <category.icon className="w-6 h-6 text-gray-700" />
                    <div className="text-left">
                      <h5 className="font-medium text-gray-900 text-sm">{category.title}</h5>
                      <p className="text-xs text-gray-500">{category.count}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Furniture Showcase Image */}
      <div
        className={`w-full h-96 md:h-[500px] lg:h-[600px] relative overflow-hidden transition-all duration-1000 delay-700 ${
          isInView ? "opacity-100 scale-100" : "opacity-0 scale-105"
        }`}
      >
        <img
          src="/showcase/modern-living-room-setup.avif"
          alt="Modern living room furniture showcase"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
