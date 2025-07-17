"use client"

import { useState, useEffect } from "react"
import { Calendar, User, ArrowLeft, Share2, Clock, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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
  meta_title?: string
  meta_description?: string
}

interface RelatedPost {
  id: number
  title: string
  slug: string
  excerpt: string
  featured_image: string
  author_name: string
  published_at: string
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string

  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/blog/${slug}`)
        const data = await response.json()

        if (data.success) {
          setPost(data.post)
          setRelatedPosts(data.relatedPosts || [])
        } else {
          setError(data.error || "Blog post not found")
        }
      } catch (error: any) {
        console.error("Error fetching blog post:", error)
        setError("Failed to load blog post")
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchPost()
    }
  }, [slug])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
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

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <Card>
            <CardContent className="p-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
              <p className="text-gray-600 mb-6">{error || "The article you're looking for doesn't exist."}</p>
              <Button asChild className="bg-[#C53D39] hover:bg-[#B12E2A]">
                <Link href="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <Image src={post.featured_image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>

        {/* Back Button */}
        <div className="absolute top-8 left-8">
          <Button asChild variant="secondary" className="bg-white/90 hover:bg-white">
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* Article Info */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="max-w-4xl">
            <Badge className={getCategoryColor(post.category)}>{post.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-4 font-montserrat">{post.title}</h1>
            <div className="flex items-center space-x-6 text-white/90">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="font-poppins">{post.author_name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span className="font-poppins">{formatDate(post.published_at)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className="font-poppins">5 min read</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span className="font-poppins">{post.views} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Excerpt */}
              {post.excerpt && (
                <div className="text-xl text-gray-600 font-poppins leading-relaxed mb-8 p-6 bg-gray-50 rounded-lg border-l-4 border-[#C53D39]">
                  {post.excerpt}
                </div>
              )}

              {/* Article Content */}
              <div
                className="prose prose-lg max-w-none font-poppins"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 font-montserrat">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 font-montserrat">Share this article</h3>
                  <Button variant="outline" className="bg-white hover:bg-gray-50">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {/* Author Info */}
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2 font-montserrat">About the Author</h3>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#C53D39] rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 font-poppins">{post.author_name}</p>
                        <p className="text-sm text-gray-600 font-poppins">Content Writer</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-4 font-montserrat">Related Articles</h3>
                      <div className="space-y-4">
                        {relatedPosts.map((relatedPost) => (
                          <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="block group">
                            <div className="flex space-x-3">
                              <div className="relative w-16 h-16 flex-shrink-0">
                                <Image
                                  src={relatedPost.featured_image || "/placeholder.svg"}
                                  alt={relatedPost.title}
                                  fill
                                  className="object-cover rounded-lg"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 group-hover:text-[#C53D39] transition-colors line-clamp-2 font-poppins">
                                  {relatedPost.title}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1 font-poppins">
                                  {formatDate(relatedPost.published_at)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
