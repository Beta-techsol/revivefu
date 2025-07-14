"use client"

import { useState } from "react"
import { Search, Filter, Plus, Eye, Edit, Trash2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ProductDetailModal } from "@/components/admin/product-detail-modal"
import { DeleteConfirmationModal } from "@/components/admin/delete-confirmation-modal"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)
  const { toast } = useToast()

  const [products, setProducts] = useState([
    {
      id: "1",
      name: "Modern Sectional Sofa",
      price: 1299.99,
      originalPrice: 1599.99,
      category: "Living Room",
      stock: 15,
      status: "Active",
      image: "/shop/products/sofa-1.jpg",
      sku: "SOF-001",
      tags: ["Modern", "Sectional", "Fabric"],
      description: "A comfortable modern sectional sofa perfect for any living room.",
    },
    {
      id: "2",
      name: "Ergonomic Office Chair",
      price: 599.99,
      category: "Office",
      stock: 8,
      status: "Active",
      image: "/shop/products/chair-1.jpg",
      sku: "CHR-001",
      tags: ["Ergonomic", "Office", "Mesh"],
      description: "Professional ergonomic office chair with lumbar support.",
    },
    {
      id: "3",
      name: "Dining Table Set",
      price: 899.99,
      originalPrice: 1199.99,
      category: "Dining Room",
      stock: 0,
      status: "Out of Stock",
      image: "/shop/products/dining-table-1.jpg",
      sku: "TBL-001",
      tags: ["Dining", "Wood", "Set"],
      description: "Beautiful wooden dining table set for 6 people.",
    },
    {
      id: "4",
      name: "King Size Bed Frame",
      price: 799.99,
      category: "Bedroom",
      stock: 12,
      status: "Active",
      image: "/shop/products/bed-1.jpg",
      sku: "BED-001",
      tags: ["King", "Bed", "Frame"],
      description: "Sturdy king size bed frame with modern design.",
    },
    {
      id: "5",
      name: "Coffee Table",
      price: 299.99,
      category: "Living Room",
      stock: 25,
      status: "Active",
      image: "/shop/products/coffee-table-1.jpg",
      sku: "TBL-002",
      tags: ["Coffee", "Table", "Modern"],
      description: "Stylish coffee table with storage compartment.",
    },
    {
      id: "6",
      name: "Wardrobe Cabinet",
      price: 1099.99,
      category: "Bedroom",
      stock: 5,
      status: "Low Stock",
      image: "/shop/products/wardrobe-1.jpg",
      sku: "WRD-001",
      tags: ["Wardrobe", "Storage", "Cabinet"],
      description: "Spacious wardrobe cabinet with multiple compartments.",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Out of Stock":
        return "bg-red-100 text-red-800"
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800"
      case "Draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId))
    setDeleteProductId(null)
    toast({
      title: "Product Deleted",
      description: `Product has been deleted successfully`,
      variant: "destructive",
    })
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === "all" || product.category.toLowerCase() === categoryFilter.toLowerCase()
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 font-montserrat mb-2">Products Management</h1>
            <p className="text-gray-600 font-poppins">Manage your product inventory</p>
          </div>
          <div className="flex-shrink-0">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 font-medium px-6 py-3 h-12"
            >
              <Link href="/admin/products/new" className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <span className="font-poppins">Add Product</span>
              </Link>
            </Button>
          </div>
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
                    placeholder="Search products, SKU, tags..."
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
                    <DropdownMenuItem onClick={() => setCategoryFilter("living room")}>Living Room</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategoryFilter("bedroom")}>Bedroom</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategoryFilter("dining room")}>Dining Room</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategoryFilter("office")}>Office</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-[#C53D39] hover:bg-[#B12E2A]" : "bg-white hover:bg-gray-50"}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-[#C53D39] hover:bg-[#B12E2A]" : "bg-white hover:bg-gray-50"}
                >
                  List
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Display */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow duration-300 bg-white">
                <CardContent className="p-4">
                  <div className="relative aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 font-poppins line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-gray-500 font-poppins">SKU: {product.sku}</p>
                    <p className="text-sm text-gray-500 font-poppins">{product.category}</p>

                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-[#C53D39]">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 font-poppins">Stock: {product.stock}</p>

                    <div className="flex items-center justify-between pt-3 gap-2">
                      <Button
                        onClick={() => setSelectedProductId(product.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 bg-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:bg-green-50 hover:border-green-300 hover:text-green-600 bg-white transition-colors"
                      >
                        <Link href={`/admin/products/edit/${product.id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        onClick={() => setDeleteProductId(product.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:bg-red-50 hover:border-red-300 hover:text-red-600 bg-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="font-montserrat">Products ({filteredProducts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Product</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">SKU</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Price</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Stock</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 font-poppins">{product.name}</div>
                              <div className="text-sm text-gray-500 font-poppins">{product.tags.join(", ")}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900 font-poppins">{product.sku}</td>
                        <td className="py-3 px-4 text-gray-700 font-poppins">{product.category}</td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="font-semibold text-gray-900 font-poppins">${product.price}</div>
                            {product.originalPrice && (
                              <div className="text-sm text-gray-500 line-through font-poppins">
                                ${product.originalPrice}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700 font-poppins">{product.stock}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => setSelectedProductId(product.id)}
                              variant="outline"
                              size="sm"
                              className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 bg-white transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="hover:bg-green-50 hover:border-green-300 hover:text-green-600 bg-white transition-colors"
                            >
                              <Link href={`/admin/products/edit/${product.id}`}>
                                <Edit className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button
                              onClick={() => setDeleteProductId(product.id)}
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
        )}
      </div>

      {/* Modals */}
      {selectedProductId && (
        <ProductDetailModal
          isOpen={!!selectedProductId}
          onClose={() => setSelectedProductId(null)}
          productId={selectedProductId}
        />
      )}

      {deleteProductId && (
        <DeleteConfirmationModal
          isOpen={!!deleteProductId}
          onClose={() => setDeleteProductId(null)}
          onConfirm={() => handleDeleteProduct(deleteProductId)}
          title="Delete Product"
          description="Are you sure you want to delete this product? This action cannot be undone."
        />
      )}
    </div>
  )
}
