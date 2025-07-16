"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"

interface OrderItem {
  id: string
  product_id: string
  name: string
  product_name?: string
  sku: string
  product_sku?: string
  quantity: number
  price: number
  image?: string
  product_image?: string
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
  subtotal?: number
  delivery_charge?: number
  total_amount: number
  status: string
  payment_method: string
  created_at: string
  updated_at: string
  items: OrderItem[]
}

const ORDER_STATUSES = [
  { value: "pending", label: "Order Placed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
]

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const getParams = async () => {
      try {
        const resolvedParams = await params
        console.log("Page: Resolved params:", resolvedParams)
        setOrderId(resolvedParams.id)
      } catch (error) {
        console.error("Page: Error resolving params:", error)
        setError("Invalid order ID")
        setLoading(false)
      }
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId])

  const fetchOrderDetails = async () => {
    if (!orderId) return

    try {
      setLoading(true)
      setError(null)

      console.log("Page: Fetching order details for ID:", orderId)

      if (orderId === "undefined" || orderId === "null") {
        throw new Error("Invalid order ID")
      }

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

      console.log("Page: Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Page: Response error:", errorText)
        throw new Error(`HTTP ${response.status}: Failed to fetch order details`)
      }

      const data = await response.json()
      console.log("Page: Order details response:", data)

      if (data.success && data.data) {
        const orderData = data.data

        // Handle items parsing - they might be stored as JSON string
        let items = []
        if (orderData.items) {
          if (typeof orderData.items === "string") {
            try {
              items = JSON.parse(orderData.items)
            } catch (e) {
              console.error("Page: Error parsing order items JSON:", e)
              items = []
            }
          } else if (Array.isArray(orderData.items)) {
            items = orderData.items
          }
        }

        // Ensure items is always an array and normalize the data
        const normalizedItems = Array.isArray(items)
          ? items.map((item: any) => ({
              id: item.id || `item-${Math.random()}`,
              product_id: item.product_id || "",
              name: item.name || item.product_name || "Unknown Product",
              sku: item.sku || item.product_sku || "N/A",
              quantity: Number.parseInt(item.quantity) || 1,
              price: Number.parseFloat(item.price) || 0,
              image: item.image || item.product_image || null,
            }))
          : []

        const processedOrder: Order = {
          ...orderData,
          items: normalizedItems,
          total_amount: Number.parseFloat(orderData.total_amount) || 0,
          subtotal: Number.parseFloat(orderData.subtotal) || 0,
          delivery_charge: Number.parseFloat(orderData.delivery_charge) || 0,
        }

        console.log("Page: Processed order:", processedOrder)
        setOrder(processedOrder)
      } else {
        throw new Error(data.error || "Failed to fetch order details")
      }
    } catch (error) {
      console.error("Page: Error fetching order details:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch order details")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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
    switch (status?.toLowerCase()) {
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
    const statusObj = ORDER_STATUSES.find((s) => s.value === status?.toLowerCase())
    return statusObj ? statusObj.label : status?.replace("_", " ").toUpperCase() || "Unknown"
  }

  const formatCurrency = (amount: number) => {
    if (isNaN(amount)) return "₨0"
    return `₨${Math.round(amount).toLocaleString()}`
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order) return

    try {
      setUpdating(true)
      console.log(`Page: Updating order ${order.id} status to ${newStatus}`)

      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
        body: JSON.stringify({
          status: newStatus,
          customer_name: order.customer_name,
          customer_email: order.customer_email,
          customer_phone: order.customer_phone,
          customer_address: order.customer_address,
          customer_city: order.customer_city,
          customer_zip: order.customer_zip,
          customer_landmark: order.customer_landmark,
          special_instructions: order.special_instructions,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Page: Status update successful:", result)

        // Update local state
        setOrder((prev) => (prev ? { ...prev, status: newStatus, updated_at: new Date().toISOString() } : null))

        toast({
          title: "Order Status Updated",
          description: `Order ${order.order_number} status changed to ${getStatusLabel(newStatus)}`,
        })
      } else {
        const errorData = await response.json()
        console.error("Page: Status update failed:", errorData)
        toast({
          title: "Error",
          description: errorData.error || "Failed to update order status",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Page: Status update exception:", error)
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#C53D39] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="text-center">
          <Button onClick={fetchOrderDetails} variant="outline" className="mr-4 bg-transparent">
            Try Again
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/orders">Back to Orders</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500 font-poppins mb-4">Order not found</p>
          <Button asChild variant="outline">
            <Link href="/admin/orders">Back to Orders</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild className="bg-transparent">
            <Link href="/admin/orders">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-montserrat">Order {order.order_number}</h1>
            <p className="text-gray-600 font-poppins">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
                disabled={updating}
              >
                {updating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  getStatusIcon(order.status)
                )}
                <span className="ml-2">Update Status</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {ORDER_STATUSES.map((status) => (
                <DropdownMenuItem
                  key={status.value}
                  onClick={() => handleStatusUpdate(status.value)}
                  disabled={updating}
                >
                  {getStatusIcon(status.value)}
                  <span className="ml-2">{status.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Order Items ({order.items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div key={item.id || index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg?height=64&width=64"}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 font-poppins truncate">{item.name}</h3>
                        <p className="text-sm text-gray-600 font-poppins">SKU: {item.sku}</p>
                        <p className="text-sm text-gray-600 font-poppins">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-gray-900 font-poppins">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                        <p className="text-sm text-gray-600 font-poppins">{formatCurrency(item.price)} each</p>
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

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 font-poppins">Order Placed</p>
                    <p className="text-sm text-gray-600 font-poppins">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                </div>
                {order.status !== "pending" && (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 font-poppins">{getStatusLabel(order.status)}</p>
                      <p className="text-sm text-gray-600 font-poppins">
                        {new Date(order.updated_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Customer Info */}
        <div className="space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-poppins">Current Status:</span>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{getStatusLabel(order.status)}</span>
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="font-poppins truncate">{order.customer_name || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="font-poppins truncate">{order.customer_email || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="font-poppins">{order.customer_phone || "N/A"}</span>
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
                <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                <div className="font-poppins text-sm">
                  <p>{order.customer_address || "N/A"}</p>
                  <p>
                    {order.customer_city || ""} {order.customer_zip || ""}
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
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {order.subtotal && (
                  <div className="flex justify-between text-sm font-poppins">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                )}
                {order.delivery_charge && (
                  <div className="flex justify-between text-sm font-poppins">
                    <span>Delivery:</span>
                    <span>{formatCurrency(order.delivery_charge)}</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg font-poppins">
                    <span>Total:</span>
                    <span className="text-[#C53D39]">{formatCurrency(order.total_amount)}</span>
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
  )
}
