"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Package, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
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
      })

      if (response.success) {
        await fetchCategories()
        setFormData({ name: "", description: "", image_url: "" })
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
      })

      if (response.success) {
        await fetchCategories()
        setShowEditModal(false)
        setSelectedCategory(null)
        setFormData({ name: "", description: "", image_url: "" })
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
    if (!selectedCategory || selectedProducts.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select products to assign",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await apiClient.bulkAssignProductsToCategory(selectedCategory.id, selectedProducts)

      if (response.success) {
        await fetchCategories()
        setShowBulkAssignModal(false)
        setSelectedProducts([])
        setSelectedCategory(null)
        toast({
          title: "Products Assigned",
          description: `${selectedProducts.length} products assigned to ${selectedCategory.name}`,
        })
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to assign products",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign products",
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
    setShowBulkAssignModal(true)
  }

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const resetForm = () => {
    setFormData({ name: "", description: "", image_url: "" })
  }

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
                  <h3 className="font-semibold text-gray-900 font-poppins">{category.name}</h3>
                  <p className="text-sm text-gray-600 font-poppins line-clamp-2">{category.description}</p>
                  <p className="text-sm text-gray-500 font-poppins">{category.product_count} products</p>

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
        <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="font-montserrat">Assign Products to {selectedCategory?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-gray-600 font-poppins">Select products to assign to this category:</div>
            <div className="max-h-96 overflow-y-auto border rounded-lg">
              {allProducts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>No products available</p>
                </div>
              ) : (
                allProducts.map((product) => (
                  <div key={product.id} className="flex items-center space-x-3 p-3 border-b hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleProductSelection(product.id)}
                      className="rounded border-gray-300 text-[#C53D39] focus:ring-[#C53D39]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{product.name}</div>
                      <div className="text-xs text-gray-500">SKU: {product.sku}</div>
                    </div>
                    <div className="text-sm text-gray-600">${product.price}</div>
                  </div>
                ))
              )}
            </div>
            <div className="text-sm text-gray-600 font-poppins">{selectedProducts.length} products selected</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkAssignModal(false)} className="bg-transparent">
              Cancel
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
