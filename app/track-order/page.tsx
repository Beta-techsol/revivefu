"use client"

import { useState, useEffect } from "react"
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useSearchParams } from "next/navigation"

export default function TrackOrderPage() {
  const [orderInput, setOrderInput] = useState("")
  const [trackingResult, setTrackingResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const searchParams = useSearchParams()

  useEffect(() => {
    const orderFromUrl = searchParams.get("order")
    if (orderFromUrl) {
      setOrderInput(orderFromUrl)
      handleTrackOrder(orderFromUrl)
    }
  }, [searchParams])

  const handleTrackOrder = async (orderNumber?: string) => {
    const orderToTrack = orderNumber || orderInput
    if (!orderToTrack.trim()) return

    setIsLoading(true)
    setError("")
    console.log(`Tracking order: ${orderToTrack}`)

    try {
      const response = await fetch(`/api/track-order/${orderToTrack}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      console.log("Track order response:", data)

      if (data.success) {
        setTrackingResult(data.data)
        setLastUpdated(new Date().toLocaleTimeString())
        console.log(`Order found with status: ${data.data.status}`)
      } else {
        setError(data.error || "Order not found")
        setTrackingResult(null)
        console.log("Order not found:", data.error)
      }
    } catch (error) {
      console.error("Track order error:", error)
      setError("Failed to track order. Please try again.")
      setTrackingResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-refresh tracking data every 30 seconds if we have a result
  useEffect(() => {
    if (trackingResult && orderInput) {
      const interval = setInterval(() => {
        console.log("Auto-refreshing tracking data...")
        handleTrackOrder(orderInput)
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [trackingResult, orderInput])

  const getStatusIcon = (status: string, isCompleted: boolean) => {
    if (isCompleted) {
      return <CheckCircle className="w-6 h-6 text-green-600" />
    }

    switch (status.toLowerCase()) {
      case "pending":
        return <Package className="w-6 h-6 text-gray-400" />
      case "processing":
      case "preparing":
        return <Clock className="w-6 h-6 text-gray-400" />
      case "shipped":
      case "out_for_delivery":
        return <Truck className="w-6 h-6 text-gray-400" />
      case "delivered":
        return <CheckCircle className="w-6 h-6 text-gray-400" />
      default:
        return <Clock className="w-6 h-6 text-gray-400" />
    }
  }

  const getStatusSteps = (currentStatus: string, statusHistory: any[]) => {
    const allStatuses = [
      { key: "pending", label: "Order Placed", description: "Your order has been confirmed and payment received" },
      { key: "processing", label: "Processing", description: "Order is being prepared for shipment" },
      { key: "shipped", label: "Shipped", description: "Package has been dispatched" },
      { key: "out_for_delivery", label: "Out for Delivery", description: "Package is on the way to your location" },
      { key: "delivered", label: "Delivered", description: "Package delivered successfully" },
    ]

    const statusOrder = ["pending", "processing", "shipped", "out_for_delivery", "delivered"]
    const currentIndex = statusOrder.indexOf(currentStatus.toLowerCase())

    return allStatuses.map((status, index) => {
      const historyItem = statusHistory.find((h) => h.status.toLowerCase() === status.key)
      const isCompleted = index <= currentIndex
      const isCurrent = index === currentIndex

      return {
        ...status,
        completed: isCompleted,
        current: isCurrent,
        date: historyItem?.created_at
          ? new Date(historyItem.created_at).toLocaleString()
          : isCompleted
            ? "Completed"
            : "Pending",
      }
    })
  }

  return (
    <div className="min-h-screen">
      {/* Static Hero Section */}
      <div className="relative bg-gray-900 h-64 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('/contact/furniture-showcase-1.jpg')",
          }}
        />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Track Your Order</h1>
          <p className="text-lg opacity-90">Home / Track Your Order</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Track Your Order Status</h2>
            <p className="text-gray-600">Enter your order ID to get real-time updates on your furniture delivery</p>
            {lastUpdated && <p className="text-sm text-gray-500 mt-2">Last updated: {lastUpdated}</p>}
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="order-input" className="block text-sm font-medium text-gray-700 mb-2">
                    Order ID
                  </label>
                  <div className="flex space-x-4">
                    <Input
                      id="order-input"
                      type="text"
                      placeholder="Enter order ID (e.g., ORD-20250716-ABC123)"
                      value={orderInput}
                      onChange={(e) => setOrderInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => handleTrackOrder()}
                      disabled={!orderInput.trim() || isLoading}
                      className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-8"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Tracking...
                        </div>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Track Order
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tracking Results */}
        {trackingResult && (
          <div className="space-y-8">
            {/* Order Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Order ID</h3>
                    <p className="text-lg font-semibold text-gray-900">{trackingResult.order_number}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(trackingResult.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Current Status</h3>
                    <p className="text-lg font-semibold text-red-600">
                      {trackingResult.status.replace("_", " ").toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                    <p className="text-lg font-semibold text-gray-900">
                      ₨{trackingResult.total_amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-4">
                  {trackingResult.items?.map((item: any, index: number) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src="/placeholder.svg?height=64&width=64"
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-600">₨{item.unit_price.toLocaleString()} each</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₨{item.total_price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Timeline</h3>
                <div className="space-y-6">
                  {getStatusSteps(trackingResult.status, trackingResult.status_history || []).map(
                    (step: any, index: number) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0">{getStatusIcon(step.key, step.completed)}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4
                              className={`font-medium ${step.completed ? "text-gray-900" : "text-gray-500"} ${step.current ? "text-red-600" : ""}`}
                            >
                              {step.label}
                            </h4>
                            <span className={`text-sm ${step.completed ? "text-gray-600" : "text-gray-400"}`}>
                              {step.date}
                            </span>
                          </div>
                          <p className={`text-sm mt-1 ${step.completed ? "text-gray-600" : "text-gray-400"}`}>
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-900">{trackingResult.customer_name}</p>
                      <p className="text-sm text-gray-600">{trackingResult.customer_email}</p>
                      <p className="text-sm text-gray-600">{trackingResult.customer_phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h3>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-red-600 mr-3 mt-1" />
                    <div>
                      <p className="text-gray-700">{trackingResult.customer_address}</p>
                      <p className="text-gray-700">
                        {trackingResult.customer_city} {trackingResult.customer_zip}
                      </p>
                      {trackingResult.customer_landmark && (
                        <p className="text-sm text-gray-600 mt-1">Near: {trackingResult.customer_landmark}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Support Section */}
            <Card className="bg-gradient-to-r from-red-600 to-orange-500 text-white">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Need Help with Your Order?</h3>
                  <p className="mb-6">
                    Our customer support team is here to assist you with any questions about your delivery.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <Button variant="outline" className="bg-white text-red-600 hover:bg-gray-100 border-white">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Support
                    </Button>
                    <Button variant="outline" className="bg-white text-red-600 hover:bg-gray-100 border-white">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp Chat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Help Section */}
        {!trackingResult && !error && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Where can I find my order ID?</h3>
                  <p className="text-gray-600 text-sm">
                    Your order ID is sent to your email after purchase confirmation. It starts with ORD- followed by
                    date and numbers (e.g., ORD-20250716-ABC123).
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">How often is tracking updated?</h3>
                  <p className="text-gray-600 text-sm">
                    Tracking information is updated in real-time as your package moves through our delivery network.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What if my order is delayed?</h3>
                  <p className="text-gray-600 text-sm">
                    Contact our support team immediately. We'll investigate and provide updated delivery information.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I change my delivery address?</h3>
                  <p className="text-gray-600 text-sm">
                    Address changes are possible before shipment. Contact us immediately if you need to update your
                    address.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
