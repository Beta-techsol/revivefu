"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Search, Filter, Eye, Edit, Trash2, Download, ChevronDown, Plus, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OrderDetailModal } from "@/components/admin/order-detail-modal"
import { DeleteConfirmationModal } from "@/components/admin/delete-confirmation-modal"
import { useToast } from "@/hooks/use-toast"

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  customer_city: string
  customer_zip: string
  total_amount: number
  status: string
  created_at: string
  updated_at: string
  item_count: number
  total_items: number
  payment_method: string
}

const ORDER_STATUSES = [
  { value: "pending", label: "Order Placed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
]

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  const fetchOrders = useCallback(
    async (showRefreshIndicator = false) => {
      try {
        if (showRefreshIndicator) {
          setRefreshing(true)
        } else {
          setLoading(true)
        }

        console.log("Fetching orders...")

        const response = await fetch("/api/admin/orders/simple", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Orders API response:", data)

        if (data.success && data.data && data.data.orders) {
          let freshOrders = data.data.orders

          // Apply filters
          if (statusFilter !== "all") {
            freshOrders = freshOrders.filter((order: Order) => order.status === statusFilter)
          }

          if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase()
            freshOrders = freshOrders.filter(
              (order: Order) =>
                order.order_number.toLowerCase().includes(searchLower) ||
                order.customer_name.toLowerCase().includes(searchLower) ||
                order.customer_email.toLowerCase().includes(searchLower),
            )
          }

          setOrders(freshOrders)
          console.log(`Set ${freshOrders.length} orders in state`)
        } else {
          console.error("Invalid API response:", data)
          toast({
            title: "Error",
            description: data.error || "Failed to fetch orders",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast({
          title: "Error",
          description: "Failed to fetch orders",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [statusFilter, searchTerm, toast],
  )

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleRefresh = () => {
    fetchOrders(true)
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

  const getStatusLabel = (status: string) => {
    const statusObj = ORDER_STATUSES.find((s) => s.value === status)
    return statusObj ? statusObj.label : status.replace("_", " ").toUpperCase()
  }

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  const handleSelectAll = () => {
    setSelectedOrders(selectedOrders.length === orders.length ? [] : orders.map((order) => order.id))
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      console.log(`Updating order ${orderId} status to ${newStatus}`)

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Status update successful:", result)

        // Refresh data immediately
        await fetchOrders(true)

        toast({
          title: "Status Updated",
          description: `Order status changed to ${getStatusLabel(newStatus)}`,
        })
      } else {
        const errorData = await response.json()
        console.error("Status update failed:", errorData)
        toast({
          title: "Error",
          description: errorData.error || "Failed to update order status",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Status update exception:", error)
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    try {
      console.log(`Deleting order ${orderId}`)

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchOrders(true)
        setDeleteOrderId(null)

        toast({
          title: "Order Deleted",
          description: "Order has been deleted successfully",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to delete order",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Delete exception:", error)
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive",
      })
    }
  }

  const handleEditOrder = async (orderData: any) => {
    try {
      const response = await fetch(`/api/admin/orders/${editingOrder?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        await fetchOrders(true)
        setShowEditModal(false)
        setEditingOrder(null)

        toast({
          title: "Order Updated",
          description: "Order has been updated successfully",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to update order",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Edit exception:", error)
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      })
    }
  }

  const handleCreateOrder = async (orderData: any) => {
    try {
      const response = await fetch(`/api/admin/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        await fetchOrders(true)
        setShowCreateModal(false)

        toast({
          title: "Order Created",
          description: "New order has been created successfully",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to create order",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Create exception:", error)
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      })
    }
  }

  const handleExport = () => {
    const dataToExport =
      selectedOrders.length > 0 ? orders.filter((order) => selectedOrders.includes(order.id)) : orders

    const csvContent = [
      ["Order ID", "Customer", "Email", "Phone", "Total", "Status", "Date", "Items"],
      ...dataToExport.map((order) => [
        order.order_number,
        order.customer_name,
        order.customer_email,
        order.customer_phone,
        `₨${order.total_amount.toLocaleString()}`,
        getStatusLabel(order.status),
        new Date(order.created_at).toLocaleDateString(),
        order.total_items.toString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `orders-export-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export Successful",
      description: `Exported ${dataToExport.length} orders to CSV`,
    })
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-montserrat">Orders Management</h1>
              <p className="text-gray-600 font-poppins">Manage and track all customer orders ({orders.length} total)</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                disabled={refreshing}
                className="flex items-center space-x-2 bg-transparent"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </Button>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Order
              </Button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders, customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C53D39] focus:border-transparent font-poppins"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                      <Filter className="w-4 h-4" />
                      <span>Status: {statusFilter === "all" ? "All" : getStatusLabel(statusFilter)}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                    {ORDER_STATUSES.map((status) => (
                      <DropdownMenuItem key={status.value} onClick={() => setStatusFilter(status.value)}>
                        {status.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center space-x-2">
                {selectedOrders.length > 0 && (
                  <Button
                    onClick={handleExport}
                    variant="outline"
                    className="flex items-center space-x-2 bg-transparent"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export ({selectedOrders.length})</span>
                  </Button>
                )}
                <Button
                  onClick={handleExport}
                  className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
                >
                  Export All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-montserrat">Orders ({orders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.length === orders.length && orders.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-[#C53D39] focus:ring-[#C53D39]"
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Order ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Total</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Items</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => handleSelectOrder(order.id)}
                          className="rounded border-gray-300 text-[#C53D39] focus:ring-[#C53D39]"
                        />
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900 font-poppins">{order.order_number}</td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900 font-poppins">{order.customer_name}</div>
                          <div className="text-sm text-gray-500 font-poppins">{order.customer_email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900 font-poppins">
                        ₨{order.total_amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(order.status)}`}
                            >
                              {getStatusLabel(order.status)}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {ORDER_STATUSES.map((status) => (
                              <DropdownMenuItem
                                key={status.value}
                                onClick={() => handleStatusChange(order.id, status.value)}
                              >
                                {status.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-poppins">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-poppins">{order.total_items}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => setSelectedOrderId(order.id)}
                            variant="outline"
                            size="sm"
                            className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 bg-transparent"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => {
                              setEditingOrder(order)
                              setShowEditModal(true)
                            }}
                            variant="outline"
                            size="sm"
                            className="hover:bg-green-50 hover:border-green-300 hover:text-green-600 bg-transparent"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => setDeleteOrderId(order.id)}
                            variant="outline"
                            size="sm"
                            className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 bg-transparent"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {orders.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No orders found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {selectedOrderId && (
        <OrderDetailModal
          isOpen={!!selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          orderId={selectedOrderId}
        />
      )}

      {showEditModal && editingOrder && (
        <EditOrderModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setEditingOrder(null)
          }}
          order={editingOrder}
          onSave={handleEditOrder}
        />
      )}

      {showCreateModal && (
        <CreateOrderModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateOrder}
        />
      )}

      {deleteOrderId && (
        <DeleteConfirmationModal
          isOpen={!!deleteOrderId}
          onClose={() => setDeleteOrderId(null)}
          onConfirm={() => handleDeleteOrder(deleteOrderId)}
          title="Delete Order"
          description="Are you sure you want to delete this order? This action cannot be undone."
        />
      )}
    </div>
  )
}

// Edit Order Modal Component
function EditOrderModal({
  isOpen,
  onClose,
  order,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  order: Order
  onSave: (data: any) => void
}) {
  const [formData, setFormData] = useState({
    customer_name: order.customer_name,
    customer_email: order.customer_email,
    customer_phone: order.customer_phone,
    customer_address: order.customer_address,
    customer_city: order.customer_city,
    customer_zip: order.customer_zip,
    status: order.status,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Order - {order.order_number}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer_name">Customer Name</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="customer_email">Email</Label>
              <Input
                id="customer_email"
                type="email"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="customer_phone">Phone</Label>
            <Input
              id="customer_phone"
              value={formData.customer_phone}
              onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="customer_address">Address</Label>
            <Textarea
              id="customer_address"
              value={formData.customer_address}
              onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer_city">City</Label>
              <Input
                id="customer_city"
                value={formData.customer_city}
                onChange={(e) => setFormData({ ...formData, customer_city: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="customer_zip">Zip Code</Label>
              <Input
                id="customer_zip"
                value={formData.customer_zip}
                onChange={(e) => setFormData({ ...formData, customer_zip: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Create Order Modal Component
function CreateOrderModal({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
}) {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
    customer_city: "",
    customer_zip: "",
    customer_landmark: "",
    special_instructions: "",
    subtotal: 0,
    delivery_charge: 200,
    total_amount: 200,
    items: [
      {
        name: "Sample Product",
        sku: "SAMPLE-001",
        quantity: 1,
        price: 0,
      },
    ],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const totalAmount = formData.subtotal + formData.delivery_charge
    onSave({
      ...formData,
      total_amount: totalAmount,
    })
  }

  const updateTotals = (subtotal: number) => {
    setFormData((prev) => ({
      ...prev,
      subtotal,
      total_amount: subtotal + prev.delivery_charge,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer_name">Customer Name *</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="customer_email">Email *</Label>
              <Input
                id="customer_email"
                type="email"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="customer_phone">Phone *</Label>
            <Input
              id="customer_phone"
              value={formData.customer_phone}
              onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="customer_address">Address *</Label>
            <Textarea
              id="customer_address"
              value={formData.customer_address}
              onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer_city">City</Label>
              <Input
                id="customer_city"
                value={formData.customer_city}
                onChange={(e) => setFormData({ ...formData, customer_city: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="customer_zip">Zip Code</Label>
              <Input
                id="customer_zip"
                value={formData.customer_zip}
                onChange={(e) => setFormData({ ...formData, customer_zip: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="customer_landmark">Landmark</Label>
            <Input
              id="customer_landmark"
              value={formData.customer_landmark}
              onChange={(e) => setFormData({ ...formData, customer_landmark: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="special_instructions">Special Instructions</Label>
            <Textarea
              id="special_instructions"
              value={formData.special_instructions}
              onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="subtotal">Subtotal (₨)</Label>
              <Input
                id="subtotal"
                type="number"
                value={formData.subtotal}
                onChange={(e) => {
                  const subtotal = Number.parseFloat(e.target.value) || 0
                  updateTotals(subtotal)
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor="delivery_charge">Delivery Charge (₨)</Label>
              <Input
                id="delivery_charge"
                type="number"
                value={formData.delivery_charge}
                onChange={(e) => {
                  const deliveryCharge = Number.parseFloat(e.target.value) || 0
                  setFormData((prev) => ({
                    ...prev,
                    delivery_charge: deliveryCharge,
                    total_amount: prev.subtotal + deliveryCharge,
                  }))
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor="total_amount">Total Amount (₨)</Label>
              <Input id="total_amount" type="number" value={formData.total_amount} disabled />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
            >
              Create Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
