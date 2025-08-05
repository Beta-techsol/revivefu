"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Upload, X, Save, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useParams } from "next/navigation"

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const blogId = params.id as string

  const [featuredImage, setFeaturedImage] = useState<string>("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  const [blogData, setBlogData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author_name: "",
    category: "",
    status: "draft",
    slug: "",
    meta_title: "",
    meta_description: "",
  })

  // Fetch blog post data
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`/api/admin/blog/${blogId}`)
        const data = await response.json()

        if (data.success) {
          const post = data.data
          setBlogData({
            title: post.title || "",
            excerpt: post.excerpt || "",
            content: post.content || "",
            author_name: post.author_name || "",
            category: post.category || "",
            status: post.status || "draft",
            slug: post.slug || "",
            meta_title: post.meta_title || "",
            meta_description: post.meta_description || "",
          })
          setFeaturedImage(post.featured_image || "")
          setTags(Array.isArray(post.tags) ? post.tags : [])
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch blog post",
            variant: "destructive",
          })
          router.push("/admin/blog")
        }
      } catch (error) {
        console.error("Error fetching blog post:", error)
        toast({
          title: "Error",
          description: "Failed to fetch blog post",
          variant: "destructive",
        })
        router.push("/admin/blog")
      } finally {
        setLoading(false)
      }
    }

    if (blogId) {
      fetchBlogPost()
    }
  }, [blogId, router, toast])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    try {
      setImageUploading(true)
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setFeaturedImage(data.data.url)
        toast({
          title: "Image Uploaded",
          description: "Featured image uploaded successfully",
        })
      } else {
        throw new Error(data.error || "Upload failed")
      }
    } catch (error: any) {
      console.error("Upload error:", error)
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setImageUploading(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags((prev) => [...prev, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleSave = async (status: "draft" | "published") => {
    if (!blogData.title || !blogData.content) {
      toast({
        title: "Validation Error",
        description: "Please fill in the title and content fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const payload = {
        ...blogData,
        status,
        featured_image: featuredImage,
        tags,
      }

      const response = await fetch(`/api/admin/blog/${blogId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Blog Updated",
          description: `Blog post has been updated successfully.`,
        })
        router.push("/admin/blog")
      } else {
        throw new Error(data.error || "Failed to update blog post")
      }
    } catch (error: any) {
      console.error("Update error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update blog post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setBlogData((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#C53D39] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button asChild variant="outline" className="bg-white hover:bg-gray-50">
              <Link href="/admin/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-montserrat">Edit Blog Post</h1>
              <p className="text-gray-600 font-poppins">Update your blog article</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => handleSave("draft")}
              disabled={isLoading}
              variant="outline"
              className="bg-white hover:bg-gray-50"
            >
              Save as Draft
            </Button>
            <Button variant="outline" className="bg-white hover:bg-gray-50">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={() => handleSave("published")}
              disabled={isLoading}
              className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-montserrat">Blog Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="font-poppins">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    value={blogData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter blog post title"
                    className="font-poppins text-lg"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="excerpt" className="font-poppins">
                    Excerpt
                  </Label>
                  <Textarea
                    id="excerpt"
                    value={blogData.excerpt}
                    onChange={(e) => handleInputChange("excerpt", e.target.value)}
                    placeholder="Brief description of the blog post"
                    rows={3}
                    className="font-poppins"
                  />
                </div>
                <div>
                  <Label htmlFor="content" className="font-poppins">
                    Content *
                  </Label>
                  <Textarea
                    id="content"
                    value={blogData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    placeholder="Write your blog content here..."
                    rows={15}
                    className="font-poppins"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    You can use HTML tags for formatting (h2, h3, p, strong, em, blockquote, etc.)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-montserrat">Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                {featuredImage ? (
                  <div className="relative">
                    <Image
                      src={featuredImage || "/placeholder.svg"}
                      alt="Featured image"
                      width={600}
                      height={300}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setFeaturedImage("")}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {imageUploading ? (
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 border-4 border-[#C53D39] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600 font-poppins">Uploading image...</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 font-poppins mb-4">Upload featured image</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button asChild variant="outline" className="bg-white hover:bg-gray-50">
                          <label htmlFor="image-upload" className="cursor-pointer">
                            Choose Image
                          </label>
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-montserrat">SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="slug" className="font-poppins">
                    URL Slug
                  </Label>
                  <Input
                    id="slug"
                    value={blogData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="url-friendly-slug"
                    className="font-poppins"
                  />
                  <p className="text-sm text-gray-500 mt-1">URL: /blog/{blogData.slug || "your-slug-here"}</p>
                </div>
                <div>
                  <Label htmlFor="meta_title" className="font-poppins">
                    Meta Title
                  </Label>
                  <Input
                    id="meta_title"
                    value={blogData.meta_title}
                    onChange={(e) => handleInputChange("meta_title", e.target.value)}
                    placeholder="SEO title for search engines"
                    className="font-poppins"
                  />
                </div>
                <div>
                  <Label htmlFor="meta_description" className="font-poppins">
                    Meta Description
                  </Label>
                  <Textarea
                    id="meta_description"
                    value={blogData.meta_description}
                    onChange={(e) => handleInputChange("meta_description", e.target.value)}
                    placeholder="SEO description for search engines"
                    rows={3}
                    className="font-poppins"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-montserrat">Publish Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="author_name" className="font-poppins">
                    Author
                  </Label>
                  <Input
                    id="author_name"
                    value={blogData.author_name}
                    onChange={(e) => handleInputChange("author_name", e.target.value)}
                    placeholder="Author name"
                    className="font-poppins"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="font-poppins">
                    Category
                  </Label>
                  <select
                    id="category"
                    value={blogData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C53D39] font-poppins"
                  >
                    <option value="">Select Category</option>
                    <option value="Design Tips">Design Tips</option>
                    <option value="Furniture Care">Furniture Care</option>
                    <option value="Interior Trends">Interior Trends</option>
                    <option value="Room Makeovers">Room Makeovers</option>
                    <option value="Buying Guides">Buying Guides</option>
                    <option value="Sustainability">Sustainability</option>
                  </select>
                </div>
                <div>
                  <Label className="font-poppins">Status</Label>
                  <select
                    value={blogData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C53D39] font-poppins"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-montserrat">Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    className="font-poppins"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button onClick={addTag} variant="outline" className="bg-white hover:bg-gray-50">
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                      >
                        {tag}
                        <button onClick={() => removeTag(tag)} className="ml-2 text-gray-500 hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
