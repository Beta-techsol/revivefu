"use client"

import { useState } from "react"
import { ArrowLeft, Heart, ShoppingCart, X, ToggleLeft, ToggleRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCompare } from "@/hooks/use-compare"
import { useCart } from "@/hooks/use-cart"
import Image from "next/image"
import Link from "next/link"

export default function ComparePage() {
  const { items, removeFromCompare, clearCompare } = useCompare()
  const { addToCart } = useCart()
  const [highlightDifferences, setHighlightDifferences] = useState(false)

  // Mock specifications for comparison
  const specifications = [
    { key: "dimensions", label: "Dimensions" },
    { key: "material", label: "Material" },
    { key: "color", label: "Color Options" },
    { key: "warranty", label: "Warranty" },
    { key: "delivery", label: "Delivery Time" },
    { key: "assembly", label: "Assembly Required" },
    { key: "weight", label: "Weight" },
    { key: "care", label: "Care Instructions" },
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

  const getSpecValue = (itemId: string, specKey: string) => {
    return mockSpecs[itemId as keyof typeof mockSpecs]?.[specKey as keyof (typeof mockSpecs)["1"]] || "N/A"
  }

  const isDifferent = (specKey: string) => {
    if (items.length < 2) return false
    const values = items.map((item) => getSpecValue(item.id, specKey))
    return new Set(values).size > 1
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 font-montserrat">Product Comparison</h1>
            <p className="text-gray-600 mb-8 font-poppins">No products selected for comparison</p>
            <Button
              asChild
              className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
            >
              <Link href="/shop">Browse Products</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild className="bg-transparent">
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
          <div className="flex items-center space-x-4">
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

        {/* Comparison Table */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 font-montserrat w-48 sticky left-0 bg-gray-50">
                      Product
                    </th>
                    {items.map((item) => (
                      <th key={item.id} className="text-center py-4 px-6 min-w-64">
                        <div className="relative">
                          <button
                            onClick={() => removeFromCompare(item.id)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={200}
                              height={200}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2 font-poppins">{item.name}</h3>
                          <p className="text-2xl font-bold text-[#C53D39] mb-4">${item.price.toFixed(2)}</p>
                          <div className="space-y-2">
                            <Button
                              onClick={() => handleAddToCart(item)}
                              className="w-full bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Add to Cart
                            </Button>
                            <Button variant="outline" className="w-full bg-transparent">
                              <Heart className="w-4 h-4 mr-2" />
                              Add to Wishlist
                            </Button>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {specifications.map((spec, index) => (
                    <tr
                      key={spec.key}
                      className={`border-b border-gray-100 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } ${highlightDifferences && isDifferent(spec.key) ? "bg-yellow-50" : ""}`}
                    >
                      <td className="py-4 px-6 font-medium text-gray-900 font-poppins sticky left-0 bg-inherit">
                        {spec.label}
                      </td>
                      {items.map((item) => (
                        <td key={item.id} className="py-4 px-6 text-center text-gray-700 font-poppins">
                          {getSpecValue(item.id, spec.key)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Mobile View */}
        <div className="md:hidden mt-8 space-y-6">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 font-poppins">{item.name}</h3>
                      <p className="text-xl font-bold text-[#C53D39]">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCompare(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {specifications.map((spec) => (
                    <div key={spec.key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700 font-poppins">{spec.label}:</span>
                      <span className="text-gray-600 font-poppins">{getSpecValue(item.id, spec.key)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2 mt-6">
                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Heart className="w-4 h-4 mr-2" />
                    Wishlist
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
