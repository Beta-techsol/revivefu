"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Package, Upload, X, ChevronRight, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DeleteConfirmationModal } from "@/components/admin/delete-confirmation-modal"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import Image from "next/image"

interface Category {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  product_count: number
  is_active: boolean
  parent_id?: string
  parent_name?: string
  sort_order?: number
}

interface Product {
  id: string
  name: string
  sku: string
  price: number
  stock_quantity: number
  status: string
  images: string
}

export default function AdminCategoriesPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showBulkAssignModal, setShowBulkAssignModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [assignedProducts, setAssignedProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [productSearchTerm, setProductSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
    parent_id: null,
  })

  useEffect(() => {
    fetchCategories()
    fetchAllProducts()
  }, [])

  const fetchCategories = async () => {
    try {
      console.log("Fetching categories...")
      const response = await apiClient.getCategories()
      console.log("Categories response:", response)

      if (response.success && response.data) {
        const categoriesData = Array.isArray(response.data) ? response.data : []
        console.log("Setting categories:", categoriesData)
        setCategories(categoriesData)
      } else {
        console.error("Categories response error:", response)
        setCategories([])
        toast({
          title: "Error",
          description: response.error || "Failed to fetch categories",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      setCategories([])
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAllProducts = async () => {
    try {
      const response = await apiClient.getProducts({ limit: 1000 })
      if (response.success && response.data) {
        const productsData = Array.isArray(response.data) ? response.data : response.data.products || []
        setAllProducts(productsData)
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
      setAllProducts([])
    }
  }

  const fetchAssignedProducts = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}/products`)
      const data = await response.json()
      if (data.success) {
        setAssignedProducts(data.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch assigned products:", error)
      setAssignedProducts([])
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const result = await apiClient.uploadImage(file, "categories")
      if (result.url) {
        setFormData((prev) => ({ ...prev, image_url: result.url }))
        toast({
          title: "Image Uploaded",
          description: "Category image uploaded successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image_url: "" }))
  }

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const parentCategories = categories.filter((cat) => !cat.parent_id)

  const handleAddCategory = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await apiClient.createCategory({
        name: formData.name,
        description: formData.description,
        image_url: formData.image_url,
        parent_id: formData.parent_id,
      })

      if (response.success) {
        await fetchCategories()
        setFormData({ name: "", description: "", image_url: "", parent_id: null })
        setShowAddModal(false)
        toast({
          title: "Category Added",
          description: `${formData.name} has been added successfully`,
        })
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to add category",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      })
    }
  }

  const handleEditCategory = async () => {
    if (!selectedCategory || !formData.name.trim()) return

    try {
      const response = await apiClient.updateCategory(selectedCategory.id, {
        name: formData.name,
        description: formData.description,
        image_url: formData.image_url,
        status: "active",
        parent_id: formData.parent_id,
      })

      if (response.success) {
        await fetchCategories()
        setShowEditModal(false)
        setSelectedCategory(null)
        setFormData({ name: "", description: "", image_url: "", parent_id: null })
        toast({
          title: "Category Updated",
          description: `${formData.name} has been updated successfully`,
        })
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update category",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return

    try {
      const response = await apiClient.deleteCategory(selectedCategory.id)

      if (response.success) {
        await fetchCategories()
        setShowDeleteModal(false)
        setSelectedCategory(null)
        toast({
          title: "Category Deleted",
          description: `${selectedCategory.name} has been deleted successfully`,
        })
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete category",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  const handleBulkAssign = async () => {
    console.log("[v0] handleBulkAssign called")
    console.log("[v0] selectedCategory:", selectedCategory)
    console.log("[v0] selectedProducts:", selectedProducts)

    if (!selectedCategory || selectedProducts.length === 0) {
      console.log("[v0] Validation failed - no category or no products selected")
      toast({
        title: "Validation Error",
        description: "Please select products to assign",
        variant: "destructive",
      })
      return
    }

    try {
      console.log("[v0] Making API call to bulk assign products")
      const response = await apiClient.bulkAssignProductsToCategory(selectedCategory.id, selectedProducts)
      console.log("[v0] API response:", response)

      if (response.success) {
        console.log("[v0] Bulk assign successful, refreshing data")
        await fetchCategories()
        await fetchAssignedProducts(selectedCategory.id)
        setSelectedProducts([])
        toast({
          title: "Products Assigned",
          description: response.message || `Products assigned to ${selectedCategory.name}`,
        })
      } else {
        console.log("[v0] Bulk assign failed:", response.error)
        toast({
          title: "Error",
          description: response.error || "Failed to assign products",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Bulk assign error:", error)
      toast({
        title: "Error",
        description: "Failed to assign products",
        variant: "destructive",
      })
    }
  }

  const handleRemoveProducts = async (productIds: string[]) => {
    if (!selectedCategory || productIds.length === 0) return

    try {
      const response = await fetch(`/api/admin/categories/${selectedCategory.id}/products`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds }),
      })

      const data = await response.json()

      if (data.success) {
        await fetchCategories()
        await fetchAssignedProducts(selectedCategory.id)
        toast({
          title: "Products Removed",
          description: data.message,
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to remove products",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove products",
        variant: "destructive",
      })
    }
  }

  const openEditModal = (category: Category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      image_url: category.image_url || "",
      parent_id: category.parent_id || null,
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category)
    setShowDeleteModal(true)
  }

  const openBulkAssignModal = (category: Category) => {
    setSelectedCategory(category)
    setSelectedProducts([])
    setProductSearchTerm("")
    fetchAssignedProducts(category.id)
    setShowBulkAssignModal(true)
  }

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const resetForm = () => {
    setFormData({ name: "", description: "", image_url: "", parent_id: null })
  }

  const filteredProducts = allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(productSearchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#C53D39] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-montserrat">Categories Management</h1>
          <p className="text-gray-600 font-poppins">
            Organize your products into categories ({categories.length} total)
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setShowAddModal(true)
          }}
          className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-500">
              {categories.length === 0 ? (
                <>
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold mb-2">No categories yet</h3>
                  <p className="mb-4">Create your first category to organize your products</p>
                  <Button
                    onClick={() => {
                      resetForm()
                      setShowAddModal(true)
                    }}
                    className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Category
                  </Button>
                </>
              ) : (
                <>
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold mb-2">No categories found</h3>
                  <p>Try adjusting your search terms</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="relative aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={category.image_url || "/placeholder.svg?height=200&width=200"}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        category.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {category.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 font-poppins">{category.name}</h3>
                    {category.parent_name && (
                      <div className="flex items-center text-xs text-gray-500">
                        <ChevronRight className="w-3 h-3" />
                        <span>{category.parent_name}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 font-poppins line-clamp-2">{category.description}</p>
                  <p className="text-sm text-gray-500">{category.product_count} products</p>

                  <div className="flex items-center space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(category)}
                      className="flex-1 hover:bg-green-50 hover:border-green-300 hover:text-green-600 bg-transparent"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openBulkAssignModal(category)}
                      className="flex-1 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 bg-transparent"
                    >
                      <Package className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteModal(category)}
                      className="flex-1 hover:bg-red-50 hover:border-red-300 hover:text-red-600 bg-transparent"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-montserrat">Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="font-poppins">
                Category Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>
            <div>
              <Label htmlFor="parent" className="font-poppins">
                Parent Category
              </Label>
              <Select
                value={formData.parent_id}
                onValueChange={(value) => setFormData({ ...formData, parent_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>No Parent (Top Level)</SelectItem>
                  {parentCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description" className="font-poppins">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter category description"
                rows={3}
              />
            </div>
            <div>
              <Label className="font-poppins">Category Image</Label>
              <div className="space-y-4">
                {formData.image_url ? (
                  <div className="relative">
                    <Image
                      src={formData.image_url || "/placeholder.svg"}
                      alt="Category preview"
                      width={200}
                      height={150}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      {uploadingImage ? "Uploading..." : "Upload category image"}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload-add"
                      disabled={uploadingImage}
                    />
                    <Button asChild variant="outline" size="sm" disabled={uploadingImage}>
                      <label htmlFor="image-upload-add" className="cursor-pointer">
                        {uploadingImage ? "Uploading..." : "Choose Image"}
                      </label>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleAddCategory}
              disabled={!formData.name.trim()}
              className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
            >
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-montserrat">Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name" className="font-poppins">
                Category Name *
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>
            <div>
              <Label htmlFor="edit-parent" className="font-poppins">
                Parent Category
              </Label>
              <Select
                value={formData.parent_id}
                onValueChange={(value) => setFormData({ ...formData, parent_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>No Parent (Top Level)</SelectItem>
                  {parentCategories
                    .filter((cat) => cat.id !== selectedCategory?.id)
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-description" className="font-poppins">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter category description"
                rows={3}
              />
            </div>
            <div>
              <Label className="font-poppins">Category Image</Label>
              <div className="space-y-4">
                {formData.image_url ? (
                  <div className="relative">
                    <Image
                      src={formData.image_url || "/placeholder.svg"}
                      alt="Category preview"
                      width={200}
                      height={150}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      {uploadingImage ? "Uploading..." : "Upload category image"}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload-edit"
                      disabled={uploadingImage}
                    />
                    <Button asChild variant="outline" size="sm" disabled={uploadingImage}>
                      <label htmlFor="image-upload-edit" className="cursor-pointer">
                        {uploadingImage ? "Uploading..." : "Choose Image"}
                      </label>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleEditCategory}
              disabled={!formData.name.trim()}
              className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
            >
              Update Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Assign Products Modal */}
      <Dialog open={showBulkAssignModal} onOpenChange={setShowBulkAssignModal}>
        <DialogContent className="w-full max-w-4xl max-h-[90vh] mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="font-montserrat">Manage Products for {selectedCategory?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 overflow-y-auto flex-1">
            {assignedProducts.length > 0 && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium text-sm mb-3 text-gray-700">
                  Currently Assigned Products ({assignedProducts.length})
                </h4>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {assignedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between text-sm bg-white p-2 rounded border"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="font-medium truncate block">{product.name}</span>
                        <span className="text-gray-500 text-xs">({product.sku})</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveProducts([product.id])}
                        className="text-red-600 hover:bg-red-50 hover:border-red-300 ml-2 flex-shrink-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-sm text-gray-600 font-poppins">
              Select additional products to assign to this category:
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products by name or SKU..."
                value={productSearchTerm}
                onChange={(e) => setProductSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="max-h-80 overflow-y-auto border rounded-lg">
              {filteredProducts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">
                    {productSearchTerm ? `No products found matching "${productSearchTerm}"` : "No products available"}
                  </p>
                </div>
              ) : (
                filteredProducts.map((product) => {
                  const isAssigned = assignedProducts.some((ap) => ap.id === product.id)
                  return (
                    <div
                      key={product.id}
                      className={`flex items-center space-x-3 p-3 border-b hover:bg-gray-50 ${isAssigned ? "bg-green-50" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                        className="rounded border-gray-300 text-[#C53D39] focus:ring-[#C53D39] flex-shrink-0"
                        disabled={isAssigned}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm flex items-center gap-2 flex-wrap">
                          <span className="truncate">{product.name}</span>
                          {isAssigned && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex-shrink-0">
                              Already Assigned
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">SKU: {product.sku}</div>
                      </div>
                      <div className="text-sm text-gray-600 flex-shrink-0">${product.price}</div>
                    </div>
                  )
                })
              )}
            </div>
            <div className="text-sm text-gray-600 font-poppins">
              {selectedProducts.length} products selected
              {productSearchTerm && (
                <span className="ml-2 text-gray-500">
                  ({filteredProducts.length} of {allProducts.length} shown)
                </span>
              )}
            </div>
          </div>
          <DialogFooter className="flex-shrink-0 flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowBulkAssignModal(false)} className="bg-transparent">
              Close
            </Button>
            <Button
              onClick={handleBulkAssign}
              disabled={selectedProducts.length === 0}
              className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
            >
              Assign {selectedProducts.length} Products
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        description="This will permanently delete the category and may affect associated products."
        itemName={selectedCategory?.name || ""}
      />
    </div>
  )
}
