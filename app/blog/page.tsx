"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  User,
  ArrowRight,
  Search,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
} from "lucide-react"
import { HeroSlider } from "@/components/common/hero-slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import SmartImage from "@/components/smart-image"

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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("latest")
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  })
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])

  const heroImages = ["/about/hero-1.jpg", "/contact/furniture-showcase-1.jpg", "/about/hero-2.jpg"]
  const breadcrumb = [{ label: "Blog" }]

  const fetchBlogPosts = async (page = 1) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        search: searchTerm,
        page: page.toString(),
        limit: pagination.limit.toString(),
        sort: sortBy,
      })

      // Add category filters
      if (selectedCategories.length > 0) {
        selectedCategories.forEach((category) => {
          params.append("categories[]", category)
        })
      }

      // Add tag filters
      if (selectedTags.length > 0) {
        selectedTags.forEach((tag) => {
          params.append("tags[]", tag)
        })
      }

      const response = await fetch(`/api/blog?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      if (data.success) {
        setBlogPosts(data.posts || [])
        setPagination(data.pagination)

        // Extract unique categories and tags
        const categories = [...new Set(data.posts?.map((post: BlogPost) => post.category).filter(Boolean))]
        const tags = [...new Set(data.posts?.flatMap((post: BlogPost) => post.tags || []).filter(Boolean))]
        setAvailableCategories(categories.sort())
        setAvailableTags(tags.sort())
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
    fetchBlogPosts(1)
  }, [searchTerm, selectedCategories, selectedTags, sortBy])

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  const handleTagChange = (tag: string, checked: boolean) => {
    if (checked) {
      setSelectedTags([...selectedTags, tag])
    } else {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    }
  }

  const handleLimitChange = (newLimit: string) => {
    setPagination((prev) => ({ ...prev, limit: Number.parseInt(newLimit), page: 1 }))
    fetchBlogPosts(1)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategories([])
    setSelectedTags([])
    setSortBy("latest")
  }

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

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
    fetchBlogPosts(newPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null

    const pages = []
    const currentPage = pagination.page
    const totalPages = pagination.totalPages

    // Always show first page
    pages.push(1)

    // Add ellipsis if needed
    if (currentPage > 3) {
      pages.push("...")
    }

    // Add pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }

    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      pages.push("...")
    }

    // Always show last page
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages)
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-12">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-white border-[#C53D39] text-[#C53D39] hover:bg-[#C53D39] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        {pages.map((page, index) => (
          <Button
            key={index}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => typeof page === "number" && handlePageChange(page)}
            disabled={page === "..."}
            className={
              page === currentPage
                ? "bg-[#C53D39] hover:bg-[#B12E2A] text-white"
                : page === "..."
                  ? "cursor-default"
                  : "bg-white border-[#C53D39] text-[#C53D39] hover:bg-[#C53D39] hover:text-white"
            }
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-white border-[#C53D39] text-[#C53D39] hover:bg-[#C53D39] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    )
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

      {/* Header */}
      <div className="text-center py-16 bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-montserrat mb-4">
          Furniture Insights & Design Inspiration
        </h2>
        <p className="text-xl text-gray-600 font-poppins max-w-3xl mx-auto">
          Discover expert tips, design trends, and practical advice to help you create beautiful, functional spaces with
          the perfect furniture choices.
        </p>
      </div>

      <div className="flex min-h-screen">
        {/* Left Sidebar - Full Height */}
        <div className="w-80 bg-white border-r border-gray-200 sticky top-0 h-screen overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              {(searchTerm || selectedCategories.length > 0 || selectedTags.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-[#C53D39] hover:text-[#B12E2A] hover:bg-red-50"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C53D39] focus:border-transparent"
                />
              </div>
            </div>

            <Separator className="my-6" />

            {/* Categories */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                    />
                    <label htmlFor={`category-${category}`} className="text-sm text-gray-700 cursor-pointer flex-1">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Tags */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Tags</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={(checked) => handleTagChange(tag, checked as boolean)}
                    />
                    <label htmlFor={`tag-${tag}`} className="text-sm text-gray-700 cursor-pointer flex-1">
                      {tag}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategories.length > 0 || selectedTags.length > 0) && (
              <>
                <Separator className="my-6" />
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Active Filters</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedCategories.map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="text-xs cursor-pointer"
                        onClick={() => handleCategoryChange(category, false)}
                      >
                        {category}
                        <button className="ml-1 hover:bg-gray-300 rounded-full p-0.5">×</button>
                      </Badge>
                    ))}
                    {selectedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs cursor-pointer"
                        onClick={() => handleTagChange(tag, false)}
                      >
                        {tag}
                        <button className="ml-1 hover:bg-gray-300 rounded-full p-0.5">×</button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1" style={{ padding: "40px" }}>
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Showing {(pagination.page - 1) * pagination.limit + 1}-
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="popular">Popular</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <Select value={pagination.limit.toString()} onValueChange={handleLimitChange}>
                  <SelectTrigger className="w-16 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`h-8 px-3 rounded-none ${viewMode === "grid" ? "bg-[#C53D39] text-white" : "hover:bg-gray-100"}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`h-8 px-3 rounded-none ${viewMode === "list" ? "bg-[#C53D39] text-white" : "hover:bg-gray-100"}`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-[#C53D39] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading articles...</p>
            </div>
          )}

          {/* Blog Grid/List */}
          {!loading && blogPosts.length > 0 && (
            <>
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}
              >
                {blogPosts.map((post, index) => (
                  <article
                    key={post.id}
                    className={`group relative ${viewMode === "list" ? "flex gap-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6" : ""}`}
                    onMouseEnter={() => setHoveredCard(post.id.toString())}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <Link href={`/blog/${post.slug}`} className="block">
                      {viewMode === "grid" ? (
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
                            <SmartImage
                              src={post.featured_image || "/placeholder.svg"}
                              alt={post.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                            <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
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
                      ) : (
                        <>
                          {/* List View */}
                          <div className="w-48 h-32 flex-shrink-0">
                            <SmartImage
                              src={post.featured_image || "/placeholder.svg"}
                              alt={post.title}
                              width={192}
                              height={128}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getCategoryColor(post.category)}>{post.category}</Badge>
                              {post.is_featured && <Badge variant="secondary">Featured</Badge>}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#C53D39] transition-colors duration-300 font-montserrat">
                              {post.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2 font-poppins">
                              {post.excerpt || "No excerpt available"}
                            </p>
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
                        </>
                      )}
                    </Link>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {renderPagination()}
            </>
          )}

          {/* No Results */}
          {!loading && blogPosts.length === 0 && !error && (
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">No articles found</h3>
              <p className="text-gray-600 font-poppins mb-6">
                Try adjusting your search terms or browse all categories.
              </p>
              <Button
                onClick={clearFilters}
                variant="outline"
                className="bg-white hover:bg-gray-50 border-[#C53D39] text-[#C53D39] hover:bg-[#C53D39] hover:text-white"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
