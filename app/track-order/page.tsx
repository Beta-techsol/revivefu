"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Package, Truck, CheckCircle, XCircle, Clock, MapPin, Phone, Mail, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

interface OrderItem {
  id: string
  product_name: string
  quantity: number
  price: number
  sku?: string
}

interface StatusHistory {
  id: string
  status: string
  description: string
  created_at: string
}

interface Order {
  id: string
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
  updated_at: string
  items: OrderItem[]
  status_history: StatusHistory[]
}

const ORDER_STATUSES = [
  { value: "pending", label: "Order Placed", icon: Package, color: "bg-yellow-100 text-yellow-800" },
  { value: "processing", label: "Processing", icon: Clock, color: "bg-blue-100 text-blue-800" },
  { value: "shipped", label: "Shipped", icon: Truck, color: "bg-purple-100 text-purple-800" },
  { value: "out_for_delivery", label: "Out for Delivery", icon: Truck, color: "bg-orange-100 text-orange-800" },
  { value: "delivered", label: "Delivered", icon: CheckCircle, color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Cancelled", icon: XCircle, color: "bg-red-100 text-red-800" },
]

export default function TrackOrderPage() {
  const searchParams = useSearchParams()
  const [orderNumber, setOrderNumber] = useState(searchParams?.get("order") || "")
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const trackOrder = async (orderNum: string) => {
    if (!orderNum.trim()) {
      setError("Please enter an order number")
      return
    }

    setLoading(true)
    setError("")
    setOrder(null)

    try {
      console.log(`Tracking order: ${orderNum}`)

      // Add timestamp to prevent caching
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/track-order/${orderNum}?t=${timestamp}`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      })

      const data = await response.json()
      console.log("Track order response:", data)

      if (data.success) {
        setOrder(data.data)
        toast({
          title: "Order Found",
          description: `Order ${orderNum} is currently ${getStatusLabel(data.data.status)}`,
        })
      } else {
        setError(data.error || "Order not found")
        toast({
          title: "Order Not Found",
          description: data.error || "Please check your order number and try again",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error tracking order:", err)
      setError("Failed to track order. Please try again.")
      toast({
        title: "Error",
        description: "Failed to track order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusLabel = (status: string) => {
    const statusObj = ORDER_STATUSES.find((s) => s.value === status)
    return statusObj ? statusObj.label : status.replace("_", " ").toUpperCase()
  }

  const getStatusColor = (status: string) => {
    const statusObj = ORDER_STATUSES.find((s) => s.value === status)
    return statusObj ? statusObj.color : "bg-gray-100 text-gray-800"
  }

  const getStatusIcon = (status: string) => {
    const statusObj = ORDER_STATUSES.find((s) => s.value === status)
    return statusObj ? statusObj.icon : Package
  }

  const getCurrentStatusIndex = (status: string) => {
    return ORDER_STATUSES.findIndex((s) => s.value === status)
  }

  // Auto-track if order number is in URL
  useEffect(() => {
    const orderFromUrl = searchParams?.get("order")
    if (orderFromUrl && orderFromUrl !== orderNumber) {
      setOrderNumber(orderFromUrl)
      trackOrder(orderFromUrl)
    }
  }, [searchParams])

  // Auto-refresh order data every 30 seconds if order is being tracked
  useEffect(() => {
    if (order && !loading) {
      const interval = setInterval(() => {
        console.log("Auto-refreshing order data...")
        trackOrder(order.order_number)
      }, 30000) // Refresh every 30 seconds

      return () => clearInterval(interval)
    }
  }, [order, loading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    trackOrder(orderNumber)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-montserrat">Track Your Order</h1>
          <p className="text-gray-600 font-poppins">Enter your order number to track your delivery status</p>
        </div>

        {/* Search Form */}
        <Card className="max-w-md mx-auto mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                  Order Number
                </label>
                <Input
                  id="orderNumber"
                  type="text"
                  placeholder="e.g., ORD-20240116-ABC123"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Tracking...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4" />
                    <span>Track Order</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="max-w-md mx-auto mb-8 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 text-red-600">
                <XCircle className="w-5 h-5" />
                <span className="font-poppins">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Details */}
        {order && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Order Header */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-2xl font-montserrat">Order #{order.order_number}</CardTitle>
                    <p className="text-gray-600 font-poppins">
                      Placed on{" "}
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge className={`${getStatusColor(order.status)} text-sm px-3 py-1`}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Order Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat">Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ORDER_STATUSES.filter((status) => status.value !== "cancelled").map((status, index) => {
                    const currentIndex = getCurrentStatusIndex(order.status)
                    const isCompleted = index <= currentIndex
                    const isCurrent = index === currentIndex
                    const StatusIcon = status.icon

                    return (
                      <div key={status.value} className="flex items-center space-x-4">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            isCompleted ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <StatusIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium font-poppins ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                            {status.label}
                          </p>
                          {isCurrent && <p className="text-sm text-green-600 font-poppins">Current Status</p>}
                        </div>
                        {index < ORDER_STATUSES.length - 2 && (
                          <div className={`w-px h-8 ${isCompleted ? "bg-green-200" : "bg-gray-200"}`} />
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-montserrat">Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 text-gray-400">👤</div>
                    <span className="font-poppins">{order.customer_name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="font-poppins">{order.customer_email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="font-poppins">{order.customer_phone}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-montserrat">Delivery Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="font-poppins">
                      <p>{order.customer_address}</p>
                      {order.customer_city && <p>{order.customer_city}</p>}
                      {order.customer_zip && <p>{order.customer_zip}</p>}
                      {order.customer_landmark && (
                        <p className="text-sm text-gray-600">Landmark: {order.customer_landmark}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat">Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div key={item.id || index} className="flex justify-between items-center py-2">
                        <div className="flex-1">
                          <p className="font-medium font-poppins">{item.product_name}</p>
                          {item.sku && <p className="text-sm text-gray-600 font-poppins">SKU: {item.sku}</p>}
                        </div>
                        <div className="text-right">
                          <p className="font-poppins">Qty: {item.quantity}</p>
                          <p className="font-semibold font-poppins">₨{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 font-poppins">No items found for this order</p>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between font-poppins">
                    <span>Subtotal:</span>
                    <span>₨{order.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-poppins">
                    <span>Delivery Charge:</span>
                    <span>₨{order.delivery_charge.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg font-poppins">
                    <span>Total:</span>
                    <span>₨{order.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status History */}
            {order.status_history && order.status_history.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-montserrat">Status History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.status_history.map((history, index) => (
                      <div key={history.id || index} className="flex items-center space-x-3 py-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium font-poppins">{getStatusLabel(history.status)}</p>
                          <p className="text-sm text-gray-600 font-poppins">{history.description}</p>
                          <p className="text-xs text-gray-500 font-poppins">
                            {new Date(history.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Special Instructions */}
            {order.special_instructions && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-montserrat">Special Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-poppins">{order.special_instructions}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
