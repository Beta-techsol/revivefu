"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Upload, X, Plus, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const productId = params.id as string

  const [images, setImages] = useState<string[]>(["/shop/products/sofa-1.jpg"])
  const [variants, setVariants] = useState([
    { color: "Charcoal Gray", size: "Standard", price: "1299.99", stock: "15" },
  ])
  const [isLoading, setIsLoading] = useState(false)

  // Mock product data - in real app, fetch by productId
  const [productData, setProductData] = useState({
    name: "Modern Sectional Sofa",
    description:
      "A comfortable modern sectional sofa perfect for any living room. Features high-quality fabric upholstery and sturdy wooden frame construction.",
    sku: "SOF-001",
    category: "Living Room",
    price: "1299.99",
    comparePrice: "1599.99",
    cost: "800.00",
    quantity: "15",
    status: "Active",
    trackQuantity: true,
    continueSelling: false,
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const addVariant = () => {
    setVariants((prev) => [...prev, { color: "", size: "", price: "", stock: "" }])
  }

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index))
  }

  const updateVariant = (index: number, field: string, value: string) => {
    setVariants((prev) => prev.map((variant, i) => (i === index ? { ...variant, [field]: value } : variant)))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Product Updated",
        description: "Product has been updated successfully.",
      })

      router.push("/admin/products")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setProductData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button asChild variant="outline" className="bg-white hover:bg-gray-50">
              <Link href="/admin/products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-montserrat">Edit Product</h1>
              <p className="text-gray-600 font-poppins">Update product information</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="bg-white hover:bg-gray-50">
              Save as Draft
            </Button>
            <Button
              onClick={handleSave}
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
                  Update Product
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
                <CardTitle className="font-montserrat">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="font-poppins">
                    Product Name
                  </Label>
                  <Input
                    id="name"
                    value={productData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter product name"
                    className="font-poppins"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="font-poppins">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={productData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter product description"
                    rows={4}
                    className="font-poppins"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sku" className="font-poppins">
                      SKU
                    </Label>
                    <Input
                      id="sku"
                      value={productData.sku}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                      placeholder="Enter SKU"
                      className="font-poppins"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category" className="font-poppins">
                      Category
                    </Label>
                    <select
                      id="category"
                      value={productData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C53D39] font-poppins"
                    >
                      <option>Select Category</option>
                      <option>Living Room</option>
                      <option>Bedroom</option>
                      <option>Dining Room</option>
                      <option>Office</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Images */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-montserrat">Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-poppins mb-4">Drag and drop images here, or click to browse</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button asChild variant="outline" className="bg-white hover:bg-gray-50">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      Choose Files
                    </label>
                  </Button>
                </div>
                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Product ${index + 1}`}
                          width={100}
                          height={100}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Product Variants */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-montserrat">Product Variants</CardTitle>
                <Button onClick={addVariant} variant="outline" size="sm" className="bg-white hover:bg-gray-50">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Variant
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {variants.map((variant, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold font-poppins">Variant {index + 1}</h4>
                      {variants.length > 1 && (
                        <Button
                          onClick={() => removeVariant(index)}
                          variant="outline"
                          size="sm"
                          className="bg-white text-red-600 hover:bg-red-50 border-red-300"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="font-poppins">Color</Label>
                        <Input
                          value={variant.color}
                          onChange={(e) => updateVariant(index, "color", e.target.value)}
                          placeholder="e.g., Red"
                          className="font-poppins"
                        />
                      </div>
                      <div>
                        <Label className="font-poppins">Size</Label>
                        <Input
                          value={variant.size}
                          onChange={(e) => updateVariant(index, "size", e.target.value)}
                          placeholder="e.g., Large"
                          className="font-poppins"
                        />
                      </div>
                      <div>
                        <Label className="font-poppins">Price</Label>
                        <Input
                          value={variant.price}
                          onChange={(e) => updateVariant(index, "price", e.target.value)}
                          placeholder="0.00"
                          type="number"
                          className="font-poppins"
                        />
                      </div>
                      <div>
                        <Label className="font-poppins">Stock</Label>
                        <Input
                          value={variant.stock}
                          onChange={(e) => updateVariant(index, "stock", e.target.value)}
                          placeholder="0"
                          type="number"
                          className="font-poppins"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-montserrat">Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="price" className="font-poppins">
                    Base Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={productData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0.00"
                    className="font-poppins"
                  />
                </div>
                <div>
                  <Label htmlFor="compare-price" className="font-poppins">
                    Compare at Price
                  </Label>
                  <Input
                    id="compare-price"
                    type="number"
                    value={productData.comparePrice}
                    onChange={(e) => handleInputChange("comparePrice", e.target.value)}
                    placeholder="0.00"
                    className="font-poppins"
                  />
                </div>
                <div>
                  <Label htmlFor="cost" className="font-poppins">
                    Cost per Item
                  </Label>
                  <Input
                    id="cost"
                    type="number"
                    value={productData.cost}
                    onChange={(e) => handleInputChange("cost", e.target.value)}
                    placeholder="0.00"
                    className="font-poppins"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-montserrat">Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="quantity" className="font-poppins">
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={productData.quantity}
                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                    placeholder="0"
                    className="font-poppins"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="track-quantity"
                    checked={productData.trackQuantity}
                    onChange={(e) => handleInputChange("trackQuantity", e.target.checked)}
                    className="rounded border-gray-300 text-[#C53D39] focus:ring-[#C53D39]"
                  />
                  <Label htmlFor="track-quantity" className="font-poppins">
                    Track quantity
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="continue-selling"
                    checked={productData.continueSelling}
                    onChange={(e) => handleInputChange("continueSelling", e.target.checked)}
                    className="rounded border-gray-300 text-[#C53D39] focus:ring-[#C53D39]"
                  />
                  <Label htmlFor="continue-selling" className="font-poppins">
                    Continue selling when out of stock
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-montserrat">Product Status</CardTitle>
              </CardHeader>
              <CardContent>
                <select
                  value={productData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C53D39] font-poppins"
                >
                  <option>Active</option>
                  <option>Draft</option>
                  <option>Archived</option>
                </select>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
