"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail } from "lucide-react"
import Image from "next/image"

interface OrderItem {
  id: number
  product_name: string
  product_sku: string
  quantity: number
  unit_price: number
  total_price: number
  image_url?: string
}

interface StatusHistory {
  id: number
  status: string
  description: string
  created_at: string
}

interface Order {
  id: number
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  customer_city: string
  customer_zip: string
  customer_landmark?: string
  special_instructions?: string
  subtotal: number
  delivery_charge: number
  total_amount: number
  status: string
  payment_method: string
  created_at: string
  items: OrderItem[]
  status_history: StatusHistory[]
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderNumber.trim()) {
      setError("Please enter an order number")
      return
    }

    setLoading(true)
    setError("")
    setOrder(null)

    try {
      const response = await fetch(`/api/track-order/${orderNumber.trim()}`)
      const data = await response.json()

      if (data.success) {
        setOrder(data.data.order)
      } else {
        setError(data.error || "Order not found")
      }
    } catch (err) {
      setError("Failed to fetch order details")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "processing":
        return <Package className="w-5 h-5 text-blue-500" />
      case "shipped":
        return <Truck className="w-5 h-5 text-purple-500" />
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your order number to track your delivery status</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter your order number (e.g., ORD-20250716-ABC123)"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" disabled={loading} className="px-6">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Searching...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Track Order
                  </div>
                )}
              </Button>
            </form>
            {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
          </CardContent>
        </Card>

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Order Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">Order #{order.order_number}</CardTitle>
                    <p className="text-gray-600 mt-1">
                      Placed on{" "}
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Customer Information */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Delivery Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">{order.customer_name}</p>
                      <p>{order.customer_address}</p>
                      <p>
                        {order.customer_city}, {order.customer_zip}
                      </p>
                      {order.customer_landmark && <p>Landmark: {order.customer_landmark}</p>}
                      <div className="flex items-center gap-2 pt-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{order.customer_phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{order.customer_email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h3 className="font-semibold mb-3">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>Rs. {order.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Charges:</span>
                        <span>Rs. {order.delivery_charge.toLocaleString()}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>Rs. {order.total_amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Payment Method:</span>
                        <span className="capitalize">{order.payment_method}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {order.special_instructions && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Special Instructions:</h4>
                    <p className="text-sm text-gray-700">{order.special_instructions}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items ({order.items.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.image_url || "/placeholder.svg?height=64&width=64&text=Product"}
                          alt={item.product_name}
                          fill
                          className="object-cover rounded-md"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=64&width=64&text=Product"
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product_name}</h4>
                        {item.product_sku && <p className="text-sm text-gray-600">SKU: {item.product_sku}</p>}
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                          <span className="text-sm text-gray-600">Rs. {item.unit_price.toLocaleString()} each</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">Rs. {item.total_price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Status History */}
            {order.status_history && order.status_history.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Status History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.status_history.map((status, index) => (
                      <div key={status.id} className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">{getStatusIcon(status.status)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium capitalize">{status.status}</span>
                            <span className="text-sm text-gray-500">
                              {new Date(status.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{status.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
