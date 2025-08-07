"use client"

import { useState, useRef, useEffect } from "react"
import { Sofa, Bed, Briefcase, Coffee, Home, Users, Armchair, Table, Lamp, FolderCogIcon as Cabinet, SofaIcon as Couch, ChefHat } from 'lucide-react'

export function OurClients() {
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const categoriesScrollRef = useRef<HTMLDivElement>(null)

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

  const categories = [
    { icon: Sofa, title: "Living Room Sofas", count: "150+ Products" },
    { icon: Bed, title: "Bedroom Sets", count: "120+ Products" },
    { icon: Briefcase, title: "Office Furniture", count: "80+ Products" },
    { icon: Coffee, title: "Dining Tables", count: "90+ Products" },
    { icon: Armchair, title: "Chairs & Seating", count: "110+ Products" },
    { icon: Table, title: "Coffee Tables", count: "65+ Products" },
    { icon: Lamp, title: "Lighting & Decor", count: "200+ Products" },
    { icon: Cabinet, title: "Storage Solutions", count: "85+ Products" },
    { icon: Couch, title: "Recliners", count: "45+ Products" },
    { icon: ChefHat, title: "Kitchen Furniture", count: "70+ Products" },
    { icon: Home, title: "Home Office", count: "95+ Products" },
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

  // Smooth auto-scroll effect for client logos
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer || !isInView) return

    let animationId: number
    let scrollPosition = 0
    const scrollSpeed = 0.5 // Slower, smoother scrolling

    const smoothScroll = () => {
      scrollPosition += scrollSpeed
      scrollContainer.scrollLeft = scrollPosition
      
      // Reset when reaching the end
      if (scrollPosition >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        scrollPosition = 0
      }
      
      animationId = requestAnimationFrame(smoothScroll)
    }

    animationId = requestAnimationFrame(smoothScroll)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isInView])

  // Smooth auto-scroll effect for categories
  useEffect(() => {
    const scrollContainer = categoriesScrollRef.current
    if (!scrollContainer || !isInView) return

    let animationId: number
    let scrollPosition = 0
    const scrollSpeed = 0.3 // Even slower for categories

    const smoothScroll = () => {
      scrollPosition += scrollSpeed
      scrollContainer.scrollLeft = scrollPosition
      
      // Reset when reaching the end
      if (scrollPosition >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        scrollPosition = 0
      }
      
      animationId = requestAnimationFrame(smoothScroll)
    }

    // Start after a delay
    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(smoothScroll)
    }, 2000)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isInView])

  return (
    <section ref={sectionRef} className="py-20 bg-[#F2F2F2] relative overflow-hidden">
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
            <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-[#F2F2F2] to-transparent z-10"></div>
            <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-[#F2F2F2] to-transparent z-10"></div>
            
            <div 
              ref={scrollRef}
              className="flex gap-8 overflow-x-hidden py-8"
              style={{ scrollBehavior: 'auto' }}
            >
              {/* Triple logos for seamless loop */}
              {[...clients, ...clients, ...clients].map((client, index) => (
                <div
                  key={`${client.name}-${index}`}
                  className="flex-shrink-0 w-48 h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center p-6 hover:shadow-md transition-shadow duration-300"
                >
                  <img
                    src={client.logo || "/placeholder.svg"}
                    alt={client.name}
                    className="max-w-full max-h-full object-contain"
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

          {/* Categories Sliding Section */}
          <div className="relative mb-16">
            {/* Fade effect on sides */}
            <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-[#F2F2F2] to-transparent z-10"></div>
            <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-[#F2F2F2] to-transparent z-10"></div>
            
            <div 
              ref={categoriesScrollRef}
              className="flex gap-6 overflow-x-hidden py-4 px-8"
              style={{ scrollBehavior: 'auto' }}
            >
              {/* Triple categories for seamless loop */}
              {[...categories, ...categories, ...categories].map((category, index) => (
                <div
                  key={`${category.title}-${index}`}
                  className={`flex-shrink-0 bg-white rounded-full px-8 py-4 shadow-sm hover:shadow-md hover:bg-gradient-to-r hover:from-[#C53D39] hover:to-[#F1BA69] hover:text-white transition-all duration-300 hover:-translate-y-1 cursor-pointer group ${
                    isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                  }`}
                  style={{ transitionDelay: `${600 + (index % categories.length) * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <category.icon className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors duration-300" />
                    <div className="text-left">
                      <h5 className="font-medium text-gray-900 text-sm group-hover:text-white transition-colors duration-300">{category.title}</h5>
                      <p className="text-xs text-gray-500 group-hover:text-white/80 transition-colors duration-300">{category.count}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

{/* Full Width & Full Height Furniture Showcase Image */}
<div
  className={`w-full h-screen relative overflow-hidden transition-all duration-1000 delay-700 ${
    isInView ? "opacity-100 scale-100" : "opacity-0 scale-105"
  }`}
>
  <div className="w-full h-full px-10">
    <img
      src="/showcase/modern-living-room-setup.avif"
      alt="Modern living room furniture showcase"
      className="w-full h-full object-contain -mt-[10%]" // Added margin-top
    />
  </div>
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
