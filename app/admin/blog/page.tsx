"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DeleteConfirmationModal } from "@/components/admin/delete-confirmation-modal"
import { Plus, Search, Edit, Trash2, Eye, Calendar, User, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  featured_image: string
  author_name: string
  status: string
  is_featured: boolean
  category: string
  published_at: string
  created_at: string
  views: number
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; postId: number | null }>({
    isOpen: false,
    postId: null,
  })
  const { toast } = useToast()

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(categoryFilter !== "all" && { category: categoryFilter }),
      })

      console.log("Fetching posts with params:", params.toString())

      const response = await fetch(`/api/admin/blog?${params}`)
      const data = await response.json()

      console.log("API response:", data)

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      if (data.success) {
        setPosts(data.posts || [])
        setPagination(data.pagination)
      } else {
        throw new Error(data.error || "Failed to fetch posts")
      }
    } catch (error: any) {
      console.error("Error fetching posts:", error)
      setError(error.message)
      toast({
        title: "Error",
        description: `Failed to fetch blog posts: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [pagination.page, search, statusFilter, categoryFilter])

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete post")
      }

      if (data.success) {
        toast({
          title: "Success",
          description: "Blog post deleted successfully",
        })
        fetchPosts() // Refresh the list
      } else {
        throw new Error(data.error || "Failed to delete post")
      }
    } catch (error: any) {
      console.error("Error deleting post:", error)
      toast({
        title: "Error",
        description: `Failed to delete blog post: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      published: "default",
      draft: "secondary",
      archived: "outline",
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status}</Badge>
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Blog Posts</h1>
            <p className="text-muted-foreground">Manage your blog content</p>
          </div>
          <Link href="/admin/blog/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Error loading blog posts</h3>
                <p className="text-sm">{error}</p>
                <Button variant="outline" size="sm" className="mt-2 bg-transparent" onClick={fetchPosts}>
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">Manage your blog content</p>
        </div>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Design Tips">Design Tips</SelectItem>
                <SelectItem value="Furniture Care">Furniture Care</SelectItem>
                <SelectItem value="Room Makeovers">Room Makeovers</SelectItem>
                <SelectItem value="Sustainability">Sustainability</SelectItem>
                <SelectItem value="Interior Trends">Interior Trends</SelectItem>
                <SelectItem value="Buying Guides">Buying Guides</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading blog posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No blog posts found</p>
              <Link href="/admin/blog/new">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first post
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Post</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {post.featured_image && (
                          <Image
                            src={post.featured_image || "/placeholder.svg"}
                            alt={post.title}
                            width={60}
                            height={40}
                            className="rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{post.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {post.excerpt ? `${post.excerpt.substring(0, 60)}...` : "No excerpt"}
                          </div>
                          {post.is_featured && (
                            <Badge variant="outline" className="mt-1">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {post.author_name}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(post.status)}</TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        {post.views || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post.published_at || post.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/blog/edit/${post.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteModal({ isOpen: true, postId: post.id })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={pagination.page === pagination.totalPages}
            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </Button>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, postId: null })}
        onConfirm={() => {
          if (deleteModal.postId) {
            handleDelete(deleteModal.postId)
            setDeleteModal({ isOpen: false, postId: null })
          }
        }}
        title="Delete Blog Post"
        description="Are you sure you want to delete this blog post? This action cannot be undone."
      />
    </div>
  )
}
