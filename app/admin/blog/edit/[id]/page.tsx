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

  const [blogData, setBlogData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category: "",
    status: "Draft",
    slug: "",
    metaTitle: "",
    metaDescription: "",
  })

  // Mock data loading - in real app, fetch by blogId
  useEffect(() => {
    const mockBlogData = {
      title: "Top 5 Timeless Wood Finishes for Modern Homes in 2024",
      excerpt:
        "Discover the most popular wood finishes that never go out of style and learn how to choose the perfect one for your furniture pieces.",
      content: `<p>When it comes to choosing the perfect wood finish for your furniture, the options can seem overwhelming. However, some finishes have stood the test of time and continue to be popular choices for modern homes.</p>

<h2>1. Classic Oak Finish</h2>
<p>Oak has been a favorite for centuries, and for good reason. Its distinctive grain pattern and warm honey tones make it versatile enough to work in both traditional and contemporary settings.</p>

<h2>2. Rich Walnut Stain</h2>
<p>Walnut offers a sophisticated, dark chocolate brown finish that exudes elegance and luxury. This premium wood finish is perfect for creating statement pieces.</p>`,
      author: "Sarah Johnson",
      category: "Design Tips",
      status: "Published",
      slug: "timeless-wood-finishes-2024",
      metaTitle: "Top 5 Timeless Wood Finishes for Modern Homes in 2024",
      metaDescription:
        "Discover the most popular wood finishes that never go out of style and learn how to choose the perfect one for your furniture pieces.",
    }

    setBlogData(mockBlogData)
    setFeaturedImage("/shop/products/dining-table-1.jpg")
    setTags(["Wood Finishes", "Interior Design", "Furniture", "Home Decor", "Design Tips"])
  }, [blogId])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setFeaturedImage(imageUrl)
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

  const handleSave = async (status: "Draft" | "Published") => {
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Blog Updated",
        description: `Blog post has been updated successfully.`,
      })

      router.push("/admin/blog")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update blog post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setBlogData((prev) => ({ ...prev, [field]: value }))
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
              onClick={() => handleSave("Draft")}
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
              onClick={() => handleSave("Published")}
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
                  <Label htmlFor="metaTitle" className="font-poppins">
                    Meta Title
                  </Label>
                  <Input
                    id="metaTitle"
                    value={blogData.metaTitle}
                    onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                    placeholder="SEO title for search engines"
                    className="font-poppins"
                  />
                </div>
                <div>
                  <Label htmlFor="metaDescription" className="font-poppins">
                    Meta Description
                  </Label>
                  <Textarea
                    id="metaDescription"
                    value={blogData.metaDescription}
                    onChange={(e) => handleInputChange("metaDescription", e.target.value)}
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
                  <Label htmlFor="author" className="font-poppins">
                    Author
                  </Label>
                  <Input
                    id="author"
                    value={blogData.author}
                    onChange={(e) => handleInputChange("author", e.target.value)}
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
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
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
