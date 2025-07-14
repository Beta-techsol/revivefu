"use client"

import { useState } from "react"
import { Search, Package, Truck, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BreadcrumbComponent } from "@/components/ui/breadcrumb"

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("")
  const [email, setEmail] = useState("")
  const [trackingData, setTrackingData] = useState(null)

  const handleTrackOrder = () => {
    // Mock tracking data
    setTrackingData({
      orderId: "ORD-001234",
      status: "In Transit",
      estimatedDelivery: "December 20, 2024",
      currentLocation: "Distribution Center - Los Angeles",
      steps: [
        { title: "Order Placed", description: "Your order has been confirmed", date: "Dec 15, 2024", completed: true },
        { title: "Processing", description: "Your order is being prepared", date: "Dec 16, 2024", completed: true },
        { title: "Shipped", description: "Your order has been shipped", date: "Dec 17, 2024", completed: true },
        {
          title: "In Transit",
          description: "Your order is on the way",
          date: "Dec 18, 2024",
          completed: true,
          current: true,
        },
        {
          title: "Out for Delivery",
          description: "Your order is out for delivery",
          date: "Dec 20, 2024",
          completed: false,
        },
        { title: "Delivered", description: "Your order has been delivered", date: "Dec 20, 2024", completed: false },
      ],
      items: [
        { name: "Modern Sectional Sofa", quantity: 1, image: "/shop/products/sofa-1.jpg" },
        { name: "Coffee Table Set", quantity: 1, image: "/shop/products/coffee-table-1.jpg" },
      ],
    })
  }

  const breadcrumbItems = [{ label: "Account", href: "/account" }, { label: "Track Order" }]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <BreadcrumbComponent items={breadcrumbItems} />

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
            <p className="text-gray-600">Enter your order details to track your shipment</p>
          </div>

          {/* Track Order Form */}
          <Card className="bg-white shadow-lg border-0 rounded-xl mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Order Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="orderId" className="text-sm font-medium text-gray-700">
                    Order ID
                  </Label>
                  <div className="relative mt-1">
                    <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="orderId"
                      type="text"
                      placeholder="Enter your order ID"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="pl-10 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                    />
                  </div>
                </div>
              </div>
              <Button
                onClick={handleTrackOrder}
                className="w-full mt-6 h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-xl transition-all duration-300"
              >
                Track Order
              </Button>
            </CardContent>
          </Card>

          {/* Tracking Results */}
          {trackingData && (
            <div className="space-y-6">
              {/* Order Status Card */}
              <Card className="bg-white shadow-lg border-0 rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Order {trackingData.orderId}</h2>
                      <p className="text-gray-600">
                        Current Status: <span className="font-medium text-blue-600">{trackingData.status}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Estimated Delivery</p>
                      <p className="font-semibold text-gray-900">{trackingData.estimatedDelivery}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <Truck className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">Your order is in transit</p>
                        <p className="text-sm text-blue-700">Current location: {trackingData.currentLocation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Steps */}
                  <div className="space-y-4">
                    {trackingData.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.completed
                              ? step.current
                                ? "bg-blue-500 text-white"
                                : "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          {step.completed ? (
                            step.current ? (
                              <Truck className="w-4 h-4" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className={`font-medium ${step.completed ? "text-gray-900" : "text-gray-500"}`}>
                              {step.title}
                            </h3>
                            <span className="text-sm text-gray-500">{step.date}</span>
                          </div>
                          <p className={`text-sm ${step.completed ? "text-gray-600" : "text-gray-400"}`}>
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card className="bg-white shadow-lg border-0 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trackingData.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
