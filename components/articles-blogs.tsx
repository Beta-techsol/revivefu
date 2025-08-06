"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  author_name: string
  published_at: string
  featured_image: string
  slug: string
  category?: string
}

export function ArticlesBlogs() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)
  const carouselRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

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

  // Smooth auto-scroll animation
  useEffect(() => {
    if (!isAutoScrolling || blogPosts.length === 0) return

    const animate = () => {
      if (carouselRef.current) {
        const container = carouselRef.current
        const scrollSpeed = 0.5 // Pixels per frame
        
        container.scrollLeft += scrollSpeed
        
        // Check if we've scrolled past the original content
        const maxScroll = container.scrollWidth / 2
        if (container.scrollLeft >= maxScroll) {
          container.scrollLeft = 0
        }
      }
      
      if (isAutoScrolling) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAutoScrolling, blogPosts.length])

  const handlePrevious = () => {
    setIsAutoScrolling(false)
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.clientWidth / 4
      carouselRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' })
    }
    setTimeout(() => setIsAutoScrolling(true), 3000)
  }

  const handleNext = () => {
    setIsAutoScrolling(false)
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.clientWidth / 4
      carouselRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' })
    }
    setTimeout(() => setIsAutoScrolling(true), 3000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading articles...</p>
        </div>
      </section>
    )
  }

  // Triple the posts for seamless infinite scroll
  const infinitePosts = [...blogPosts, ...blogPosts, ...blogPosts]

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Left fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
      
      {/* Right fade effect */}
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

      <div className="relative">
        {/* Header with 8% left margin */}
        <div className="ml-[8%] mr-8 mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h2 className="text-2xl md:text-3xl font-normal text-gray-900 tracking-wide">
                REVIVE FURNITURE
              </h2>
              <div className="hidden md:flex items-center space-x-4">
                <div className="w-16 h-px bg-gray-300"></div>
                <span className="text-sm text-gray-500 font-medium tracking-wider">
                  DESIGN & TRENDS
                </span>
              </div>
            </div>
            
            {/* Navigation arrows */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevious}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                aria-label="Previous article"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <button
                onClick={handleNext}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                aria-label="Next article"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel container - full width with left margin only */}
        <div className="ml-[8%] overflow-hidden">
          <div
            ref={carouselRef}
            className="flex overflow-x-hidden"
            style={{ 
              scrollBehavior: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
            onMouseEnter={() => setIsAutoScrolling(false)}
            onMouseLeave={() => setIsAutoScrolling(true)}
          >
            {infinitePosts.map((post, index) => (
              <div
                key={`${post.id}-${Math.floor(index / blogPosts.length)}-${index % blogPosts.length}`}
                className="flex-shrink-0 w-1/4 pr-4"
              >
                <Link href={`/blog/${post.slug}`} className="block group">
                  <article className="h-full">
                    {/* Image container with rounded corners */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 mb-4 rounded-2xl">
                      <Image
                        src={post.featured_image || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105 rounded-2xl"
                      />
                      
                      {/* Category badge */}
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-gray-800 rounded-full">
                          {post.category || 'DESIGN'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      {/* Author and date */}
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="font-medium">BY {post.author_name.toUpperCase()}</span>
                        <span>•</span>
                        <span>{formatDate(post.published_at).toUpperCase()}</span>
                      </div>

                      {/* Title - smaller font size for minimalist look */}
                      <h3 className="text-base font-normal text-gray-900 leading-tight group-hover:text-gray-700 transition-colors duration-200">
                        {post.title}
                      </h3>
                    </div>
                  </article>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
