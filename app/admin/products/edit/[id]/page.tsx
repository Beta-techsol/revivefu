"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, FileText } from "lucide-react"
import { toast } from "sonner"

interface Category {
  id: string
  name: string
  slug: string
}

interface RoomType {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  price: number
  compare_price?: number
  cost_price?: number
  description: string
  short_description: string
  sku: string
  status: string
  stock_quantity: number
  images: string[]
  tags: string[]
  material: string
  color: string
  brand: string
  is_featured: boolean
  is_trending: boolean
  is_best_seller: boolean
  is_hot_selling: boolean
  is_deal_of_day: boolean
  is_latest: boolean
  room_type_id?: string
  category_id?: string
  room_type_name?: string
  category_name?: string
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [product, setProduct] = useState<Product>({
    id: "",
    name: "",
    price: 0,
    compare_price: 0,
    cost_price: 0,
    description: "",
    short_description: "",
    sku: "",
    status: "active",
    stock_quantity: 0,
    images: [],
    tags: [],
    material: "",
    color: "",
    brand: "",
    is_featured: false,
    is_trending: false,
    is_best_seller: false,
    is_hot_selling: false,
    is_deal_of_day: false,
    is_latest: false,
    room_type_id: "",
    category_id: "",
  })

  useEffect(() => {
    fetchProduct()
    fetchCategories()
    fetchRoomTypes()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      console.log("Fetching product with ID:", params.id)

      const response = await fetch(`/api/admin/products/${params.id}`)
      const data = await response.json()

      console.log("Product API response:", data)

      if (data.success && data.product) {
        const productData = data.product
        setProduct({
          ...productData,
          price: Number(productData.price) || 0,
          compare_price: Number(productData.compare_price) || 0,
          cost_price: Number(productData.cost_price) || 0,
          stock_quantity: Number(productData.stock_quantity) || 0,
          images: Array.isArray(productData.images) ? productData.images : [],
          tags: Array.isArray(productData.tags) ? productData.tags : [],
          room_type_id: productData.room_type_id?.toString() || "",
          category_id: productData.category_id?.toString() || "",
        })
        console.log("Product loaded successfully:", productData.name)
      } else {
        console.error("Failed to fetch product:", data.error)
        toast.error("Failed to load product")
        router.push("/admin/products")
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      toast.error("Failed to load product")
      router.push("/admin/products")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      if (data.success) {
        setCategories(data.categories)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchRoomTypes = async () => {
    try {
      const response = await fetch("/api/room-types")
      const data = await response.json()
      if (data.success) {
        setRoomTypes(data.roomTypes)
      }
    } catch (error) {
      console.error("Error fetching room types:", error)
    }
  }

  const handleSubmit = async (isDraft = false) => {
    try {
      setIsSaving(true)

      const productData = {
        ...product,
        status: isDraft ? "draft" : product.status,
        room_type_id: product.room_type_id || null,
        category_id: product.category_id || null,
      }

      console.log("Updating product:", productData)

      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(isDraft ? "Product saved as draft" : "Product updated successfully")
        router.push("/admin/products")
      } else {
        toast.error(data.error || "Failed to update product")
      }
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error("Failed to update product")
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setProduct((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#C53D39] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/products")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-gray-600">Update product information</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => handleSubmit(true)}
              disabled={saving}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Save as Draft
            </Button>
            <Button
              onClick={() => handleSubmit(false)}
              disabled={saving}
              className="flex items-center gap-2 bg-[#C53D39] hover:bg-[#A12E2A]"
            >
              <Save className="w-4 h-4" />
              {saving ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Basic Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={product.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="short_description">Short Description</Label>
                  <Textarea
                    id="short_description"
                    value={product.short_description}
                    onChange={(e) => handleInputChange("short_description", e.target.value)}
                    placeholder="Brief product description"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={product.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter detailed product description"
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      value={product.sku}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                      placeholder="Enter SKU"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={product.category_id}
                      onValueChange={(value) => handleInputChange("category_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="material">Material</Label>
                    <Input
                      id="material"
                      value={product.material}
                      onChange={(e) => handleInputChange("material", e.target.value)}
                      placeholder="e.g., Wood, Metal"
                    />
                  </div>

                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={product.color}
                      onChange={(e) => handleInputChange("color", e.target.value)}
                      placeholder="e.g., Brown, Black"
                    />
                  </div>

                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={product.brand}
                      onChange={(e) => handleInputChange("brand", e.target.value)}
                      placeholder="Enter brand name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="room_type">Room Type</Label>
                  <Select
                    value={product.room_type_id}
                    onValueChange={(value) => handleInputChange("room_type_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Room Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.map((roomType) => (
                        <SelectItem key={roomType.id} value={roomType.id}>
                          {roomType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Pricing & Inventory */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="price">Base Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={product.price}
                    onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="compare_price">Compare at Price</Label>
                  <Input
                    id="compare_price"
                    type="number"
                    step="0.01"
                    value={product.compare_price}
                    onChange={(e) => handleInputChange("compare_price", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="cost_price">Cost per Item</Label>
                  <Input
                    id="cost_price"
                    type="number"
                    step="0.01"
                    value={product.cost_price}
                    onChange={(e) => handleInputChange("cost_price", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="stock_quantity">Quantity</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    value={product.stock_quantity}
                    onChange={(e) => handleInputChange("stock_quantity", Number.parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={product.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Flags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_featured">Featured Product</Label>
                  <Switch
                    id="is_featured"
                    checked={product.is_featured}
                    onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_trending">Trending</Label>
                  <Switch
                    id="is_trending"
                    checked={product.is_trending}
                    onCheckedChange={(checked) => handleInputChange("is_trending", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_best_seller">Best Seller</Label>
                  <Switch
                    id="is_best_seller"
                    checked={product.is_best_seller}
                    onCheckedChange={(checked) => handleInputChange("is_best_seller", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_hot_selling">Hot Selling</Label>
                  <Switch
                    id="is_hot_selling"
                    checked={product.is_hot_selling}
                    onCheckedChange={(checked) => handleInputChange("is_hot_selling", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_deal_of_day">Deal of the Day</Label>
                  <Switch
                    id="is_deal_of_day"
                    checked={product.is_deal_of_day}
                    onCheckedChange={(checked) => handleInputChange("is_deal_of_day", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_latest">Latest Product</Label>
                  <Switch
                    id="is_latest"
                    checked={product.is_latest}
                    onCheckedChange={(checked) => handleInputChange("is_latest", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
