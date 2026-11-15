"use client"

import { useState } from "react"
import { Search, Package, Truck, CheckCircle, Clock, CreditCard, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BreadcrumbComponent } from "@/components/ui/breadcrumb"
import { formatPKR, formatPaymentMethodLabel, formatPaymentStatusLabel } from "@/lib/payment-utils"

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("")
  const [email, setEmail] = useState("")
  const [trackingData, setTrackingData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleTrackOrder = async () => {
    const trimmedId = orderId.trim()
    if (!trimmedId) {
      setError("Please enter your Order ID.")
      return
    }

    setIsLoading(true)
    setError("")
    setTrackingData(null)

    try {
      const emailParam = email.trim() ? `&email=${encodeURIComponent(email.trim())}` : ""
      const response = await fetch(
        `/api/track-order/${encodeURIComponent(trimmedId)}?_t=${Date.now()}${emailParam}`,
        { cache: "no-store" },
      )
      const result = await response.json()

      if (result.success && result.data) {
        setTrackingData(result.data)
      } else {
        setError(result.error || "Order not found. Please check your Order ID and email.")
      }
    } catch (err) {
      console.error("Account track order error:", err)
      setError("Failed to fetch order details. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const breadcrumbItems = [{ label: "Account", href: "/account" }, { label: "Track Order" }]

  const getSteps = (currentStatus: string, history: any[]) => {
    const allStatuses = [
      { key: "pending", title: "Order Placed", description: "Order placed and awaiting 50% advance confirmation" },
      { key: "processing", title: "Processing", description: "Order is being prepared for shipment" },
      { key: "shipped", title: "Shipped", description: "Order has been dispatched" },
      { key: "out_for_delivery", title: "Out for Delivery", description: "Package is out for delivery" },
      { key: "delivered", title: "Delivered", description: "Order delivered successfully" },
    ]
    const order = ["pending", "processing", "shipped", "out_for_delivery", "delivered"]
    const normalized = (currentStatus || "pending").toLowerCase()
    const idx = Math.max(0, order.indexOf(normalized === "confirmed" ? "processing" : normalized))

    return allStatuses.map((step, i) => {
      const h = (history || []).find((item) => String(item.status || "").toLowerCase() === step.key)
      return {
        ...step,
        completed: i <= idx,
        current: i === idx,
        description: h?.description || step.description,
        date: h?.created_at ? new Date(h.created_at).toLocaleString() : i <= idx ? "Completed" : "Pending",
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <BreadcrumbComponent items={breadcrumbItems} />

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
            <p className="text-gray-600">Enter your order details to track your shipment</p>
          </div>

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
                      placeholder="Enter your order ID (e.g., ORD-...)"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="pl-10 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address (Optional)
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
              {error && <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
              <Button
                onClick={handleTrackOrder}
                disabled={isLoading}
                className="w-full mt-6 h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-xl transition-all duration-300"
              >
                {isLoading ? "Tracking..." : "Track Order"}
              </Button>
            </CardContent>
          </Card>

          {trackingData && (
            <div className="space-y-6">
              <Card className="bg-white shadow-lg border-0 rounded-xl">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Order {trackingData.order_number}</h2>
                      <p className="text-gray-600">
                        Current Status:{" "}
                        <span className="font-medium text-blue-600 uppercase">
                          {String(trackingData.status || "pending").replace(/_/g, " ")}
                        </span>
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800 mb-1">
                        {formatPaymentStatusLabel(trackingData.payment_status)}
                      </Badge>
                      <p className="text-sm text-gray-600">
                        Total: <strong className="text-gray-900">{formatPKR(trackingData.total_amount_num)}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Financial split */}
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 space-y-2 text-sm">
                    <div className="flex items-center gap-2 font-semibold text-orange-900">
                      <CreditCard className="w-4 h-4" />
                      <span>
                        {trackingData.payment_method_label || formatPaymentMethodLabel(trackingData.payment_method)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      <div>
                        <span className="text-gray-600">Total: </span>
                        <strong>{formatPKR(trackingData.total_amount_num)}</strong>
                      </div>
                      <div>
                        <span className="text-orange-800">50% Advance: </span>
                        <strong className="text-orange-700">{formatPKR(trackingData.advance_amount)}</strong>
                      </div>
                      <div>
                        <span className="text-gray-700">50% on Delivery: </span>
                        <strong>{formatPKR(trackingData.remaining_amount)}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Progress Steps */}
                  <div className="space-y-4">
                    {getSteps(trackingData.status, trackingData.status_history || []).map((step, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
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
                  {Array.isArray(trackingData.items) && trackingData.items.length > 0 ? (
                    <div className="space-y-4">
                      {trackingData.items.map((item: any, index: number) => (
                        <div key={item.id ?? index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                            <img
                              src={item.product_image || "/placeholder.svg"}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                            {item.variation && <p className="text-xs text-gray-500">Variation: {item.variation}</p>}
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity} × {formatPKR(item.unit_price)}
                            </p>
                          </div>
                          <div className="text-right font-semibold text-gray-900">{formatPKR(item.total_price)}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">No items found for this order.</p>
                  )}
                </CardContent>
              </Card>

              {/* Delivery Details */}
              <Card className="bg-white shadow-lg border-0 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                  <div className="text-sm text-gray-700 space-y-1">
                    <p className="font-semibold text-gray-900">{trackingData.customer_name}</p>
                    <p>{trackingData.customer_phone}</p>
                    <p>
                      {trackingData.customer_address}, {trackingData.customer_city} {trackingData.customer_zip}
                    </p>
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
