"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProductDetailModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string
}

export function ProductDetailModal({ isOpen, onClose, productId }: ProductDetailModalProps) {
  // Mock product data - in real app, fetch by productId
  const product = {
    id: productId,
    name: "Modern Sectional Sofa",
    price: 1299.99,
    originalPrice: 1599.99,
    category: "Living Room",
    stock: 15,
    status: "Active",
    image: "/shop/products/sofa-1.jpg",
    sku: "SOF-001",
    tags: ["Modern", "Sectional", "Fabric"],
    description:
      "A comfortable modern sectional sofa perfect for any living room. Features high-quality fabric upholstery and sturdy wooden frame construction.",
    dimensions: '84" W x 36" D x 32" H',
    weight: "120 lbs",
    material: "Fabric, Wood Frame",
    color: "Charcoal Gray",
    warranty: "2 Years",
  }

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="font-montserrat text-2xl">Product Details</DialogTitle>
          <div className="flex items-center space-x-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/products/edit/${productId}`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Product
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              <div className="absolute top-4 right-4">
                <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-2">{product.name}</h2>
              <p className="text-gray-600 font-poppins">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 font-poppins mb-1">SKU</h3>
                <p className="text-gray-600 font-poppins">{product.sku}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 font-poppins mb-1">Category</h3>
                <p className="text-gray-600 font-poppins">{product.category}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 font-poppins mb-1">Stock</h3>
                <p className="text-gray-600 font-poppins">{product.stock} units</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 font-poppins mb-1">Status</h3>
                <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 font-poppins mb-2">Pricing</h3>
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-[#C53D39]">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 font-poppins mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 font-poppins">Specifications</h3>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Dimensions:</span>
                  <span className="font-medium">{product.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium">{product.weight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Material:</span>
                  <span className="font-medium">{product.material}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Color:</span>
                  <span className="font-medium">{product.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Warranty:</span>
                  <span className="font-medium">{product.warranty}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
