"use client"

import { useState } from "react"
import { Calendar, User, ArrowRight, Search, Clock } from "lucide-react"
import { HeroSlider } from "@/components/common/hero-slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [visiblePosts, setVisiblePosts] = useState(6)
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

  const blogPosts = [
    {
      id: "1",
      title: "Top 5 Timeless Wood Finishes for Modern Homes in 2024",
      excerpt:
        "Discover the most popular wood finishes that never go out of style and learn how to choose the perfect one for your furniture pieces. From classic oak to contemporary walnut, explore finishes that enhance both durability and aesthetic appeal.",
      author: "Sarah Johnson",
      date: "January 15, 2024",
      category: "Design Tips",
      image: "/shop/products/dining-table-1.jpg",
      readTime: "5 min read",
      slug: "timeless-wood-finishes-2024",
    },
    {
      id: "2",
      title: "How to Care for Leather Furniture: A Complete Guide",
      excerpt:
        "Learn the essential tips and techniques to keep your leather furniture looking pristine for years to come with our comprehensive care guide. Proper maintenance can extend the life of your investment significantly.",
      author: "Michael Chen",
      date: "January 12, 2024",
      category: "Furniture Care",
      image: "/shop/products/sofa-1.jpg",
      readTime: "8 min read",
      slug: "leather-furniture-care-guide",
    },
    {
      id: "3",
      title: "Small Space, Big Style: Maximizing Your Studio Apartment",
      excerpt:
        "Transform your compact living space into a stylish and functional home with these expert interior design tips and space-saving furniture solutions that don't compromise on comfort or aesthetics.",
      author: "Emma Rodriguez",
      date: "January 10, 2024",
      category: "Room Makeovers",
      image: "/shop/products/chair-1.jpg",
      readTime: "6 min read",
      slug: "small-space-big-style",
    },
    {
      id: "4",
      title: "Sustainable Furniture: Why Eco-Friendly Choices Matter",
      excerpt:
        "Explore the environmental impact of furniture production and discover how choosing sustainable options can make a difference for our planet while creating beautiful, lasting pieces for your home.",
      author: "David Green",
      date: "January 8, 2024",
      category: "Sustainability",
      image: "/shop/products/bed-1.jpg",
      readTime: "7 min read",
      slug: "sustainable-furniture-choices",
    },
    {
      id: "5",
      title: "2024 Interior Design Trends: What's Hot This Year",
      excerpt:
        "Stay ahead of the curve with the latest interior design trends that are shaping homes in 2024, from color palettes to furniture styles. Discover what's trending and how to incorporate these elements into your space.",
      author: "Lisa Park",
      date: "January 5, 2024",
      category: "Interior Trends",
      image: "/shop/products/coffee-table-1.jpg",
      readTime: "4 min read",
      slug: "interior-design-trends-2024",
    },
    {
      id: "6",
      title: "The Ultimate Guide to Choosing the Perfect Dining Table",
      excerpt:
        "From size considerations to material options, learn everything you need to know to select the ideal dining table for your home. Make informed decisions that will serve your family for years to come.",
      author: "Robert Kim",
      date: "January 3, 2024",
      category: "Buying Guides",
      image: "/shop/products/wardrobe-1.jpg",
      readTime: "9 min read",
      slug: "choosing-perfect-dining-table",
    },
  ]

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

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || post.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const displayedPosts = filteredPosts.slice(0, visiblePosts)

  const loadMorePosts = () => {
    setVisiblePosts((prev) => prev + 6)
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

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayedPosts.map((post, index) => (
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

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className={getCategoryColor(post.category)}>{post.category}</Badge>
                    </div>

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
                      {post.excerpt}
                    </p>

                    {/* Author, Date, and Read Time */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span className="font-poppins">{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span className="font-poppins">{post.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span className="font-poppins">{post.readTime}</span>
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

        {/* Load More Button */}
        {visiblePosts < filteredPosts.length && (
          <div className="text-center">
            <Button
              onClick={loadMorePosts}
              className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Load More Articles
            </Button>
          </div>
        )}

        {/* No Results */}
        {filteredPosts.length === 0 && (
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
