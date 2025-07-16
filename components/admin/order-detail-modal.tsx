"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Mail, Package, Clock, User } from "lucide-react"

interface OrderDetailModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
}

interface OrderItem {
  id: string
  product_name: string
  product_sku: string
  quantity: number
  unit_price: number
  total_price: number
}

interface StatusHistory {
  id: string
  status: string
  description: string
  created_at: string
}

interface OrderDetails {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  customer_city: string
  customer_zip: string
  customer_landmark: string
  special_instructions: string
  subtotal: number
  delivery_charge: number
  total_amount: number
  status: string
  payment_method: string
  created_at: string
  items: OrderItem[]
  history: StatusHistory[]
}

export function OrderDetailModal({ isOpen, onClose, orderId }: OrderDetailModalProps) {
  const [order, setOrder] = useState<OrderDetails | null>(null)
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

      const response = await fetch(`/api/admin/orders/${orderId}`)
      const data = await response.json()

      if (data.success) {
        setOrder(data.data)
      } else {
        setError(data.error || "Failed to fetch order details")
      }
    } catch (err) {
      setError("Failed to fetch order details")
      console.error("Error fetching order details:", err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-800"
      case "processing":
      case "preparing":
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-[#C53D39] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (error || !order) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error || "Order not found"}</p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details - {order.order_number}</span>
            <Badge className={getStatusColor(order.status)}>{order.status.replace("_", " ").toUpperCase()}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Customer Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{order.customer_name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{order.customer_email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{order.customer_phone}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                <div>
                  <p>{order.customer_address}</p>
                  <p>
                    {order.customer_city} {order.customer_zip}
                  </p>
                  {order.customer_landmark && (
                    <p className="text-sm text-gray-600">Landmark: {order.customer_landmark}</p>
                  )}
                </div>
              </div>
              {order.special_instructions && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">Special Instructions:</p>
                  <p className="text-sm text-yellow-700">{order.special_instructions}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Order Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-medium font-mono">{order.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span>{formatDate(order.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="capitalize">{order.payment_method}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>₨{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Charge:</span>
                <span>₨{order.delivery_charge.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount:</span>
                <span>₨{order.total_amount.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items ({order.items.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product_name}</h4>
                    {item.product_sku && <p className="text-sm text-gray-600">SKU: {item.product_sku}</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ₨{item.unit_price.toLocaleString()} x {item.quantity}
                    </p>
                    <p className="text-sm text-gray-600">₨{item.total_price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status History */}
        {order.history && order.history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Status History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.history.map((entry, index) => (
                  <div key={entry.id} className="flex items-start space-x-3">
                    <div className={`w-3 h-3 rounded-full mt-2 ${index === 0 ? "bg-[#C53D39]" : "bg-gray-300"}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(entry.status)}>
                          {entry.status.replace("_", " ").toUpperCase()}
                        </Badge>
                        <span className="text-sm text-gray-500">{formatDate(entry.created_at)}</span>
                      </div>
                      {entry.description && <p className="text-sm text-gray-600 mt-1">{entry.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => window.open(`/track-order?order=${order.order_number}`, "_blank")}
            className="bg-[#C53D39] hover:bg-[#B12E2A]"
          >
            View Tracking Page
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
