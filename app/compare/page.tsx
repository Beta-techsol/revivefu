"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  X,
  ToggleLeft,
  ToggleRight,
  Star,
  Check,
  Minus,
  Filter,
  Grid,
  List,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCompare } from "@/hooks/use-compare"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import Image from "next/image"
import Link from "next/link"

export default function ComparePage() {
  const { items, removeFromCompare, clearCompare } = useCompare()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [highlightDifferences, setHighlightDifferences] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "table">("table")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Enhanced specifications for comparison
  const specifications = [
    { key: "dimensions", label: "Dimensions", category: "physical" },
    { key: "material", label: "Material", category: "physical" },
    { key: "color", label: "Color Options", category: "design" },
    { key: "warranty", label: "Warranty", category: "service" },
    { key: "delivery", label: "Delivery Time", category: "service" },
    { key: "assembly", label: "Assembly Required", category: "service" },
    { key: "weight", label: "Weight", category: "physical" },
    { key: "care", label: "Care Instructions", category: "service" },
    { key: "origin", label: "Country of Origin", category: "info" },
    { key: "certification", label: "Certifications", category: "info" },
    { key: "style", label: "Style", category: "design" },
    { key: "finish", label: "Finish", category: "design" },
  ]

  const mockSpecs = {
    "1": {
      dimensions: '84" W x 36" D x 32" H',
      material: "Premium Fabric",
      color: "Gray, Navy, Beige",
      warranty: "5 Years",
      delivery: "2-3 Weeks",
      assembly: "Yes",
      weight: "120 lbs",
      care: "Professional Cleaning",
      origin: "Pakistan",
      certification: "ISO 9001, FSC",
      style: "Modern",
      finish: "Matte",
    },
    "2": {
      dimensions: '26" W x 26" D x 40" H',
      material: "Mesh & Plastic",
      color: "Black, White",
      warranty: "3 Years",
      delivery: "1-2 Weeks",
      assembly: "Yes",
      weight: "35 lbs",
      care: "Wipe Clean",
      origin: "China",
      certification: "CE, RoHS",
      style: "Contemporary",
      finish: "Glossy",
    },
    "3": {
      dimensions: '72" W x 36" D x 30" H',
      material: "Solid Wood",
      color: "Oak, Walnut, Cherry",
      warranty: "10 Years",
      delivery: "4-6 Weeks",
      assembly: "No",
      weight: "180 lbs",
      care: "Wood Polish",
      origin: "Pakistan",
      certification: "FSC, GREENGUARD",
      style: "Traditional",
      finish: "Natural",
    },
  }

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      description: item.description,
    })
  }

  const handleWishlistToggle = (item: any) => {
    if (isInWishlist(item.id)) {
      removeFromWishlist(item.id)
    } else {
      addToWishlist({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        description: item.description,
      })
    }
  }

  const getSpecValue = (itemId: string, specKey: string) => {
    return mockSpecs[itemId as keyof typeof mockSpecs]?.[specKey as keyof (typeof mockSpecs)["1"]] || "N/A"
  }

  const isDifferent = (specKey: string) => {
    if (items.length < 2) return false
    const values = items.map((item) => getSpecValue(item.id, specKey))
    return new Set(values).size > 1
  }

  const filteredSpecs =
    selectedCategory === "all" ? specifications : specifications.filter((spec) => spec.category === selectedCategory)

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-32 h-32 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] rounded-full flex items-center justify-center mx-auto mb-8">
              <Grid className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-montserrat">Product Comparison</h1>
            <p className="text-xl text-gray-600 mb-8 font-poppins">No products selected for comparison</p>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">How to Compare Products:</h3>
              <div className="text-left space-y-2 text-gray-600">
                <p>• Browse products and click the compare icon</p>
                <p>• Add up to 4 products to compare</p>
                <p>• View detailed specifications side by side</p>
                <p>• Make informed purchasing decisions</p>
              </div>
            </div>
            <Button
              asChild
              size="lg"
              className="mt-8 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white px-8 py-4 text-lg"
            >
              <Link href="/shop">Browse Products</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild className="bg-transparent hover:bg-gray-50">
                <Link href="/shop">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Shop
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-montserrat">Compare Products</h1>
                <p className="text-gray-600 font-poppins">Compare up to 4 products side by side</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C53D39] text-sm"
                >
                  <option value="all">All Specs</option>
                  <option value="physical">Physical</option>
                  <option value="design">Design</option>
                  <option value="service">Service</option>
                  <option value="info">Information</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "table" ? "bg-white shadow-sm text-[#C53D39]" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid" ? "bg-white shadow-sm text-[#C53D39]" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>

              {/* Highlight Differences Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 font-poppins">Highlight Differences</span>
                <button
                  onClick={() => setHighlightDifferences(!highlightDifferences)}
                  className="text-[#C53D39] hover:text-[#B12E2A] transition-colors"
                >
                  {highlightDifferences ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
              </div>

              <Button
                variant="outline"
                onClick={clearCompare}
                className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 bg-transparent"
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>

        {/* Comparison Content */}
        {viewMode === "table" ? (
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <th className="text-left py-6 px-6 font-semibold text-gray-700 font-montserrat w-48 sticky left-0 bg-gradient-to-r from-gray-50 to-gray-100">
                        Product
                      </th>
                      {items.map((item) => (
                        <th key={item.id} className="text-center py-6 px-6 min-w-80">
                          <div className="relative">
                            <button
                              onClick={() => removeFromCompare(item.id)}
                              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4 shadow-md">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                width={300}
                                height={300}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2 font-poppins text-lg">{item.name}</h3>
                            <div className="flex items-center justify-center mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                />
                              ))}
                              <span className="ml-2 text-sm text-gray-600">(4.5)</span>
                            </div>
                            <p className="text-3xl font-bold text-[#C53D39] mb-4">₨{item.price.toLocaleString()}</p>
                            <div className="space-y-2">
                              <Button
                                onClick={() => handleAddToCart(item)}
                                className="w-full bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
                              >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Add to Cart
                              </Button>
                              <Button
                                variant="outline"
                                className="w-full bg-transparent"
                                onClick={() => handleWishlistToggle(item)}
                              >
                                <Heart
                                  className={`w-4 h-4 mr-2 ${isInWishlist(item.id) ? "fill-current text-red-500" : ""}`}
                                />
                                {isInWishlist(item.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                              </Button>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSpecs.map((spec, index) => (
                      <tr
                        key={spec.key}
                        className={`border-b border-gray-100 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } ${highlightDifferences && isDifferent(spec.key) ? "bg-yellow-50 border-yellow-200" : ""}`}
                      >
                        <td className="py-4 px-6 font-medium text-gray-900 font-poppins sticky left-0 bg-inherit">
                          <div className="flex items-center space-x-2">
                            <span>{spec.label}</span>
                            {highlightDifferences && isDifferent(spec.key) && (
                              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            )}
                          </div>
                        </td>
                        {items.map((item) => {
                          const value = getSpecValue(item.id, spec.key)
                          const isAvailable = value !== "N/A"
                          return (
                            <td key={item.id} className="py-4 px-6 text-center text-gray-700 font-poppins">
                              <div className="flex items-center justify-center space-x-2">
                                {isAvailable ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Minus className="w-4 h-4 text-gray-400" />
                                )}
                                <span className={isAvailable ? "text-gray-900" : "text-gray-400"}>{value}</span>
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="relative mb-4">
                    <button
                      onClick={() => removeFromCompare(item.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 font-poppins">{item.name}</h3>
                  <p className="text-2xl font-bold text-[#C53D39] mb-4">₨{item.price.toLocaleString()}</p>

                  <div className="space-y-3 mb-6">
                    {filteredSpecs.slice(0, 6).map((spec) => (
                      <div key={spec.key} className="flex justify-between text-sm">
                        <span className="text-gray-600">{spec.label}:</span>
                        <span className="text-gray-900 font-medium">{getSpecValue(item.id, spec.key)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="w-full bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => handleWishlistToggle(item)}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isInWishlist(item.id) ? "fill-current text-red-500" : ""}`} />
                      Wishlist
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Enhanced Footer */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">Need Help Deciding?</h3>
            <p className="text-gray-600 mb-6 font-poppins">
              Our furniture experts are here to help you make the perfect choice for your space.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
              >
                <Link href="/contact">Contact Expert</Link>
              </Button>
              <Button asChild variant="outline" className="bg-transparent">
                <Link href="/shop">Browse More Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
