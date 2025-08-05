"use client"

import { useState, useEffect } from "react"
import { Package, Search, Filter, Eye, Truck, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  totalAmount: number
  status: string
  paymentStatus: string
  createdAt: string
  updatedAt: string
  itemCount: number
  items: Array<{
    product_name: string
    quantity: number
    price: number
  }>
}

interface OrdersData {
  orders: Order[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function AccountOrders() {
  const [ordersData, setOrdersData] = useState<OrdersData | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all") // Updated default value to "all"
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()

  useEffect(() => {
    fetchOrders()
  }, [currentPage, search, statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      })

      if (search) params.append("search", search)
      if (statusFilter !== "all") params.append("status", statusFilter) // Updated condition to exclude "all"

      const response = await fetch(`/api/account/orders?${params}`, {
        credentials: "include",
      })

      if (response.status === 401) {
        router.push("/auth/login")
        return
      }

      const data = await response.json()
      if (data.success) {
        setOrdersData(data.data)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-600"
      case "shipped":
      case "out_for_delivery":
        return "bg-blue-100 text-blue-600"
      case "processing":
        return "bg-yellow-100 text-yellow-600"
      case "cancelled":
        return "bg-red-100 text-red-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")
  }

  if (loading && !ordersData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/account">
            <Button variant="outline" size="sm" className="rounded-xl bg-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Account
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white shadow-lg border-0 rounded-xl mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search orders..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 rounded-xl">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {ordersData && ordersData.orders.length > 0 ? (
          <div className="space-y-4">
            {ordersData.orders.map((order) => (
              <Card key={order.id} className="bg-white shadow-lg border-0 rounded-xl">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          • {order.itemCount} items
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">${order.totalAmount.toLocaleString()}</div>
                        <div className={`text-sm px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                          {formatStatus(order.status)}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/track-order?order=${order.orderNumber}`}>
                          <Button size="sm" variant="outline" className="rounded-xl bg-transparent">
                            <Truck className="w-4 h-4 mr-2" />
                            Track
                          </Button>
                        </Link>
                        <Link href={`/account/orders/${order.id}`}>
                          <Button size="sm" className="rounded-xl bg-gradient-to-r from-orange-500 to-red-500">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  {order.items && order.items.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex flex-wrap gap-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <span key={index} className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">
                            {item.product_name} (x{item.quantity})
                          </span>
                        ))}
                        {order.items.length > 3 && (
                          <span className="text-sm text-gray-500">+{order.items.length - 3} more items</span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Pagination */}
            {ordersData.pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl bg-white"
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 py-2 text-sm text-gray-600">
                  Page {ordersData.pagination.page} of {ordersData.pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(ordersData.pagination.totalPages, currentPage + 1))}
                  disabled={currentPage === ordersData.pagination.totalPages}
                  className="rounded-xl bg-white"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Card className="bg-white shadow-lg border-0 rounded-xl">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-6">
                {search || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Start shopping to see your orders here"}
              </p>
              <Link href="/shop">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl">
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
