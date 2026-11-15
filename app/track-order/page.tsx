"use client"

import { Suspense, useState, useEffect, useCallback } from "react"
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSearchParams } from "next/navigation"
import { BankAccountDetails } from "@/components/payment/bank-account-details"
import {
  SUPPORT_CONTACT,
  calculatePaymentBreakdown,
  formatPKR,
  formatPaymentMethodLabel,
  formatPaymentStatusLabel,
} from "@/lib/payment-utils"

function TrackOrderContent() {
  const [orderInput, setOrderInput] = useState("")
  const [trackingResult, setTrackingResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const searchParams = useSearchParams()

  const handleTrackOrder = useCallback(
    async (orderNumber?: string, silent = false) => {
      const orderToTrack = (orderNumber ?? orderInput).trim()
      if (!orderToTrack) return

      if (!silent) {
        setIsLoading(true)
        setError("")
      }

      try {
        const timestamp = Date.now()
        const response = await fetch(`/api/track-order/${encodeURIComponent(orderToTrack)}?_t=${timestamp}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
          cache: "no-store",
        })

        const data = await response.json()

        if (data.success && data.data) {
          setTrackingResult(data.data)
          setLastUpdated(new Date().toLocaleTimeString())
          setError("")
        } else {
          if (!silent) {
            setError(data.error || "Order not found")
            setTrackingResult(null)
          }
        }
      } catch (err) {
        console.error("Track order error:", err)
        if (!silent) {
          setError("Failed to track order. Please try again.")
          setTrackingResult(null)
        }
      } finally {
        if (!silent) {
          setIsLoading(false)
        }
      }
    },
    [orderInput],
  )

  useEffect(() => {
    const orderFromUrl = searchParams.get("order")
    if (orderFromUrl) {
      setOrderInput(orderFromUrl)
      handleTrackOrder(orderFromUrl)
    }
  }, [searchParams, handleTrackOrder])

  useEffect(() => {
    if (trackingResult?.order_number) {
      const interval = setInterval(() => {
        handleTrackOrder(trackingResult.order_number, true)
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [trackingResult?.order_number, handleTrackOrder])

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

  const getStatusSteps = (currentStatus: string, statusHistory: any[], paymentStatus?: string) => {
    const isPaymentConfirmed = paymentStatus === "paid" || paymentStatus === "advance_paid"
    const allStatuses = [
      {
        key: "pending",
        label: "Order Placed",
        description: isPaymentConfirmed
          ? "Your order and advance payment have been confirmed"
          : "Your order has been placed and is awaiting 50% advance payment verification",
      },
      { key: "processing", label: "Processing", description: "Order is being prepared for shipment" },
      { key: "shipped", label: "Shipped", description: "Package has been dispatched" },
      { key: "out_for_delivery", label: "Out for Delivery", description: "Package is on the way to your location" },
      { key: "delivered", label: "Delivered", description: "Package delivered successfully" },
    ]

    const statusOrder = ["pending", "processing", "shipped", "out_for_delivery", "delivered"]
    const normalized = (currentStatus || "pending").toLowerCase()
    const currentIndex = Math.max(0, statusOrder.indexOf(normalized === "confirmed" ? "processing" : normalized))

    return allStatuses.map((status, index) => {
      const historyItem = statusHistory.find((h) => String(h.status || "").toLowerCase() === status.key)
      const isCompleted = index <= currentIndex
      const isCurrent = index === currentIndex

      return {
        ...status,
        completed: isCompleted,
        current: isCurrent,
        description: historyItem?.description || status.description,
        date: historyItem?.created_at
          ? new Date(historyItem.created_at).toLocaleString()
          : isCompleted
            ? "Completed"
            : "Pending",
      }
    })
  }

  const fallbackBreakdown = calculatePaymentBreakdown(trackingResult?.total_amount_num ?? 0)
  const subtotalNum = Number(trackingResult?.subtotal ?? 0)
  const deliveryChargeNum = Number(trackingResult?.delivery_charge ?? 0)
  const totalNum = Number(trackingResult?.total_amount_num ?? subtotalNum + deliveryChargeNum)
  const advanceNum = Number(trackingResult?.advance_amount ?? fallbackBreakdown.advanceAmount)
  const remainingNum = Number(trackingResult?.remaining_amount ?? fallbackBreakdown.remainingAmount)
  const paymentStatus = String(trackingResult?.payment_status || "pending").toLowerCase()
  const isPaid = paymentStatus === "paid"

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Track Your Order Status</h2>
            <p className="text-gray-600">Enter your order ID to get real-time updates on your furniture delivery</p>
            {lastUpdated && <p className="text-sm text-gray-500 mt-2">Last updated: {lastUpdated}</p>}
          </div>

          <Card>
            <CardContent className="p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleTrackOrder()
                }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="order-input" className="block text-sm font-medium text-gray-700 mb-2">
                    Order ID
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      id="order-input"
                      type="text"
                      placeholder="Enter order ID (e.g., ORD-20250716-ABC123)"
                      value={orderInput}
                      onChange={(e) => setOrderInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
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
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Tracking Results */}
        {trackingResult && (
          <div className="space-y-8">
            {/* Order Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Order ID</h3>
                    <p className="text-lg font-semibold text-gray-900 font-mono break-all">
                      {trackingResult.order_number}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(trackingResult.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Order Status</h3>
                    <p className="text-lg font-semibold text-red-600">
                      {String(trackingResult.status || "pending").replace(/_/g, " ").toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
                    <div className="mt-1">
                      <Badge
                        variant="secondary"
                        className={
                          isPaid
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }
                      >
                        {formatPaymentStatusLabel(trackingResult.payment_status)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Total Order Amount</h3>
                    <p className="text-lg font-bold text-gray-900">{formatPKR(totalNum)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ordered Items */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Order Items ({trackingResult.items?.length || 0})
                </h3>
                {Array.isArray(trackingResult.items) && trackingResult.items.length > 0 ? (
                  <div className="space-y-4">
                    {trackingResult.items.map((item: any, index: number) => (
                      <div
                        key={item.id ?? index}
                        className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                          <img
                            src={item.product_image || "/placeholder.svg?height=80&width=80"}
                            alt={item.product_name || "Ordered product"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.currentTarget
                              if (!target.src.endsWith("/placeholder.svg")) {
                                target.src = "/placeholder.svg"
                              }
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-base">{item.product_name}</h4>
                          {item.variation && <p className="text-xs text-gray-500 mt-0.5">Variation: {item.variation}</p>}
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-1">
                            <span>Quantity: {item.quantity}</span>
                            <span>Unit Price: {formatPKR(item.unit_price)}</span>
                          </div>
                        </div>
                        <div className="sm:text-right">
                          <p className="text-xs text-gray-500">Line Total</p>
                          <p className="font-bold text-gray-900 text-base">{formatPKR(item.total_price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <Package className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">No line items recorded for this order.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment & Price Breakdown */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-orange-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Payment &amp; Order Breakdown</h3>
                  </div>
                  <span className="text-sm font-medium text-orange-700 bg-orange-50 px-3 py-1 rounded-md border border-orange-200 self-start sm:self-auto">
                    {trackingResult.payment_method_label || formatPaymentMethodLabel(trackingResult.payment_method)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-900">{formatPKR(subtotalNum)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Charges</span>
                      <span className="font-medium text-gray-900">
                        {deliveryChargeNum === 0 ? "Free" : formatPKR(deliveryChargeNum)}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-bold border-t pt-3">
                      <span className="text-gray-900">Total Order Amount</span>
                      <span className="text-gray-900">{formatPKR(totalNum)}</span>
                    </div>
                  </div>

                  <div className="space-y-3 bg-orange-50 p-4 rounded-xl border border-orange-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-orange-900 font-medium">50% Advance Payment</span>
                      <span className="font-bold text-orange-700">{formatPKR(advanceNum)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 font-medium">Remaining 50% on Delivery</span>
                      <span className="font-bold text-gray-900">{formatPKR(remainingNum)}</span>
                    </div>
                    <p className="text-xs text-orange-800 pt-2 border-t border-orange-200">
                      {isPaid
                        ? "Payment completed. Thank you!"
                        : `Please transfer ${formatPKR(advanceNum)} advance to confirm your order and share the screenshot via WhatsApp (${SUPPORT_CONTACT.whatsappDisplay}) or email (${SUPPORT_CONTACT.email}).`}
                    </p>
                  </div>
                </div>

                {!isPaid && <BankAccountDetails title="Bank Account Details for Advance Transfer" />}
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Timeline</h3>
                <div className="space-y-6">
                  {getStatusSteps(
                    trackingResult.status,
                    trackingResult.status_history || [],
                    trackingResult.payment_status,
                  ).map((step: any, index: number) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">{getStatusIcon(step.key, step.completed)}</div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
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
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">{trackingResult.customer_name}</p>
                    <p className="text-sm text-gray-600">{trackingResult.customer_email}</p>
                    <p className="text-sm text-gray-600">{trackingResult.customer_phone}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h3>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-red-600 mr-3 mt-1 shrink-0" />
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
                    Our customer support team is here to assist you with any questions about your delivery or advance
                    payment verification.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <Button
                      asChild
                      variant="outline"
                      className="bg-white text-red-600 hover:bg-gray-100 border-white"
                    >
                      <a href={SUPPORT_CONTACT.phoneHref}>
                        <Phone className="w-4 h-4 mr-2" />
                        Call Support
                      </a>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      className="bg-white text-red-600 hover:bg-gray-100 border-white"
                    >
                      <a href={SUPPORT_CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp Chat
                      </a>
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
                    Your order ID is shown immediately on the order confirmation page and sent to your email. It starts
                    with ORD- followed by date and characters (e.g., ORD-20250716-ABC123).
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
                    Contact our support team immediately. We&apos;ll investigate and provide updated delivery
                    information.
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

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  )
}
