"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProductDetailModal } from "@/components/admin/product-detail-modal"
import { DeleteConfirmationModal } from "@/components/admin/delete-confirmation-modal"
import { Plus, Search, Edit, Trash2, Eye, Upload, RefreshCw } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: number
  compare_price?: number
  category_name: string
  stock_quantity: number
  is_featured: boolean
  is_trending: boolean
  is_best_seller: boolean
  is_hot_selling: boolean
  is_deal_of_day: boolean
  is_latest: boolean
  created_at: string
  images: string | string[]
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const itemsPerPage = 10

  useEffect(() => {
    fetchProducts()
  }, [currentPage, searchTerm])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await fetch(`/api/admin/products?${params}`)
      const data = await response.json()

      if (data.success) {
        setProducts(data.products || [])
        setTotalPages(Math.ceil((data.total || 0) / itemsPerPage))
        setTotalProducts(data.total || 0)
      } else {
        console.error("Failed to fetch products:", data.error)
        setProducts([])
        setTotalPages(1)
        setTotalProducts(0)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
      setTotalPages(1)
      setTotalProducts(0)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        setProducts(products.filter((p) => p.id !== productId))
        setProductToDelete(null)
        setTotalProducts((prev) => prev - 1)
      } else {
        console.error("Failed to delete product:", data.error)
        alert("Failed to delete product")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Error deleting product")
    }
  }

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString()}`
  }

  const getProductImages = (images: string | string[]) => {
    if (typeof images === "string") {
      try {
        const parsed = JSON.parse(images)
        return Array.isArray(parsed) ? parsed : [images]
      } catch {
        return [images]
      }
    }
    return Array.isArray(images) ? images : []
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchProducts()
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Previous button
    pages.push(
      <Button
        key="prev"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>,
    )

    // First page
    if (startPage > 1) {
      pages.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(1)}
        >
          1
        </Button>,
      )
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="px-2">
            ...
          </span>,
        )
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>,
      )
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="px-2">
            ...
          </span>,
        )
      }
      pages.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Button>,
      )
    }

    // Next button
    pages.push(
      <Button
        key="next"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>,
    )

    return pages
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#C53D39] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog ({totalProducts} total products)</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/upload">
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Bulk Upload
            </Button>
          </Link>
          <Link href="/admin/products/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search products by name, category, or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setCurrentPage(1)
                fetchProducts()
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products List</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const productImages = getProductImages(product.images)
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={productImages[0] || "/placeholder.svg?height=40&width=40"}
                              alt={product.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-gray-500">ID: {product.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{product.category_name}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{formatPrice(product.price)}</div>
                            {product.compare_price && (
                              <div className="text-sm text-gray-500 line-through">
                                {formatPrice(product.compare_price)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.stock_quantity > 0 ? "default" : "destructive"}>
                            {product.stock_quantity} units
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {product.is_featured && <Badge variant="secondary">Featured</Badge>}
                            {product.is_trending && <Badge variant="secondary">Trending</Badge>}
                            {product.is_best_seller && <Badge variant="secondary">Best Seller</Badge>}
                            {product.is_hot_selling && <Badge variant="secondary">Hot</Badge>}
                            {product.is_deal_of_day && <Badge variant="secondary">Deal</Badge>}
                            {product.is_latest && <Badge variant="secondary">Latest</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(product)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Link href={`/admin/products/edit/${product.id}`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={() => setProductToDelete(product)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
                </div>
                <div className="flex items-center space-x-2">{renderPagination()}</div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <DeleteConfirmationModal
          isOpen={!!productToDelete}
          onClose={() => setProductToDelete(null)}
          onConfirm={() => handleDeleteProduct(productToDelete.id)}
          title="Delete Product"
          message={`Are you sure you want to delete "${productToDelete.name}"? This action cannot be undone.`}
        />
      )}
    </div>
  )
}
