"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Calendar, User } from "lucide-react"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  author_name: string
  published_at: string
  featured_image: string
  slug: string
}

export function ArticlesBlogs() {
  const [isInView, setIsInView] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)

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
        const response = await fetch("/api/blog?limit=6")
        const data = await response.json()

        if (data.success) {
          setBlogPosts(data.data)
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <section ref={sectionRef} className="py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-[#C53D39]/3 to-[#F1BA69]/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-[#F1BA69]/3 to-[#C53D39]/3 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Latest{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C53D39] to-[#F1BA69]">
                Articles & Blogs
              </span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Insights, tips, and stories from our team to help you create beautiful, functional spaces
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-[#C53D39] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading articles...</p>
            </div>
          )}

          {/* Blog Grid */}
          {!loading && (
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-300 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
            >
              {blogPosts.map((post, index) => (
                <article
                  key={post.id}
                  className="group relative"
                  onMouseEnter={() => setHoveredCard(post.id.toString())}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
                      {/* Animated Border Effect */}
                      <div
                        className={`absolute inset-0 border-4 border-transparent ${
                          hoveredCard === post.id.toString() ? "border-[#C53D39]" : ""
                        } transition-all duration-500 group-hover:border-[#C53D39]`}
                      ></div>
                      {/* Featured Image */}
                      <div className="relative h-64">
                        <Image
                          src={post.featured_image || "/placeholder.svg"}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {/* Blog Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                        <p className="text-gray-600 mb-4">{post.excerpt}</p>
                        <div className="flex items-center space-x-4">
                          <User className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-500">{post.author_name}</span>
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-500">{formatDate(post.published_at)}</span>
                        </div>
                      </div>
                      {/* Read More Button */}
                      <div className="absolute bottom-4 right-4">
                        <ArrowRight className="w-6 h-6 text-[#C53D39] group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
