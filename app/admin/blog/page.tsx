"use client"

import { useState } from "react"
import { Search, Filter, Plus, Eye, Edit, Trash2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DeleteConfirmationModal } from "@/components/admin/delete-confirmation-modal"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"

export default function AdminBlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteBlogId, setDeleteBlogId] = useState<string | null>(null)
  const { toast } = useToast()

  const [blogPosts, setBlogPosts] = useState([
    {
      id: "1",
      title: "Top 5 Timeless Wood Finishes for Modern Homes in 2024",
      excerpt:
        "Discover the most popular wood finishes that never go out of style and learn how to choose the perfect one for your furniture pieces.",
      author: "Sarah Johnson",
      date: "January 15, 2024",
      category: "Design Tips",
      status: "Published",
      image: "/shop/products/dining-table-1.jpg",
      slug: "timeless-wood-finishes-2024",
      views: 1250,
    },
    {
      id: "2",
      title: "How to Care for Leather Furniture: A Complete Guide",
      excerpt:
        "Learn the essential tips and techniques to keep your leather furniture looking pristine for years to come.",
      author: "Michael Chen",
      date: "January 12, 2024",
      category: "Furniture Care",
      status: "Published",
      image: "/shop/products/sofa-1.jpg",
      slug: "leather-furniture-care-guide",
      views: 890,
    },
    {
      id: "3",
      title: "Small Space, Big Style: Maximizing Your Studio Apartment",
      excerpt:
        "Transform your compact living space into a stylish and functional home with these expert interior design tips.",
      author: "Emma Rodriguez",
      date: "January 10, 2024",
      category: "Room Makeovers",
      status: "Draft",
      image: "/shop/products/chair-1.jpg",
      slug: "small-space-big-style",
      views: 0,
    },
    {
      id: "4",
      title: "Sustainable Furniture: Why Eco-Friendly Choices Matter",
      excerpt:
        "Explore the environmental impact of furniture production and discover how choosing sustainable options can make a difference.",
      author: "David Green",
      date: "January 8, 2024",
      category: "Sustainability",
      status: "Published",
      image: "/shop/products/bed-1.jpg",
      slug: "sustainable-furniture-choices",
      views: 675,
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800"
      case "Draft":
        return "bg-yellow-100 text-yellow-800"
      case "Archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDeleteBlog = (blogId: string) => {
    setBlogPosts((prev) => prev.filter((post) => post.id !== blogId))
    setDeleteBlogId(null)
    toast({
      title: "Blog Post Deleted",
      description: "Blog post has been deleted successfully",
      variant: "destructive",
    })
  }

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || post.category.toLowerCase() === categoryFilter.toLowerCase()
    const matchesStatus = statusFilter === "all" || post.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-montserrat">Blog Management</h1>
            <p className="text-gray-600 font-poppins">Manage your blog posts and articles</p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Link href="/admin/blog/new">
              <Plus className="w-5 h-5 mr-2" />
              Add New Post
            </Link>
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search posts, authors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C53D39] focus:border-transparent font-poppins"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center space-x-2 bg-white hover:bg-gray-50">
                      <Filter className="w-4 h-4" />
                      <span>Category: {categoryFilter === "all" ? "All" : categoryFilter}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setCategoryFilter("all")}>All</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategoryFilter("design tips")}>Design Tips</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategoryFilter("furniture care")}>
                      Furniture Care
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategoryFilter("room makeovers")}>
                      Room Makeovers
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategoryFilter("sustainability")}>
                      Sustainability
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center space-x-2 bg-white hover:bg-gray-50">
                      <span>Status: {statusFilter === "all" ? "All" : statusFilter}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("published")}>Published</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("draft")}>Draft</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("archived")}>Archived</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blog Posts Table */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="font-montserrat">Blog Posts ({filteredPosts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Post</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Author</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Views</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={post.image || "/placeholder.svg"}
                              alt={post.title}
                              width={64}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 font-poppins line-clamp-1">{post.title}</div>
                            <div className="text-sm text-gray-500 font-poppins line-clamp-1">{post.excerpt}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-poppins">{post.author}</td>
                      <td className="py-3 px-4 text-gray-700 font-poppins">{post.category}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-poppins">{post.views.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-600 font-poppins">{post.date}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 bg-white transition-colors"
                          >
                            <Link href={`/blog/${post.slug}`} target="_blank">
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="hover:bg-green-50 hover:border-green-300 hover:text-green-600 bg-white transition-colors"
                          >
                            <Link href={`/admin/blog/edit/${post.id}`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            onClick={() => setDeleteBlogId(post.id)}
                            variant="outline"
                            size="sm"
                            className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 bg-white transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteBlogId && (
        <DeleteConfirmationModal
          isOpen={!!deleteBlogId}
          onClose={() => setDeleteBlogId(null)}
          onConfirm={() => handleDeleteBlog(deleteBlogId)}
          title="Delete Blog Post"
          description="Are you sure you want to delete this blog post? This action cannot be undone."
        />
      )}
    </div>
  )
}
