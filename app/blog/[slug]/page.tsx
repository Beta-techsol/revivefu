"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Tag,
  Search,
  Mail,
  TrendingUp,
  Folder,
} from "lucide-react"
import { HeroSlider } from "@/components/common/hero-slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"

interface BlogPost {
  id: number
  title: string
  content: string
  excerpt: string
  author_name: string
  published_at: string
  category: string
  featured_image: string
  slug: string
  tags: string[]
  views: number
}

export default function SingleBlogPage() {
  const params = useParams()
  const slug = params.slug as string
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [newsletterEmail, setNewsletterEmail] = useState("")

  const heroImages = ["/about/hero-1.jpg", "/contact/furniture-showcase-1.jpg", "/about/hero-2.jpg"]

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`/api/blog/${slug}`)
        const data = await response.json()

        if (data.success) {
          setBlogPost(data.data)
        }
      } catch (error) {
        console.error("Error fetching blog post:", error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchBlogPost()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#C53D39] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    )
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    )
  }

  const breadcrumb = [{ label: "Blog", href: "/blog" }, { label: blogPost.title }]

  const relatedPosts = [
    {
      id: "2",
      title: "How to Care for Leather Furniture: A Complete Guide",
      image: "/shop/products/sofa-1.jpg",
      slug: "leather-furniture-care-guide",
      category: "Furniture Care",
    },
    {
      id: "3",
      title: "Small Space, Big Style: Maximizing Your Studio Apartment",
      image: "/shop/products/chair-1.jpg",
      slug: "small-space-big-style",
      category: "Room Makeovers",
    },
    {
      id: "4",
      title: "Sustainable Furniture: Why Eco-Friendly Choices Matter",
      image: "/shop/products/bed-1.jpg",
      slug: "sustainable-furniture-choices",
      category: "Sustainability",
    },
  ]

  // Sidebar data
  const categories = [
    { name: "Living Room Ideas", count: 12, slug: "living-room-ideas" },
    { name: "Office Furniture", count: 8, slug: "office-furniture" },
    { name: "Minimalist Design", count: 15, slug: "minimalist-design" },
    { name: "Bedroom Decor", count: 10, slug: "bedroom-decor" },
    { name: "Dining Room", count: 6, slug: "dining-room" },
    { name: "Storage Solutions", count: 9, slug: "storage-solutions" },
  ]

  const recentPosts = [
    {
      title: "Modern Minimalist Furniture Trends for 2024",
      slug: "minimalist-furniture-trends-2024",
      date: "January 20, 2024",
      image: "/shop/products/chair-1.jpg",
    },
    {
      title: "Creating a Cozy Reading Nook in Small Spaces",
      slug: "cozy-reading-nook-small-spaces",
      date: "January 18, 2024",
      image: "/shop/products/coffee-table-1.jpg",
    },
    {
      title: "The Ultimate Guide to Choosing Dining Room Chairs",
      slug: "choosing-dining-room-chairs",
      date: "January 16, 2024",
      image: "/shop/products/dining-table-1.jpg",
    },
    {
      title: "Sustainable Materials in Modern Furniture Design",
      slug: "sustainable-materials-furniture",
      date: "January 14, 2024",
      image: "/shop/products/bed-1.jpg",
    },
  ]

  const popularTags = [
    { name: "Scandinavian", count: 24 },
    { name: "WoodDesign", count: 18 },
    { name: "SmallSpaces", count: 16 },
    { name: "ModernFurniture", count: 22 },
    { name: "InteriorDesign", count: 30 },
    { name: "MinimalistDecor", count: 14 },
    { name: "HomeDecor", count: 28 },
    { name: "FurnitureCare", count: 12 },
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle comment submission
    console.log({ name, email, comment })
    setComment("")
    setName("")
    setEmail("")
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log({ newsletterEmail })
    setNewsletterEmail("")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search
    console.log({ searchTerm })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Slider */}
      <HeroSlider title={blogPost.title} breadcrumb={breadcrumb} images={heroImages} />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Button asChild variant="outline" className="bg-white hover:bg-gray-50">
              <Link href="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <article className="bg-white">
                {/* Featured Image */}
                <div className="relative h-96 mb-8 rounded-2xl overflow-hidden">
                  <Image
                    src={blogPost.featured_image || "/placeholder.svg"}
                    alt={blogPost.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-6 left-6">
                    <Badge className={getCategoryColor(blogPost.category)}>{blogPost.category}</Badge>
                  </div>
                </div>

                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="font-poppins">{blogPost.author_name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-poppins">{formatDate(blogPost.published_at)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-poppins">5 min read</span>
                  </div>
                </div>

                {/* Article Content */}
                <div
                  className="prose prose-lg max-w-none mb-12 font-poppins"
                  dangerouslySetInnerHTML={{ __html: blogPost.content }}
                  style={{
                    lineHeight: "1.8",
                  }}
                />

                {/* Tags */}
                {blogPost.tags && blogPost.tags.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 font-montserrat mb-4 flex items-center">
                      <Tag className="w-5 h-5 mr-2" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {blogPost.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Buttons */}
                <div className="mb-12">
                  <h3 className="text-lg font-semibold text-gray-900 font-montserrat mb-4 flex items-center">
                    <Share2 className="w-5 h-5 mr-2" />
                    Share this article
                  </h3>
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                    >
                      <Facebook className="w-4 h-4 mr-2" />
                      Facebook
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-sky-50 border-sky-200 text-sky-600 hover:bg-sky-100"
                    >
                      <Twitter className="w-4 h-4 mr-2" />
                      Twitter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center py-8 border-t border-b border-gray-200 mb-12">
                  <Button asChild variant="outline" className="bg-white hover:bg-gray-50">
                    <Link href="/blog">
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous Post
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="bg-white hover:bg-gray-50">
                    <Link href="/blog">
                      Next Post
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>

                {/* Comment Section */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 font-montserrat mb-6">Leave a Comment</h3>
                  <Card className="bg-gray-50">
                    <CardContent className="p-6">
                      <form onSubmit={handleCommentSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 font-poppins mb-2">
                              Name *
                            </label>
                            <Input
                              id="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                              className="font-poppins"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-gray-700 font-poppins mb-2"
                            >
                              Email *
                            </label>
                            <Input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              className="font-poppins"
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="comment"
                            className="block text-sm font-medium text-gray-700 font-poppins mb-2"
                          >
                            Comment *
                          </label>
                          <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            required
                            className="font-poppins"
                            placeholder="Share your thoughts..."
                          />
                        </div>
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
                        >
                          Post Comment
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Related Posts */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 font-montserrat mb-8">Related Articles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedPosts.map((post) => (
                      <Card key={post.id} className="group hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-0">
                          <Link href={`/blog/${post.slug}`}>
                            <div className="relative h-48 overflow-hidden rounded-t-lg">
                              <Image
                                src={post.image || "/placeholder.svg"}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-4 left-4">
                                <Badge className={getCategoryColor(post.category)}>{post.category}</Badge>
                              </div>
                            </div>
                            <div className="p-4">
                              <h4 className="font-semibold text-gray-900 font-montserrat group-hover:text-[#C53D39] transition-colors line-clamp-2">
                                {post.title}
                              </h4>
                            </div>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* CTA Section */}
                <div className="mt-16 text-center bg-gradient-to-r from-[#C53D39]/10 to-[#F1BA69]/10 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">Explore Related Furniture</h3>
                  <p className="text-gray-600 font-poppins mb-6">
                    Discover our collection of beautifully finished furniture pieces that bring these design concepts to
                    life.
                  </p>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
                  >
                    <Link href="/shop">Shop the Look</Link>
                  </Button>
                </div>
              </article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Search Widget */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="font-montserrat flex items-center">
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSearch} className="flex space-x-2">
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search articles..."
                      className="font-poppins"
                    />
                    <Button type="submit" variant="outline" className="bg-white hover:bg-gray-50">
                      <Search className="w-4 h-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Categories Widget */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="font-montserrat flex items-center">
                    <Folder className="w-5 h-5 mr-2" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/blog/category/${category.slug}`}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <span className="font-poppins text-gray-700 group-hover:text-[#C53D39]">{category.name}</span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Posts Widget */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="font-montserrat flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Recent Posts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPosts.map((post, index) => (
                      <Link key={index} href={`/blog/${post.slug}`} className="group block">
                        <div className="flex space-x-3">
                          <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={post.image || "/placeholder.svg"}
                              alt={post.title}
                              width={64}
                              height={48}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 font-poppins group-hover:text-[#C53D39] transition-colors line-clamp-2 text-sm">
                              {post.title}
                            </h4>
                            <p className="text-xs text-gray-500 font-poppins mt-1">{post.date}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Tags Widget */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="font-montserrat flex items-center">
                    <Tag className="w-5 h-5 mr-2" />
                    Popular Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <Link
                        key={tag.name}
                        href={`/blog/tag/${tag.name.toLowerCase()}`}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-[#C53D39] hover:text-white transition-colors"
                      >
                        #{tag.name}
                        <span className="ml-1 text-xs">({tag.count})</span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter Signup Widget */}
              <Card className="bg-gradient-to-br from-[#C53D39]/10 to-[#F1BA69]/10 shadow-sm">
                <CardHeader>
                  <CardTitle className="font-montserrat flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Newsletter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 font-poppins text-sm mb-4">
                    Subscribe to get the latest furniture trends and design tips delivered to your inbox.
                  </p>
                  <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                    <Input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Your email address"
                      className="font-poppins"
                      required
                    />
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
                    >
                      Subscribe
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Promotional Banner Widget */}
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-sm">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-[#F1BA69]" />
                  <h3 className="text-lg font-bold font-montserrat mb-2">New Collection</h3>
                  <p className="text-gray-300 font-poppins text-sm mb-4">
                    Discover our latest furniture pieces designed for modern living.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-gray-900 bg-transparent"
                  >
                    <Link href="/shop">Shop Now</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
