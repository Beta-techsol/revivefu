"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star } from "lucide-react"

interface ProductTabsProps {
  product: {
    description: string
    specifications: { [key: string]: string }
    reviews: {
      id: string
      name: string
      rating: number
      comment: string
      date: string
    }[]
  }
}

function ProductTabs({ product }: ProductTabsProps) {
  return (
    <div className="mt-16">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Additional Information</TabsTrigger>
          <TabsTrigger value="reviews">Customer Reviews ({product.reviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="space-y-6">
          <div className="prose max-w-none">
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>
        </TabsContent>

        <TabsContent value="specifications" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-3 border-b border-gray-200">
                <span className="font-medium text-gray-900">{key}</span>
                <span className="text-gray-600">{value}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          {product.reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{review.name}</h4>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProductTabs
export { ProductTabs }
