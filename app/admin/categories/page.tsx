"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DeleteConfirmationModal } from "@/components/admin/delete-confirmation-modal"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface Category {
  id: string
  name: string
  description: string
  image: string
  productCount: number
  status: "Active" | "Inactive"
}

export default function AdminCategoriesPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  })

  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Living Room",
      description: "Comfortable and stylish furniture for your living space",
      image: "/shop/products/sofa-1.jpg",
      productCount: 45,
      status: "Active",
    },
    {
      id: "2",
      name: "Bedroom",
      description: "Create your perfect sleeping sanctuary",
      image: "/shop/products/bed-1.jpg",
      productCount: 32,
      status: "Active",
    },
    {
      id: "3",
      name: "Dining Room",
      description: "Elegant dining furniture for memorable meals",
      image: "/shop/products/dining-table-1.jpg",
      productCount: 28,
      status: "Active",
    },
    {
      id: "4",
      name: "Office",
      description: "Professional furniture for productive workspaces",
      image: "/shop/products/chair-1.jpg",
      productCount: 19,
      status: "Inactive",
    },
  ])

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddCategory = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      image: formData.image || "/placeholder.svg",
      productCount: 0,
      status: "Active",
    }
    setCategories([...categories, newCategory])
    setFormData({ name: "", description: "", image: "" })
    setShowAddModal(false)
    toast({
      title: "Category Added",
      description: `${formData.name} has been added successfully`,
      variant: "success",
    })
  }

  const handleEditCategory = () => {
    if (!selectedCategory) return

    setCategories(
      categories.map((cat) =>
        cat.id === selectedCategory.id
          ? { ...cat, name: formData.name, description: formData.description, image: formData.image }
          : cat,
      ),
    )
    setShowEditModal(false)
    setSelectedCategory(null)
    setFormData({ name: "", description: "", image: "" })
    toast({
      title: "Category Updated",
      description: `${formData.name} has been updated successfully`,
      variant: "success",
    })
  }

  const handleDeleteCategory = () => {
    if (!selectedCategory) return

    setCategories(categories.filter((cat) => cat.id !== selectedCategory.id))
    setShowDeleteModal(false)
    setSelectedCategory(null)
    toast({
      title: "Category Deleted",
      description: `${selectedCategory.name} has been deleted successfully`,
      variant: "success",
    })
  }

  const openEditModal = (category: Category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      image: category.image,
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category)
    setShowDeleteModal(true)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-montserrat">Categories Management</h1>
          <p className="text-gray-600 font-poppins">Organize your products into categories</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="relative aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
                <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      category.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {category.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 font-poppins">{category.name}</h3>
                <p className="text-sm text-gray-600 font-poppins line-clamp-2">{category.description}</p>
                <p className="text-sm text-gray-500 font-poppins">{category.productCount} products</p>

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

      {/* Add Category Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-montserrat">Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="font-poppins">
                Category Name
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
              <Label htmlFor="image" className="font-poppins">
                Image URL
              </Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="Enter image URL"
              />
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
                Category Name
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
              <Label htmlFor="edit-image" className="font-poppins">
                Image URL
              </Label>
              <Input
                id="edit-image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="Enter image URL"
              />
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
