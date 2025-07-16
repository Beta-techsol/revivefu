"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Upload, X, Plus, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"

interface Category {
  id: string
  name: string
  slug: string
}

interface RoomType {
  id: number
  name: string
  slug: string
  is_active: boolean
}

interface Product {
  id: string
  name: string
  description: string
  short_description: string
  sku: string
  price: number
  compare_price: number
  cost: number
  category_id: string
  room_type_id: number
  stock_quantity: number
  track_quantity: boolean
  continue_selling: boolean
  material: string
  color: string
  brand: string
  status: string
  images: string[]
  tags: string[]
  is_featured: boolean
  is_trending: boolean
  is_best_seller: boolean
  is_hot_selling: boolean
  is_deal_of_day: boolean
  is_latest: boolean
  meta_title: string
  meta_description: string
  variants: any[]
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const productId = params.id as string

  const [images, setImages] = useState<string[]>([])
  const [variants, setVariants] = useState([{ color: "", size: "", material: "", price: "", stock: "", sku: "" }])
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)
  const [loading, setLoading] = useState(true)

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    short_description: "",
    sku: "",
    category_id: "",
    price: "",
    compare_price: "",
    cost: "",
    quantity: "",
    material: "",
    color: "",
    brand: "",
    status: "active",
    track_quantity: true,
    continue_selling: false,
    tags: [] as string[],
    // Display flags
    is_featured: false,
    is_trending: false,
    is_best_seller: false,
    is_hot_selling: false,
    is_deal_of_day: false,
    is_latest: false,
    room_type_id: "",
    meta_title: "",
    meta_description: "",
  })

  const [tagInput, setTagInput] = useState("")

  useEffect(() => {
    fetchCategories()
    fetchRoomTypes()
    fetchProduct()
  }, [productId])

  const fetchCategories = async () => {
    try {
      const response = await apiClient.getCategories()
      if (response.success && response.data) {
        setCategories(response.data)
      } else {
        console.error("Categories response:", response)
        setCategories([])
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      setCategories([])
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      })
    }
  }

  const fetchRoomTypes = async () => {
    try {
      const response = await fetch("/api/room-types")
      const result = await response.json()

      if (result.success) {
        setRoomTypes(result.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch room types",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching room types:", error)
      toast({
        title: "Error",
        description: "Failed to fetch room types",
        variant: "destructive",
      })
    }
  }

  const fetchProduct = async () => {
    try {
      const response = await apiClient.getProduct(productId)
      if (response.data) {
        const product = response.data.product
        setProductData({
          name: product.name || "",
          description: product.description || "",
          short_description: product.short_description || "",
          sku: product.sku || "",
          category_id: product.category_id || "",
          price: product.price?.toString() || "",
          compare_price: product.compare_price?.toString() || "",
          cost: product.cost?.toString() || "",
          quantity: product.stock_quantity?.toString() || "",
          material: product.material || "",
          color: product.color || "",
          brand: product.brand || "",
          status: product.status || "active",
          track_quantity: product.track_quantity || false,
          continue_selling: product.continue_selling || false,
          tags: product.tags || [],
          is_featured: product.is_featured || false,
          is_trending: product.is_trending || false,
          is_best_seller: product.is_best_seller || false,
          is_hot_selling: product.is_hot_selling || false,
          is_deal_of_day: product.is_deal_of_day || false,
          is_latest: product.is_latest || false,
          room_type_id: product.room_type_id?.toString() || "",
          meta_title: product.meta_title || "",
          meta_description: product.meta_description || "",
        })
        setImages(product.images || [])
        if (product.variants && product.variants.length > 0) {
          setVariants(
            product.variants.map((v: any) => ({
              color: v.color || "",
              size: v.size || "",
              material: v.material || "",
              price: v.price?.toString() || "",
              stock: v.stock?.toString() || "",
              sku: v.sku || "",
            })),
          )
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch product details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploadingImage(true)
    try {
      for (const file of Array.from(files)) {
        const result = await apiClient.uploadImage(file, "products")
        if (result.url) {
          setImages((prev) => [...prev, result.url])
        }
      }
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to upload images",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const addVariant = () => {
    setVariants((prev) => [...prev, { color: "", size: "", material: "", price: "", stock: "", sku: "" }])
  }

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index))
  }

  const updateVariant = (index: number, field: string, value: string) => {
    setVariants((prev) => prev.map((variant, i) => (i === index ? { ...variant, [field]: value } : variant)))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !productData.tags.includes(tagInput.trim())) {
      setProductData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setProductData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSave = async () => {
    if (!productData.name || !productData.price || !productData.sku) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name, Price, SKU).",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await apiClient.updateProduct(productId, {
        ...productData,
        price: Number.parseFloat(productData.price),
        compare_price: productData.compare_price ? Number.parseFloat(productData.compare_price) : null,
        cost: productData.cost ? Number.parseFloat(productData.cost) : null,
        stock_quantity: Number.parseInt(productData.quantity) || 0,
        room_type_id: productData.room_type_id ? Number.parseInt(productData.room_type_id) : null,
        images,
        variants: variants.filter((v) => v.color || v.size || v.material),
      })

      if (response.error) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        })
        return
      }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#C53D39] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-poppins">Loading product...</p>
        </div>
      </div>
    )
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
                    Product Name *
                  </Label>
                  <Input
                    id="name"
                    value={productData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter product name"
                    className="font-poppins"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="short_description" className="font-poppins">
                    Short Description
                  </Label>
                  <Input
                    id="short_description"
                    value={productData.short_description}
                    onChange={(e) => handleInputChange("short_description", e.target.value)}
                    placeholder="Brief product description"
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
                    placeholder="Enter detailed product description"
                    rows={4}
                    className="font-poppins"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sku" className="font-poppins">
                      SKU *
                    </Label>
                    <Input
                      id="sku"
                      value={productData.sku}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                      placeholder="Enter SKU"
                      className="font-poppins"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category" className="font-poppins">
                      Category
                    </Label>
                    <Select
                      value={productData.category_id}
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

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="material" className="font-poppins">
                      Material
                    </Label>
                    <Input
                      id="material"
                      value={productData.material}
                      onChange={(e) => handleInputChange("material", e.target.value)}
                      placeholder="e.g., Wood, Metal"
                      className="font-poppins"
                    />
                  </div>
                  <div>
                    <Label htmlFor="color" className="font-poppins">
                      Color
                    </Label>
                    <Input
                      id="color"
                      value={productData.color}
                      onChange={(e) => handleInputChange("color", e.target.value)}
                      placeholder="e.g., Brown, Black"
                      className="font-poppins"
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand" className="font-poppins">
                      Brand
                    </Label>
                    <Input
                      id="brand"
                      value={productData.brand}
                      onChange={(e) => handleInputChange("brand", e.target.value)}
                      placeholder="Brand name"
                      className="font-poppins"
                    />
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
                  <p className="text-gray-600 font-poppins mb-4">
                    {uploadingImage ? "Uploading..." : "Drag and drop images here, or click to browse"}
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={uploadingImage}
                  />
                  <Button asChild variant="outline" className="bg-white hover:bg-gray-50" disabled={uploadingImage}>
                    <label htmlFor="image-upload" className="cursor-pointer">
                      {uploadingImage ? "Uploading..." : "Choose Files"}
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

            {/* Tags */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-montserrat">Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    className="font-poppins"
                    onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  />
                  <Button onClick={handleAddTag} variant="outline">
                    Add
                  </Button>
                </div>
                {productData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {productData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center"
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
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                        <Label className="font-poppins">Material</Label>
                        <Input
                          value={variant.material}
                          onChange={(e) => updateVariant(index, "material", e.target.value)}
                          placeholder="e.g., Leather"
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
                      <div>
                        <Label className="font-poppins">SKU</Label>
                        <Input
                          value={variant.sku}
                          onChange={(e) => updateVariant(index, "sku", e.target.value)}
                          placeholder="Variant SKU"
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
                    Base Price *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={productData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0.00"
                    className="font-poppins"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="compare-price" className="font-poppins">
                    Compare at Price
                  </Label>
                  <Input
                    id="compare-price"
                    type="number"
                    value={productData.compare_price}
                    onChange={(e) => handleInputChange("compare_price", e.target.value)}
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
                    checked={productData.track_quantity}
                    onChange={(e) => handleInputChange("track_quantity", e.target.checked)}
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
                    checked={productData.continue_selling}
                    onChange={(e) => handleInputChange("continue_selling", e.target.checked)}
                    className="rounded border-gray-300 text-[#C53D39] focus:ring-[#C53D39]"
                  />
                  <Label htmlFor="continue-selling" className="font-poppins">
                    Continue selling when out of stock
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Display Settings */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-montserrat">Display Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is-featured"
                    checked={productData.is_featured}
                    onChange={(e) => handleInputChange("is_featured", e.target.checked)}
                    className="rounded border-gray-300 text-[#C53D39] focus:ring-[#C53D39]"
                  />
                  <Label htmlFor="is-featured" className="font-poppins">
                    Featured Product
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is-trending"
                    checked={productData.is_trending}
                    onChange={(e) => handleInputChange("is_trending", e.target.checked)}
                    className="rounded border-gray-300 text-[#C53D39] focus:ring-[#C53D39]"
                  />
                  <Label htmlFor="is-trending" className="font-poppins">
                    Trending
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is-best-seller"
                    checked={productData.is_best_seller}
                    onChange={(e) => handleInputChange("is_best_seller", e.target.checked)}
                    className="rounded border-gray-300 text-[#C53D39] focus:ring-[#C53D39]"
                  />
                  <Label htmlFor="is-best-seller" className="font-poppins">
                    Best Seller
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is-hot-selling"
                    checked={productData.is_hot_selling}
                    onChange={(e) => handleInputChange("is_hot_selling", e.target.checked)}
                    className="rounded border-gray-300 text-[#C53D39] focus:ring-[#C53D39]"
                  />
                  <Label htmlFor="is-hot-selling" className="font-poppins">
                    Hot Selling
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is-deal-of-day"
                    checked={productData.is_deal_of_day}
                    onChange={(e) => handleInputChange("is_deal_of_day", e.target.checked)}
                    className="rounded border-gray-300 text-[#C53D39] focus:ring-[#C53D39]"
                  />
                  <Label htmlFor="is-deal-of-day" className="font-poppins">
                    Deal of the Day
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is-latest"
                    checked={productData.is_latest}
                    onChange={(e) => handleInputChange("is_latest", e.target.checked)}
                    className="rounded border-gray-300 text-[#C53D39] focus:ring-[#C53D39]"
                  />
                  <Label htmlFor="is-latest" className="font-poppins">
                    Latest Product
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Room Type */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-montserrat">Shop by Room</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="room-type" className="font-poppins">
                  Room Type
                </Label>
                <Select
                  value={productData.room_type_id}
                  onValueChange={(value) => handleInputChange("room_type_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Room Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((roomType) => (
                      <SelectItem key={roomType.id} value={roomType.id.toString()}>
                        {roomType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Status */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-montserrat">Product Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={productData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="font-montserrat">SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta-title" className="font-poppins">
                    Meta Title
                  </Label>
                  <Input
                    id="meta-title"
                    value={productData.meta_title}
                    onChange={(e) => handleInputChange("meta_title", e.target.value)}
                    placeholder="SEO title"
                    className="font-poppins"
                  />
                </div>
                <div>
                  <Label htmlFor="meta-description" className="font-poppins">
                    Meta Description
                  </Label>
                  <Textarea
                    id="meta-description"
                    value={productData.meta_description}
                    onChange={(e) => handleInputChange("meta_description", e.target.value)}
                    placeholder="SEO description"
                    rows={3}
                    className="font-poppins"
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
