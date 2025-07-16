"use client"

import { useState, useEffect } from "react"
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"

interface OrderItem {
  id: string
  name: string
  sku: string
  quantity: number
  price: number
  image?: string
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
  total_amount: number
  status: string
  payment_method: string
  created_at: string
  updated_at: string
  items: OrderItem[]
}

interface OrderDetailModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
}

export function OrderDetailModal({ isOpen, onClose, orderId }: OrderDetailModalProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetails()
    }
  }, [isOpen, orderId])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching order details for ID:", orderId)

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Order details response:", data)

      if (data.success && data.data) {
        // Parse items if they're stored as JSON string
        const orderData = data.data
        if (typeof orderData.items === "string") {
          try {
            orderData.items = JSON.parse(orderData.items)
          } catch (e) {
            console.error("Error parsing order items:", e)
            orderData.items = []
          }
        }

        // Ensure items is an array
        if (!Array.isArray(orderData.items)) {
          orderData.items = []
        }

        setOrder(orderData)
      } else {
        setError(data.error || "Failed to fetch order details")
      }
    } catch (error) {
      console.error("Error fetching order details:", error)
      setError("Failed to fetch order details")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
      case "out_for_delivery":
        return "bg-purple-100 text-purple-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />
      case "processing":
        return <Package className="w-4 h-4" />
      case "shipped":
      case "out_for_delivery":
        return <Truck className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const getStatusLabel = (status: string) => {
    const statusLabels: { [key: string]: string } = {
      pending: "Order Placed",
      processing: "Processing",
      shipped: "Shipped",
      out_for_delivery: "Out for Delivery",
      delivered: "Delivered",
      cancelled: "Cancelled",
    }
    return statusLabels[status.toLowerCase()] || status.replace("_", " ").toUpperCase()
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-montserrat">
            {loading ? "Loading..." : order ? `Order ${order.order_number}` : "Order Details"}
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-[#C53D39] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-600 font-poppins">{error}</p>
            <Button onClick={fetchOrderDetails} className="mt-4 bg-transparent" variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {!loading && !error && order && (
          <div className="space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat">Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="font-poppins">Current Status:</span>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{getStatusLabel(order.status)}</span>
                  </Badge>
                </div>
                <div className="mt-4 text-sm text-gray-600 font-poppins">
                  <p>Order placed on: {new Date(order.created_at).toLocaleDateString()}</p>
                  <p>Last updated: {new Date(order.updated_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Items */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-montserrat">Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, index) => (
                          <div key={item.id || index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <div className="w-16 h-16 bg-white rounded-lg overflow-hidden">
                              <Image
                                src={item.image || "/placeholder.svg?height=64&width=64"}
                                alt={item.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 font-poppins">{item.name}</h3>
                              <p className="text-sm text-gray-600 font-poppins">SKU: {item.sku}</p>
                              <p className="text-sm text-gray-600 font-poppins">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900 font-poppins">
                                ₨{(item.price * item.quantity).toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-600 font-poppins">₨{item.price.toLocaleString()} each</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 font-poppins">No items found for this order</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Customer & Order Info */}
              <div className="space-y-4">
                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-montserrat">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="font-poppins">{order.customer_name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="font-poppins">{order.customer_email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="font-poppins">{order.customer_phone}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-montserrat">Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                      <div className="font-poppins text-sm">
                        <p>{order.customer_address}</p>
                        <p>
                          {order.customer_city} {order.customer_zip}
                        </p>
                        {order.customer_landmark && <p>Landmark: {order.customer_landmark}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-montserrat">Payment Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="font-poppins">{order.payment_method || "Cash on Delivery"}</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between font-semibold text-lg font-poppins">
                          <span>Total:</span>
                          <span className="text-[#C53D39]">₨{order.total_amount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Special Instructions */}
                {order.special_instructions && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-montserrat">Special Instructions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 font-poppins">{order.special_instructions}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
