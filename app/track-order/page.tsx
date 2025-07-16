"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface OrderItem {
  id: string
  product_id: string
  product_name: string
  product_price: number
  product_image: string
  quantity: number
  price: number
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
  total_amount: number
  status: string
  created_at: string
  payment_method: string
  items: OrderItem[]
}

interface TimelineItem {
  status: string
  title: string
  description: string
  date: string | null
  completed: boolean
}

interface TrackingData {
  order: Order
  timeline: TimelineItem[]
}

export default function TrackOrderPage() {
  const searchParams = useSearchParams()
  const initialOrderNumber = searchParams.get("order") || ""

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber)
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!orderNumber.trim()) {
      setError("Please enter an order number")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/track-order/${orderNumber}`)
      const data = await response.json()

      if (data.success) {
        setTrackingData(data.data)
        toast({
          title: "Order Found",
          description: `Tracking information for order ${orderNumber}`,
        })
      } else {
        setError(data.error || "Order not found")
        setTrackingData(null)
      }
    } catch (error) {
      console.error("Error tracking order:", error)
      setError("Failed to track order. Please try again.")
      setTrackingData(null)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string, completed: boolean) => {
    if (completed) {
      return <CheckCircle className="w-5 h-5 text-green-600" />
    }

    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-gray-400" />
      case "processing":
        return <Package className="w-5 h-5 text-gray-400" />
      case "shipped":
        return <Truck className="w-5 h-5 text-gray-400" />
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-gray-400" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-montserrat">Track Your Order</h1>
          <p className="text-gray-600 font-poppins">Enter your order number to track your shipment</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter your order number (e.g., ORD-20250716-X10963)"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
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
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tracking Results */}
        {trackingData && (
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="font-montserrat">Order #{trackingData.order.order_number}</CardTitle>
                  <Badge className={getStatusColor(trackingData.order.status)}>
                    {trackingData.order.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 font-poppins">Customer Information</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{trackingData.order.customer_name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{trackingData.order.customer_email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{trackingData.order.customer_phone}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 font-poppins">Delivery Address</h3>
                    <div className="flex items-start space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <div>{trackingData.order.customer_address}</div>
                        <div>
                          {trackingData.order.customer_city}, {trackingData.order.customer_zip}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat">Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingData.timeline.map((item, index) => (
                    <div key={item.status} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">{getStatusIcon(item.status, item.completed)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4
                            className={`font-medium ${item.completed ? "text-gray-900" : "text-gray-500"} font-poppins`}
                          >
                            {item.title}
                          </h4>
                          {item.date && (
                            <span className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</span>
                          )}
                        </div>
                        <p className={`text-sm ${item.completed ? "text-gray-600" : "text-gray-400"} font-poppins`}>
                          {item.description}
                        </p>
                      </div>
                      {index < trackingData.timeline.length - 1 && (
                        <div className="absolute left-6 mt-8 w-px h-8 bg-gray-200"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat">Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingData.order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex-shrink-0">
                        <Image
                          src={item.product_image || "/placeholder.svg"}
                          alt={item.product_name}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=80&width=80&text=Product"
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 font-poppins">{item.product_name}</h4>
                        <p className="text-sm text-gray-600 font-poppins">Quantity: {item.quantity}</p>
                        <p className="text-sm font-medium text-gray-900 font-poppins">
                          ₨{item.price.toLocaleString()} each
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 font-poppins">
                          ₨{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900 font-poppins">Total Amount:</span>
                    <span className="text-lg font-bold text-[#C53D39] font-poppins">
                      ₨{trackingData.order.total_amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
