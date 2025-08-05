"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Truck,
  CalendarDays,
  Edit,
  Save,
  X,
} from "lucide-react"
import { toast } from "sonner"

interface OrderItem {
  id: number
  product_id: number
  name: string
  sku: string
  quantity: number
  price: number
  total: number
  image?: string
}

interface StatusHistory {
  id: number
  status: string
  description: string
  created_at: string
}

interface OrderDetails {
  id: number
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  customer_city: string
  customer_zip: string
  customer_landmark?: string
  special_instructions?: string
  subtotal: number
  delivery_charge: number
  total_amount: number
  status: string
  payment_method: string
  created_at: string
  updated_at: string
  items: OrderItem[]
  history: StatusHistory[]
}

const statusOptions = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "confirmed", label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  { value: "processing", label: "Processing", color: "bg-purple-100 text-purple-800" },
  { value: "shipped", label: "Shipped", color: "bg-indigo-100 text-indigo-800" },
  { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
]

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState<Partial<OrderDetails>>({})

  useEffect(() => {
    fetchOrderDetails()
  }, [params.id])

  const fetchOrderDetails = async () => {
    setLoading(true)
    try {
      console.log("Fetching order details for ID:", params.id)
      const response = await fetch(`/api/admin/orders/${params.id}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      const data = await response.json()
      console.log("Order details response:", data)

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to fetch order details")
      }

      if (data.success && data.data) {
        setOrder(data.data)
        setFormData(data.data)
      } else {
        throw new Error(data.error || "Invalid response format")
      }
    } catch (error) {
      console.error("Error fetching order details:", error)
      toast.error(`Failed to load order details: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData) return

    setSaving(true)
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to update order")
      }

      if (data.success) {
        toast.success("Order updated successfully")
        setEditMode(false)
        await fetchOrderDetails() // Refresh data
      } else {
        throw new Error(data.error || "Update failed")
      }
    } catch (error) {
      console.error("Error updating order:", error)
      toast.error(`Failed to update order: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setSaving(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = statusOptions.find((s) => s.value === status) || statusOptions[0]
    return (
      <Badge className={statusConfig.color} variant="secondary">
        {statusConfig.label}
      </Badge>
    )
  }

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === "string" ? Number.parseFloat(amount) : amount
    return isNaN(num) ? "₨0.00" : `₨${num.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500">Order not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Order #{order.order_number}</h1>
            <p className="text-gray-500">Created: {formatDate(order.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {getStatusBadge(order.status)}
          {editMode ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditMode(false)} disabled={saving}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          ) : (
            <Button onClick={() => setEditMode(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Order
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    {item.image && (
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=64&width=64"
                        }}
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm">Qty: {item.quantity}</span>
                        <span className="text-sm">Price: {formatCurrency(item.price)}</span>
                        <span className="text-sm font-medium">Total: {formatCurrency(item.total)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer_name">Name</Label>
                  {editMode ? (
                    <Input
                      id="customer_name"
                      value={formData.customer_name || ""}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm font-medium mt-1">{order.customer_name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="customer_email">Email</Label>
                  {editMode ? (
                    <Input
                      id="customer_email"
                      type="email"
                      value={formData.customer_email || ""}
                      onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p className="text-sm">{order.customer_email}</p>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="customer_phone">Phone</Label>
                  {editMode ? (
                    <Input
                      id="customer_phone"
                      value={formData.customer_phone || ""}
                      onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="text-sm">{order.customer_phone}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customer_address">Address</Label>
                {editMode ? (
                  <Textarea
                    id="customer_address"
                    value={formData.customer_address || ""}
                    onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
                    rows={2}
                  />
                ) : (
                  <p className="text-sm mt-1">{order.customer_address}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer_city">City</Label>
                  {editMode ? (
                    <Input
                      id="customer_city"
                      value={formData.customer_city || ""}
                      onChange={(e) => setFormData({ ...formData, customer_city: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm mt-1">{order.customer_city}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="customer_zip">ZIP Code</Label>
                  {editMode ? (
                    <Input
                      id="customer_zip"
                      value={formData.customer_zip || ""}
                      onChange={(e) => setFormData({ ...formData, customer_zip: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm mt-1">{order.customer_zip}</p>
                  )}
                </div>
              </div>

              {(order.customer_landmark || editMode) && (
                <div>
                  <Label htmlFor="customer_landmark">Landmark</Label>
                  {editMode ? (
                    <Input
                      id="customer_landmark"
                      value={formData.customer_landmark || ""}
                      onChange={(e) => setFormData({ ...formData, customer_landmark: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm mt-1">{order.customer_landmark || "N/A"}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span>{formatCurrency(order.delivery_charge)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(order.total_amount)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Payment Method:</span>
                  <span className="capitalize">{order.payment_method}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <Select
                  value={formData.status || order.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="space-y-2">
                  <div>Current Status: {getStatusBadge(order.status)}</div>
                  <div className="text-sm text-gray-500">Last Updated: {formatDate(order.updated_at)}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Special Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Special Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <Textarea
                  value={formData.special_instructions || ""}
                  onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
                  placeholder="Add special instructions..."
                  rows={3}
                />
              ) : (
                <p className="text-sm">{order.special_instructions || "No special instructions"}</p>
              )}
            </CardContent>
          </Card>

          {/* Status History */}
          {order.history && order.history.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Status History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.history.map((entry) => (
                    <div key={entry.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      {getStatusBadge(entry.status)}
                      <div className="flex-1">
                        <p className="text-sm">{entry.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(entry.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
