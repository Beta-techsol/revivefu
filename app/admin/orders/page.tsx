"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Search, Filter, Download, Eye, Trash2, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"

interface Order {
  id: number
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  shipping_address: string
  total_amount: number
  status: string
  payment_status: string
  payment_method: string
  created_at: string
  updated_at: string
}

interface OrderDetails extends Order {
  items: Array<{
    id: number
    product_name: string
    product_sku: string
    quantity: number
    unit_price: number
    total_price: number
  }>
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrders, setSelectedOrders] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all") // Updated default value to 'all'
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null)
  const [orderDetailsLoading, setOrderDetailsLoading] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [pagination.page, searchTerm, statusFilter])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== "all" && { status: statusFilter }), // Updated condition to exclude 'all' status
      })

      const response = await fetch(`/api/admin/orders?${params}`)
      const data = await response.json()

      if (data.success) {
        setOrders(data.orders)
        setPagination(data.pagination)
      } else {
        toast.error(data.error || "Failed to fetch orders")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderDetails = async (orderId: number) => {
    setOrderDetailsLoading(true)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`)
      const data = await response.json()

      if (data.success) {
        setSelectedOrder(data.order)
      } else {
        toast.error(data.error || "Failed to fetch order details")
      }
    } catch (error) {
      console.error("Error fetching order details:", error)
      toast.error("Failed to fetch order details")
    } finally {
      setOrderDetailsLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Order status updated successfully")
        fetchOrders()
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus })
        }
      } else {
        toast.error(data.error || "Failed to update order status")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error("Failed to update order status")
    }
  }

  const deleteOrder = async (orderId: number) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Order deleted successfully")
        fetchOrders()
        setSelectedOrders(selectedOrders.filter((id) => id !== orderId))
      } else {
        toast.error(data.error || "Failed to delete order")
      }
    } catch (error) {
      console.error("Error deleting order:", error)
      toast.error("Failed to delete order")
    }
  }

  const exportOrders = () => {
    const ordersToExport =
      selectedOrders.length > 0 ? orders.filter((order) => selectedOrders.includes(order.id)) : orders

    const csvContent = [
      ["Order Number", "Customer Name", "Email", "Total Amount", "Status", "Created At"].join(","),
      ...ordersToExport.map((order) =>
        [
          order.order_number,
          order.customer_name,
          order.customer_email,
          order.total_amount,
          order.status,
          new Date(order.created_at).toLocaleDateString(),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success("Orders exported successfully")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "processing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "shipped":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders.map((order) => order.id))
    } else {
      setSelectedOrders([])
    }
  }

  const handleSelectOrder = (orderId: number, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId])
    } else {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-gray-600">Manage and track all orders</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchOrders}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportOrders}>
            <Download className="h-4 w-4 mr-2" />
            Export ({selectedOrders.length > 0 ? selectedOrders.length : orders.length})
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by customer name, email, or order number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Orders ({pagination.total})</CardTitle>
            {selectedOrders.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{selectedOrders.length} selected</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    selectedOrders.forEach((orderId) => deleteOrder(orderId))
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Table Header */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg font-medium text-sm">
                <Checkbox checked={selectedOrders.length === orders.length} onCheckedChange={handleSelectAll} />
                <div className="flex-1 grid grid-cols-6 gap-4">
                  <div>Order</div>
                  <div>Customer</div>
                  <div>Amount</div>
                  <div>Status</div>
                  <div>Date</div>
                  <div>Actions</div>
                </div>
              </div>

              {/* Table Rows */}
              {orders.map((order) => (
                <div key={order.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    checked={selectedOrders.includes(order.id)}
                    onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                  />
                  <div className="flex-1 grid grid-cols-6 gap-4 items-center">
                    <div>
                      <p className="font-medium">{order.order_number}</p>
                      <p className="text-sm text-gray-600">#{order.id}</p>
                    </div>
                    <div>
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-sm text-gray-600">{order.customer_email}</p>
                    </div>
                    <div>
                      <p className="font-medium">{formatCurrency(order.total_amount)}</p>
                      <p className="text-sm text-gray-600">{order.payment_method}</p>
                    </div>
                    <div>
                      <Select
                        value={order.status}
                        onValueChange={(newStatus) => updateOrderStatus(order.id, newStatus)}
                      >
                        <SelectTrigger className="w-auto">
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <p className="text-sm">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => fetchOrderDetails(order.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Order Details - {selectedOrder?.order_number}</DialogTitle>
                          </DialogHeader>
                          {orderDetailsLoading ? (
                            <div className="p-6">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                            </div>
                          ) : selectedOrder ? (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <h3 className="font-semibold mb-2">Customer Information</h3>
                                  <div className="space-y-1 text-sm">
                                    <p>
                                      <strong>Name:</strong> {selectedOrder.customer_name}
                                    </p>
                                    <p>
                                      <strong>Email:</strong> {selectedOrder.customer_email}
                                    </p>
                                    {selectedOrder.customer_phone && (
                                      <p>
                                        <strong>Phone:</strong> {selectedOrder.customer_phone}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-semibold mb-2">Order Information</h3>
                                  <div className="space-y-1 text-sm">
                                    <p>
                                      <strong>Status:</strong>
                                      <Badge className={`ml-2 ${getStatusColor(selectedOrder.status)}`}>
                                        {selectedOrder.status}
                                      </Badge>
                                    </p>
                                    <p>
                                      <strong>Payment:</strong> {selectedOrder.payment_method}
                                    </p>
                                    <p>
                                      <strong>Total:</strong> {formatCurrency(selectedOrder.total_amount)}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h3 className="font-semibold mb-2">Shipping Address</h3>
                                <p className="text-sm">{selectedOrder.shipping_address}</p>
                              </div>

                              {selectedOrder.items && selectedOrder.items.length > 0 && (
                                <div>
                                  <h3 className="font-semibold mb-2">Order Items</h3>
                                  <div className="border rounded-lg">
                                    {selectedOrder.items.map((item) => (
                                      <div
                                        key={item.id}
                                        className="flex justify-between items-center p-4 border-b last:border-b-0"
                                      >
                                        <div>
                                          <p className="font-medium">{item.product_name}</p>
                                          <p className="text-sm text-gray-600">SKU: {item.product_sku}</p>
                                        </div>
                                        <div className="text-right">
                                          <p className="font-medium">{formatCurrency(item.total_price)}</p>
                                          <p className="text-sm text-gray-600">
                                            {item.quantity} × {formatCurrency(item.unit_price)}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="p-6 text-center">
                              <p className="text-gray-600">Failed to load order details</p>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Order</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete order {order.order_number}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteOrder(order.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} orders
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
