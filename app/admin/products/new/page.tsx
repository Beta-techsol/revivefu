"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Upload, X, Star, StarOff, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Category {
  id: number
  name: string
  slug: string
}

interface RoomType {
  id: number
  name: string
  slug: string
  is_active: boolean
}

interface ImageUpload {
  url: string
  public_id: string
  isPrimary: boolean
}

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [images, setImages] = useState<ImageUpload[]>([])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    short_description: "",
    sku: "",
    price: "",
    compare_price: "",
    cost: "",
    category_id: "",
    stock_quantity: "0",
    track_quantity: true,
    continue_selling: false,
    weight: "",
    material: "",
    color: "",
    brand: "",
    status: "active",
    is_featured: false,
    is_trending: false,
    is_best_seller: false,
    is_hot_selling: false,
    is_deal_of_day: false,
    is_latest: false,
    room_type_id: "",
    meta_title: "",
    meta_description: "",
    tags: "",
  })

  // Fetch categories and room types on component mount
  useEffect(() => {
    fetchCategories()
    fetchRoomTypes()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories")
      const result = await response.json()

      if (result.success) {
        setCategories(result.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch categories",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
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

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        const newImage: ImageUpload = {
          url: result.data.url,
          public_id: result.data.public_id,
          isPrimary: images.length === 0, // First image is primary by default
        }

        setImages((prev) => [...prev, newImage])

        toast({
          title: "Success",
          description: "Image uploaded successfully",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to upload image",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      // Reset file input
      event.target.value = ""
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index)
      // If we removed the primary image, make the first remaining image primary
      if (prev[index].isPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true
      }
      return newImages
    })
  }

  const setPrimaryImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      })),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.sku || !formData.price) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name, SKU, Price)",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const primaryImageIndex = images.findIndex((img) => img.isPrimary)
      const imageUrls = images.map((img) => img.url)

      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        compare_price: formData.compare_price ? Number.parseFloat(formData.compare_price) : null,
        cost: formData.cost ? Number.parseFloat(formData.cost) : null,
        category_id: formData.category_id ? Number.parseInt(formData.category_id) : null,
        room_type_id: formData.room_type_id ? Number.parseInt(formData.room_type_id) : null,
        stock_quantity: Number.parseInt(formData.stock_quantity),
        weight: formData.weight ? Number.parseFloat(formData.weight) : null,
        images: imageUrls,
        primary_image_index: primaryImageIndex >= 0 ? primaryImageIndex : 0,
        tags: formData.tags ? formData.tags.split(",").map((tag) => tag.trim()) : [],
      }

      console.log("Submitting product data:", productData)

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      const result = await response.json()
      console.log("API Response:", result)

      if (result.success) {
        toast({
          title: "Success!",
          description: "Product created successfully",
        })

        // Reset form
        setFormData({
          name: "",
          description: "",
          short_description: "",
          sku: "",
          price: "",
          compare_price: "",
          cost: "",
          category_id: "",
          stock_quantity: "0",
          track_quantity: true,
          continue_selling: false,
          weight: "",
          material: "",
          color: "",
          brand: "",
          status: "active",
          is_featured: false,
          is_trending: false,
          is_best_seller: false,
          is_hot_selling: false,
          is_deal_of_day: false,
          is_latest: false,
          room_type_id: "",
          meta_title: "",
          meta_description: "",
          tags: "",
        })
        setImages([])

        // Redirect to products list after a short delay
        setTimeout(() => {
          router.push("/admin/products")
        }, 1500)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create product",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error creating product:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center gap-4">
        <Button asChild variant="outline">
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground">Create a new product for your store</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Product Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                      placeholder="Enter SKU"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="short_description">Short Description</Label>
                  <Input
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => handleInputChange("short_description", e.target.value)}
                    placeholder="Brief product description"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Detailed product description"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="compare_price">Compare Price</Label>
                    <Input
                      id="compare_price"
                      type="number"
                      step="0.01"
                      value={formData.compare_price}
                      onChange={(e) => handleInputChange("compare_price", e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost">Cost</Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) => handleInputChange("cost", e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stock_quantity">Stock Quantity</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => handleInputChange("stock_quantity", e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.01"
                      value={formData.weight}
                      onChange={(e) => handleInputChange("weight", e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="track_quantity"
                    checked={formData.track_quantity}
                    onCheckedChange={(checked) => handleInputChange("track_quantity", checked)}
                  />
                  <Label htmlFor="track_quantity">Track quantity</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="continue_selling"
                    checked={formData.continue_selling}
                    onCheckedChange={(checked) => handleInputChange("continue_selling", checked)}
                  />
                  <Label htmlFor="continue_selling">Continue selling when out of stock</Label>
                </div>
              </CardContent>
            </Card>

            {/* Product Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div
                        className={`relative border-2 rounded-lg overflow-hidden ${
                          image.isPrimary ? "border-red-500" : "border-gray-200"
                        }`}
                      >
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt={`Product image ${index + 1}`}
                          width={200}
                          height={200}
                          className="w-full h-32 object-cover"
                        />
                        {image.isPrimary && <Badge className="absolute top-2 left-2 bg-red-500">Primary</Badge>}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              onClick={() => setPrimaryImage(index)}
                              disabled={image.isPrimary}
                            >
                              {image.isPrimary ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
                            </Button>
                            <Button type="button" size="sm" variant="destructive" onClick={() => removeImage(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center">
                    <label className="cursor-pointer flex flex-col items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                      {uploading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <>
                          <Upload className="h-6 w-6 text-gray-400" />
                          <span className="text-sm text-gray-500 mt-1">Upload Image</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {images.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Click the star icon to set an image as primary. The primary image will be shown first.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Organization */}
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => handleInputChange("category_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
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

                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    placeholder="modern, furniture, living room"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Product Attributes */}
            <Card>
              <CardHeader>
                <CardTitle>Attributes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    value={formData.material}
                    onChange={(e) => handleInputChange("material", e.target.value)}
                    placeholder="Wood, Metal, Fabric, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                    placeholder="Brown, Black, White, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                    placeholder="Brand name"
                  />
                </div>

                <div>
                  <Label htmlFor="room_type">Room Type</Label>
                  <Select
                    value={formData.room_type_id}
                    onValueChange={(value) => handleInputChange("room_type_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.map((roomType) => (
                        <SelectItem key={roomType.id} value={roomType.id.toString()}>
                          {roomType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Display Options */}
            <Card>
              <CardHeader>
                <CardTitle>Display Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
                  />
                  <Label htmlFor="is_featured">Featured Product</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_trending"
                    checked={formData.is_trending}
                    onCheckedChange={(checked) => handleInputChange("is_trending", checked)}
                  />
                  <Label htmlFor="is_trending">Trending</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_best_seller"
                    checked={formData.is_best_seller}
                    onCheckedChange={(checked) => handleInputChange("is_best_seller", checked)}
                  />
                  <Label htmlFor="is_best_seller">Best Seller</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_hot_selling"
                    checked={formData.is_hot_selling}
                    onCheckedChange={(checked) => handleInputChange("is_hot_selling", checked)}
                  />
                  <Label htmlFor="is_hot_selling">Hot Selling</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_deal_of_day"
                    checked={formData.is_deal_of_day}
                    onCheckedChange={(checked) => handleInputChange("is_deal_of_day", checked)}
                  />
                  <Label htmlFor="is_deal_of_day">Deal of the Day</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_latest"
                    checked={formData.is_latest}
                    onCheckedChange={(checked) => handleInputChange("is_latest", checked)}
                  />
                  <Label htmlFor="is_latest">Latest Product</Label>
                </div>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => handleInputChange("meta_title", e.target.value)}
                    placeholder="SEO title"
                  />
                </div>

                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => handleInputChange("meta_description", e.target.value)}
                    placeholder="SEO description"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Product...
              </>
            ) : (
              "Create Product"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
