"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Calendar, User } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  author: string
  date: string
  image: string
  slug: string
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "10 Essential Tips for Creating the Perfect Home Office",
    excerpt:
      "Transform your workspace into a productivity haven with these expert-approved design strategies and ergonomic solutions that boost both comfort and efficiency.",
    author: "Sarah Johnson",
    date: "Dec 15, 2024",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
    slug: "perfect-home-office-tips",
  },
  {
    id: "2",
    title: "The Psychology of Color in Interior Design",
    excerpt:
      "Discover how different colors affect mood, productivity, and well-being in your living spaces. Learn to choose the right palette for every room.",
    author: "Michael Chen",
    date: "Dec 12, 2024",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
    slug: "color-psychology-interior-design",
  },
  {
    id: "3",
    title: "Sustainable Furniture: Making Eco-Friendly Choices",
    excerpt:
      "Explore the world of sustainable furniture design and learn how to make environmentally conscious decisions without compromising on style or quality.",
    author: "Emma Rodriguez",
    date: "Dec 10, 2024",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",
    slug: "sustainable-furniture-guide",
  },
  {
    id: "4",
    title: "Small Space, Big Style: Maximizing Your Living Area",
    excerpt:
      "Creative solutions and space-saving furniture ideas to make your compact living space feel larger, more functional, and beautifully organized.",
    author: "David Park",
    date: "Dec 8, 2024",
    image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=600&h=400&fit=crop",
    slug: "small-space-design-tips",
  },
  {
    id: "5",
    title: "The Rise of Ergonomic Furniture in Modern Workplaces",
    excerpt:
      "Understanding the importance of ergonomic design in office furniture and how it's revolutionizing workplace health and productivity standards.",
    author: "Lisa Thompson",
    date: "Dec 5, 2024",
    image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=600&h=400&fit=crop",
    slug: "ergonomic-furniture-workplace",
  },
  {
    id: "6",
    title: "Mixing Modern and Vintage: A Designer's Guide",
    excerpt:
      "Master the art of blending contemporary and vintage furniture pieces to create unique, personalized spaces that tell your story.",
    author: "James Wilson",
    date: "Dec 3, 2024",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=400&fit=crop",
    slug: "mixing-modern-vintage-furniture",
  },
]

export function ArticlesBlogs() {
  const [isInView, setIsInView] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
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

          {/* Blog Grid */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-300 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            {blogPosts.map((post, index) => (
              <article
                key={post.id}
                className="group relative"
                onMouseEnter={() => setHoveredCard(post.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
                    {/* Animated Border Effect */}
                    <div
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        hoveredCard === post.id ? "opacity-100" : "opacity-0"
                      }`}
                      style={{
                        padding: "3px",
                        borderRadius: "16px",
                      }}
                    >
                      {/* Top Border */}
                      <div
                        className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-[#C53D39] to-[#F1BA69]"
                        style={{
                          width: hoveredCard === post.id ? "100%" : "0%",
                          transition: "width 0.6s ease-out",
                          borderRadius: "16px 16px 0 0",
                        }}
                      ></div>

                      {/* Right Border */}
                      <div
                        className="absolute top-0 right-0 w-0.5 bg-gradient-to-b from-[#F1BA69] to-[#C53D39]"
                        style={{
                          height: hoveredCard === post.id ? "100%" : "0%",
                          transition: "height 0.6s ease-out 0.15s",
                        }}
                      ></div>

                      {/* Bottom Border */}
                      <div
                        className="absolute bottom-0 right-0 h-0.5 bg-gradient-to-l from-[#C53D39] to-[#F1BA69]"
                        style={{
                          width: hoveredCard === post.id ? "100%" : "0%",
                          transition: "width 0.6s ease-out 0.3s",
                          borderRadius: "0 0 16px 16px",
                        }}
                      ></div>

                      {/* Left Border */}
                      <div
                        className="absolute bottom-0 left-0 w-0.5 bg-gradient-to-t from-[#F1BA69] to-[#C53D39]"
                        style={{
                          height: hoveredCard === post.id ? "100%" : "0%",
                          transition: "height 0.6s ease-out 0.45s",
                        }}
                      ></div>
                    </div>

                    {/* Featured Image */}
                    <div className="relative h-64 overflow-hidden rounded-t-2xl">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Hover Read More Button */}
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <div className="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg">
                          <div className="flex items-center text-[#C53D39] font-semibold text-sm">
                            <span>Read More</span>
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 pb-4">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#C53D39] transition-colors duration-300">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>

                      {/* Author and Date */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{post.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#C53D39]/5 to-[#F1BA69]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* View All Button */}
          <div
            className={`text-center mt-12 transition-all duration-1000 delay-500 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <Link
              href="/blog"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white font-semibold rounded-full hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 group"
            >
              <span>View All Articles</span>
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
