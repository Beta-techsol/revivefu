"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Eye, Trash2, Download, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { OrderDetailModal } from "@/components/admin/order-detail-modal"
import { DeleteConfirmationModal } from "@/components/admin/delete-confirmation-modal"
import { useToast } from "@/hooks/use-toast"

interface Order {
  id: string
  customer: string
  email: string
  total: number
  status: string
  date: string
  items: number
  payment: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [pagination.page, statusFilter, searchTerm])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await fetch(`/api/admin/orders?${params}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
        setPagination(data.pagination)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch orders",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  const handleSelectAll = () => {
    setSelectedOrders(selectedOrders.length === orders.length ? [] : orders.map((order) => order.id))
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId.replace("#", "")}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
        toast({
          title: "Status Updated",
          description: `Order ${orderId} status changed to ${newStatus}`,
        })
      } else {
        throw new Error("Failed to update status")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId.replace("#", "")}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setOrders((prev) => prev.filter((order) => order.id !== orderId))
        setDeleteOrderId(null)
        toast({
          title: "Order Deleted",
          description: `Order ${orderId} has been deleted successfully`,
        })
      } else {
        throw new Error("Failed to delete order")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive",
      })
    }
  }

  const handleExport = () => {
    const dataToExport =
      selectedOrders.length > 0 ? orders.filter((order) => selectedOrders.includes(order.id)) : orders

    const csvContent = [
      ["Order ID", "Customer", "Email", "Total", "Status", "Date", "Items", "Payment"],
      ...dataToExport.map((order) => [
        order.id,
        order.customer,
        order.email,
        order.total.toString(),
        order.status,
        order.date,
        order.items.toString(),
        order.payment,
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

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-montserrat">Orders Management</h1>
          <p className="text-gray-600 font-poppins">Manage and track all customer orders</p>
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
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C53D39] focus:border-transparent font-poppins"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                      <Filter className="w-4 h-4" />
                      <span>Status: {statusFilter === "all" ? "All" : statusFilter}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleStatusFilter("all")}>All</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusFilter("pending")}>Pending</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusFilter("processing")}>Processing</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusFilter("shipped")}>Shipped</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusFilter("completed")}>Completed</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusFilter("cancelled")}>Cancelled</DropdownMenuItem>
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
            <CardTitle className="font-montserrat">Orders ({pagination.total})</CardTitle>
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
                      <td className="py-3 px-4 font-medium text-gray-900 font-poppins">{order.id}</td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900 font-poppins">{order.customer}</div>
                          <div className="text-sm text-gray-500 font-poppins">{order.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900 font-poppins">${order.total.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(order.status)}`}
                            >
                              {order.status}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "pending")}>
                              Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "processing")}>
                              Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "shipped")}>
                              Shipped
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "completed")}>
                              Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "cancelled")}>
                              Cancelled
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-poppins">{order.date}</td>
                      <td className="py-3 px-4 text-gray-600 font-poppins">{order.items}</td>
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

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-700">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                  >
                    Next
                  </Button>
                </div>
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

      {deleteOrderId && (
        <DeleteConfirmationModal
          isOpen={!!deleteOrderId}
          onClose={() => setDeleteOrderId(null)}
          onConfirm={() => handleDeleteOrder(deleteOrderId)}
          title="Delete Order"
          description={`Are you sure you want to delete order ${deleteOrderId}? This action cannot be undone.`}
        />
      )}
    </div>
  )
}
