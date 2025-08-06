"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'

interface ShowcaseItem {
  id: string
  title: string
  description: string
  image: string
  buttonText: string
  href: string
}

const showcaseItems: ShowcaseItem[] = [
  {
    id: "elegant-chairs",
    title: "ELEGANT LIVING ROOM CHAIRS",
    description: "Transform your living space with our collection of sophisticated chairs. From modern accent pieces to classic armchairs, find the perfect seating solution that combines comfort with timeless style.",
    image: "/showcase/chair.avif",
    buttonText: "SHOP NOW",
    href: "/shop?category=chairs"
  },
  {
    id: "office-furniture",
    title: "OFFICE FURNITURE",
    description: "Upgrade your workspace with ergonomic and stylish office furniture. From sleek desks to comfortable chairs, find everything you need for a productive and modern office!",
    image: "/showcase/office-furniture.avif",
    buttonText: "SHOP NOW",
    href: "/shop?category=office"
  },
  {
    id: "luxury-sofas",
    title: "LUXURY SOFA COLLECTION",
    description: "Experience ultimate comfort with our premium sofa collection. Crafted with the finest materials and attention to detail, each piece is designed to be the centerpiece of your living room.",
    image: "/showcase/sofa.avif",
    buttonText: "SHOP NOW",
    href: "/shop?category=sofas"
  }
]

export function ScrollRevealShowcase() {
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    itemRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                // Add a staggered delay for each item
                setTimeout(() => {
                  setVisibleItems(prev => new Set([...prev, showcaseItems[index].id]))
                }, index * 200) // 200ms delay between each item
              }
            })
          },
          {
            threshold: 0.2,
            rootMargin: "-50px 0px -50px 0px"
          }
        )

        observer.observe(ref)
        observers.push(observer)
      }
    })

    return () => {
      observers.forEach(observer => observer.disconnect())
    }
  }, [])

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="space-y-8 lg:space-y-16">
          {showcaseItems.map((item, index) => (
            <div
              key={item.id}
              ref={el => itemRefs.current[index] = el}
              className={`
                transform transition-all duration-1000 ease-out
                ${visibleItems.has(item.id) 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-12 opacity-0'
                }
              `}
              style={{
                transitionDelay: visibleItems.has(item.id) ? '0ms' : '0ms'
              }}
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-0 min-h-[400px]">
                  {/* Content Section */}
                  <div className="flex flex-col justify-center p-8 lg:p-12 xl:p-16">
                    <div className="space-y-6">
                      <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 leading-tight">
                        {item.title}
                      </h2>
                      <p className="text-gray-600 text-base lg:text-lg leading-relaxed max-w-md">
                        {item.description}
                      </p>
                      <div className="pt-4">
                        <Button 
                          className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-none font-medium tracking-wide transition-all duration-300 group"
                          asChild
                        >
                          <a href={item.href}>
                            {item.buttonText}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Image Section */}
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent z-10"></div>
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
