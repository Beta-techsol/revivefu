"use client"

import { useState } from "react"
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function TrackOrderPage() {
  const [orderInput, setOrderInput] = useState("")
  const [trackingResult, setTrackingResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleTrackOrder = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setTrackingResult({
        orderId: "#3210",
        customerName: "John Doe",
        orderDate: "2024-01-15",
        estimatedDelivery: "2024-01-18",
        currentStatus: "In Transit",
        items: [
          { name: "Modern Sectional Sofa", quantity: 1, image: "/shop/products/sofa-1.jpg" },
          { name: "Coffee Table", quantity: 1, image: "/shop/products/coffee-table-1.jpg" },
        ],
        trackingSteps: [
          {
            status: "Order Placed",
            date: "2024-01-15 10:30 AM",
            completed: true,
            description: "Your order has been confirmed and payment received",
          },
          {
            status: "Processing",
            date: "2024-01-15 02:15 PM",
            completed: true,
            description: "Order is being prepared for shipment",
          },
          {
            status: "Shipped",
            date: "2024-01-16 09:00 AM",
            completed: true,
            description: "Package has been dispatched via TCS",
          },
          {
            status: "In Transit",
            date: "2024-01-17 11:30 AM",
            completed: true,
            description: "Package is on the way to your location",
          },
          {
            status: "Out for Delivery",
            date: "Expected: 2024-01-18 09:00 AM",
            completed: false,
            description: "Package will be delivered today",
          },
          { status: "Delivered", date: "Pending", completed: false, description: "Package delivered successfully" },
        ],
        courierInfo: {
          company: "TCS",
          trackingNumber: "TCS123456789",
          contactNumber: "+92-21-111-123-456",
        },
        deliveryAddress: "House # 123, Block A, Gulshan-e-Iqbal, Karachi",
      })
      setIsLoading(false)
    }, 1500)
  }

  const getStatusIcon = (status: string, completed: boolean) => {
    if (completed) {
      return <CheckCircle className="w-6 h-6 text-green-600" />
    }

    switch (status) {
      case "Order Placed":
        return <Package className="w-6 h-6 text-gray-400" />
      case "Processing":
        return <Clock className="w-6 h-6 text-gray-400" />
      case "Shipped":
      case "In Transit":
      case "Out for Delivery":
        return <Truck className="w-6 h-6 text-gray-400" />
      case "Delivered":
        return <CheckCircle className="w-6 h-6 text-gray-400" />
      default:
        return <Clock className="w-6 h-6 text-gray-400" />
    }
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
            <p className="text-gray-600">
              Enter your order ID or email address to get real-time updates on your furniture delivery
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="order-input" className="block text-sm font-medium text-gray-700 mb-2">
                    Order ID or Email Address
                  </label>
                  <div className="flex space-x-4">
                    <Input
                      id="order-input"
                      type="text"
                      placeholder="Enter order ID (e.g., #3210) or email address"
                      value={orderInput}
                      onChange={(e) => setOrderInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleTrackOrder}
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
                    <p className="text-lg font-semibold text-gray-900">{trackingResult.orderId}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
                    <p className="text-lg font-semibold text-gray-900">{trackingResult.orderDate}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Current Status</h3>
                    <p className="text-lg font-semibold text-red-600">{trackingResult.currentStatus}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Expected Delivery</h3>
                    <p className="text-lg font-semibold text-gray-900">{trackingResult.estimatedDelivery}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-4">
                  {trackingResult.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
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
                  {trackingResult.trackingSteps.map((step: any, index: number) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">{getStatusIcon(step.status, step.completed)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${step.completed ? "text-gray-900" : "text-gray-500"}`}>
                            {step.status}
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
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Courier Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Truck className="w-5 h-5 text-red-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{trackingResult.courierInfo.company}</p>
                        <p className="text-sm text-gray-600">Tracking: {trackingResult.courierInfo.trackingNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-red-600 mr-3" />
                      <p className="text-gray-700">{trackingResult.courierInfo.contactNumber}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h3>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-red-600 mr-3 mt-1" />
                    <p className="text-gray-700">{trackingResult.deliveryAddress}</p>
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
        {!trackingResult && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Where can I find my order ID?</h3>
                  <p className="text-gray-600 text-sm">
                    Your order ID is sent to your email after purchase confirmation. It starts with # followed by
                    numbers (e.g., #3210).
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
