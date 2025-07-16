"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Phone, Mail, Package } from "lucide-react"

interface OrderDetailModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
}

export function OrderDetailModal({ isOpen, onClose, orderId }: OrderDetailModalProps) {
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetails()
    }
  }, [isOpen, orderId])

  const fetchOrderDetails = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`)
      const data = await response.json()

      if (data.success) {
        setOrder(data.data)
      } else {
        console.error("Failed to fetch order details:", data.error)
      }
    } catch (error) {
      console.error("Error fetching order details:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-[#C53D39] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!order) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="text-center py-8">
            <p className="text-gray-500">Order not found</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details - {order.order_number}</span>
            <Badge className={getStatusColor(order.status)}>{order.status?.replace("_", " ").toUpperCase()}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium">{order.payment_method?.toUpperCase() || "COD"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="font-medium">{order.customer_name}</p>
                  <p className="text-sm text-gray-600">{order.customer_email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <p className="text-sm">{order.customer_phone}</p>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm">{order.customer_address}</p>
                  <p className="text-sm text-gray-600">
                    {order.customer_city} {order.customer_zip}
                  </p>
                  {order.customer_landmark && <p className="text-sm text-gray-600">Near: {order.customer_landmark}</p>}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} × ₨{item.unit_price?.toLocaleString()}
                    </p>
                    {item.product_sku && <p className="text-xs text-gray-500">SKU: {item.product_sku}</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₨{item.total_price?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Order Total */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span>₨{order.subtotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Charge:</span>
              <span>₨{order.delivery_charge?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total Amount:</span>
              <span className="text-[#C53D39]">₨{order.total_amount?.toLocaleString()}</span>
            </div>
          </div>

          {/* Special Instructions */}
          {order.special_instructions && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2">Special Instructions</h3>
                <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">{order.special_instructions}</p>
              </div>
            </>
          )}

          {/* Status History */}
          {order.status_history && order.status_history.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Order Timeline</h3>
                <div className="space-y-3">
                  {order.status_history.map((history: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#C53D39] rounded-full"></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium capitalize">{history.status.replace("_", " ")}</span>
                          <span className="text-sm text-gray-500">{new Date(history.created_at).toLocaleString()}</span>
                        </div>
                        {history.description && <p className="text-sm text-gray-600">{history.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
