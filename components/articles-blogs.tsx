"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  author_name: string
  published_at: string
  featured_image: string
  slug: string
  category: string
}

export function ArticlesBlogs() {
  const [isInView, setIsInView] = useState(false)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
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

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch("/api/blog?limit=10")
        const data = await response.json()

        if (data.success) {
          setBlogPosts(data.posts || [])
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  // Auto-scroll functionality
  useEffect(() => {
    if (isAutoPlaying && blogPosts.length > 0 && isInView) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const maxIndex = Math.max(0, blogPosts.length - 3)
          return prevIndex >= maxIndex ? 0 : prevIndex + 1
        })
      }, 4000)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying, blogPosts.length, isInView])

  const handlePrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.max(0, blogPosts.length - 3)
      return prevIndex <= 0 ? maxIndex : prevIndex - 1
    })
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.max(0, blogPosts.length - 3)
      return prevIndex >= maxIndex ? 0 : prevIndex + 1
    })
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).toUpperCase()
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      "Design Tips": "bg-blue-500",
      "Furniture Care": "bg-green-500",
      "Interior Trends": "bg-purple-500",
      "Room Makeovers": "bg-pink-500",
      "Buying Guides": "bg-orange-500",
      "Sustainability": "bg-emerald-500",
      "SOFA": "bg-yellow-500",
      "BEDROOM": "bg-indigo-500",
      "OFFICE": "bg-gray-700",
    }
    return colors[category as keyof typeof colors] || "bg-gray-600"
  }

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#C53D39] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading articles...</p>
        </div>
      </section>
    )
  }

  if (!blogPosts.length) {
    return null
  }

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div
          className={`flex items-center justify-between mb-16 transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center space-x-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-wide uppercase">
              THE FURNITURE JOURNAL
            </h2>
            <div className="hidden md:flex items-center space-x-4">
              <div className="w-16 h-px bg-gray-300"></div>
              <span className="text-sm text-gray-500 uppercase tracking-wider">DESIGN & TRENDS</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              className="w-10 h-10 rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Full Width Carousel Container */}
      <div className="relative overflow-hidden">
        {/* Left Blur Effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
        
        {/* Right Blur Effect */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

        {/* Carousel Track */}
        <div
          className={`flex transition-all duration-1000 ${
            isInView ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transform: `translateX(calc(-${currentIndex * 33.333}% + 2rem))`,
            transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            width: `${(blogPosts.length * 100) / 3}%`,
          }}
        >
          {blogPosts.map((post, index) => (
            <div
              key={post.id}
              className="flex-shrink-0 px-4"
              style={{ width: `${100 / blogPosts.length}%` }}
            >
              <Link 
                href={`/blog/${post.slug}`} 
                className="block group"
                onMouseEnter={() => setHoveredCard(post.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <article className="h-full">
                  {/* Image Container */}
                  <div className="relative h-80 mb-6 overflow-hidden rounded-2xl">
                    <Image
                      src={post.featured_image || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge 
                        className={`${getCategoryColor(post.category)} text-white text-xs font-medium px-3 py-1.5 rounded-full border-0 shadow-sm`}
                      >
                        {post.category?.toUpperCase() || 'ARTICLE'}
                      </Badge>
                    </div>

                    {/* Hover Arrow */}
                    <div 
                      className={`absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                        hoveredCard === post.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      }`}
                    >
                      <ArrowUpRight className="h-4 w-4 text-gray-700" />
                    </div>

                    {/* Subtle Hover Overlay */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    {/* Author and Date */}
                    <div className="flex items-center space-x-4 text-xs text-gray-500 uppercase tracking-wide font-medium">
                      <div className="flex items-center space-x-1">
                        <span>BY</span>
                        <span className="text-gray-700">{post.author_name}</span>
                      </div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <span>{formatDate(post.published_at)}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-medium text-gray-900 leading-tight group-hover:text-gray-700 transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                </article>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
