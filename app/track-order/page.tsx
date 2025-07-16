"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

interface OrderStatus {
  id: number
  status: string
  description: string
  created_at: string
}

interface OrderItem {
  id: number
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
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
  total_amount: number
  status: string
  created_at: string
  items: OrderItem[]
  status_history: OrderStatus[]
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderNumber.trim()) return

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
      setError("Failed to track order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "processing":
      case "preparing":
        return <Package className="w-5 h-5 text-blue-500" />
      case "shipped":
      case "out_for_delivery":
        return <Truck className="w-5 h-5 text-purple-500" />
      case "delivered":
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "cancelled":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "processing":
      case "preparing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "shipped":
      case "out_for_delivery":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "delivered":
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-gray-600">Enter your order number to see the current status and delivery information</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Order Tracking</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="orderNumber" className="sr-only">
                  Order Number
                </Label>
                <Input
                  id="orderNumber"
                  type="text"
                  placeholder="Enter your order number (e.g., ORD-20250116-ABC123)"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="text-lg py-3"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white px-8 py-3"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Tracking...</span>
                  </div>
                ) : (
                  "Track Order"
                )}
              </Button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order Details</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                    {order.status.replace("_", " ").toUpperCase()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Order Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Number:</span>
                        <span className="font-medium">{order.order_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Date:</span>
                        <span className="font-medium">{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-medium text-lg">₨{order.total_amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Delivery Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-medium">{order.customer_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{order.customer_phone}</span>
                      </div>
                      <div className="text-gray-600">
                        <span>Address:</span>
                        <p className="font-medium mt-1">
                          {order.customer_address}, {order.customer_city} {order.customer_zip}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
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
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₨{item.total_price.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">₨{item.unit_price.toLocaleString()} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status History */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.status_history.map((status, index) => (
                    <div key={status.id} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">{getStatusIcon(status.status)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{status.status.replace("_", " ").toUpperCase()}</h4>
                          <span className="text-sm text-gray-500">{new Date(status.created_at).toLocaleString()}</span>
                        </div>
                        {status.description && <p className="text-sm text-gray-600 mt-1">{status.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
              <Button asChild size="lg">
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                If you can't find your order or need assistance, please contact our customer support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/faq">View FAQ</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
