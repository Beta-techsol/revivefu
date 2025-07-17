"use client"

import { useState, useEffect } from "react"
import { Calendar, User, ArrowRight, Search, Clock, AlertCircle } from "lucide-react"
import { HeroSlider } from "@/components/common/hero-slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  author_name: string
  published_at: string
  category: string
  featured_image: string
  slug: string
  tags: string[]
  is_featured: boolean
  views: number
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0,
  })
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const heroImages = ["/about/hero-1.jpg", "/contact/furniture-showcase-1.jpg", "/about/hero-2.jpg"]
  const breadcrumb = [{ label: "Blog" }]

  const categories = [
    "All",
    "Design Tips",
    "Furniture Care",
    "Interior Trends",
    "Room Makeovers",
    "Buying Guides",
    "Sustainability",
  ]

  const fetchBlogPosts = async (loadMore = false) => {
    try {
      if (!loadMore) {
        setLoading(true)
        setError(null)
      }

      const currentPage = loadMore ? pagination.page + 1 : 1

      const params = new URLSearchParams({
        search: searchTerm,
        category: selectedCategory === "all" ? "" : selectedCategory,
        page: currentPage.toString(),
        limit: pagination.limit.toString(),
      })

      console.log("Fetching blog posts with params:", params.toString())

      const response = await fetch(`/api/blog?${params}`)
      const data = await response.json()

      console.log("Blog API response:", data)

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      if (data.success) {
        if (loadMore) {
          setBlogPosts((prev) => [...prev, ...(data.posts || [])])
        } else {
          setBlogPosts(data.posts || [])
        }
        setPagination(data.pagination)
      } else {
        throw new Error(data.error || "Failed to fetch blog posts")
      }
    } catch (error: any) {
      console.error("Error fetching blog posts:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogPosts()
  }, [searchTerm, selectedCategory])

  const getCategoryColor = (category: string) => {
    const colors = {
      "Design Tips": "bg-blue-100 text-blue-800",
      "Furniture Care": "bg-green-100 text-green-800",
      "Interior Trends": "bg-purple-100 text-purple-800",
      "Room Makeovers": "bg-pink-100 text-pink-800",
      "Buying Guides": "bg-orange-100 text-orange-800",
      Sustainability: "bg-emerald-100 text-emerald-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const loadMorePosts = () => {
    fetchBlogPosts(true)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <HeroSlider title="Our Blog" breadcrumb={breadcrumb} images={heroImages} />

        <div className="container mx-auto px-4 py-16">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold">Error loading blog posts</h3>
                  <p className="text-sm">{error}</p>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent" onClick={() => fetchBlogPosts()}>
                    Try Again
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Slider */}
      <HeroSlider title="Our Blog" breadcrumb={breadcrumb} images={heroImages} />

      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-montserrat mb-4">
            Furniture Insights & Design Inspiration
          </h2>
          <p className="text-xl text-gray-600 font-poppins max-w-3xl mx-auto">
            Discover expert tips, design trends, and practical advice to help you create beautiful, functional spaces
            with the perfect furniture choices.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C53D39] focus:border-transparent font-poppins"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category.toLowerCase())}
                variant={selectedCategory === category.toLowerCase() ? "default" : "outline"}
                className={`${
                  selectedCategory === category.toLowerCase()
                    ? "bg-[#C53D39] hover:bg-[#B12E2A] text-white"
                    : "bg-white hover:bg-gray-50 border-gray-300"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && blogPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-[#C53D39] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading articles...</p>
          </div>
        )}

        {/* Blog Grid */}
        {blogPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        hoveredCard === post.id.toString() ? "opacity-100" : "opacity-0"
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
                          width: hoveredCard === post.id.toString() ? "100%" : "0%",
                          transition: "width 0.6s ease-out",
                          borderRadius: "16px 16px 0 0",
                        }}
                      ></div>

                      {/* Right Border */}
                      <div
                        className="absolute top-0 right-0 w-0.5 bg-gradient-to-b from-[#F1BA69] to-[#C53D39]"
                        style={{
                          height: hoveredCard === post.id.toString() ? "100%" : "0%",
                          transition: "height 0.6s ease-out 0.15s",
                        }}
                      ></div>

                      {/* Bottom Border */}
                      <div
                        className="absolute bottom-0 right-0 h-0.5 bg-gradient-to-l from-[#C53D39] to-[#F1BA69]"
                        style={{
                          width: hoveredCard === post.id.toString() ? "100%" : "0%",
                          transition: "width 0.6s ease-out 0.3s",
                          borderRadius: "0 0 16px 16px",
                        }}
                      ></div>

                      {/* Left Border */}
                      <div
                        className="absolute bottom-0 left-0 w-0.5 bg-gradient-to-t from-[#F1BA69] to-[#C53D39]"
                        style={{
                          height: hoveredCard === post.id.toString() ? "100%" : "0%",
                          transition: "height 0.6s ease-out 0.45s",
                        }}
                      ></div>
                    </div>

                    {/* Featured Image */}
                    <div className="relative h-64 overflow-hidden rounded-t-2xl">
                      <Image
                        src={post.featured_image || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className={getCategoryColor(post.category)}>{post.category}</Badge>
                      </div>

                      {/* Featured Badge */}
                      {post.is_featured && (
                        <div className="absolute top-4 right-4">
                          <Badge variant="secondary">Featured</Badge>
                        </div>
                      )}

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
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#C53D39] transition-colors duration-300 font-montserrat">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 font-poppins">
                        {post.excerpt || "No excerpt available"}
                      </p>

                      {/* Author, Date, and Read Time */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span className="font-poppins">{post.author_name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span className="font-poppins">{formatDate(post.published_at)}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span className="font-poppins">5 min read</span>
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
        )}

        {/* Load More Button */}
        {pagination.page < pagination.totalPages && (
          <div className="text-center">
            <Button
              onClick={loadMorePosts}
              disabled={loading}
              className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                "Load More Articles"
              )}
            </Button>
          </div>
        )}

        {/* No Results */}
        {!loading && blogPosts.length === 0 && !error && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">No articles found</h3>
            <p className="text-gray-600 font-poppins mb-6">Try adjusting your search terms or browse all categories.</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
              }}
              variant="outline"
              className="bg-white hover:bg-gray-50"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
