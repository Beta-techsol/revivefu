"use client"

import { useState, useEffect } from "react"
import { Package, Eye, Download, RotateCcw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { BreadcrumbComponent } from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Order {
  id: string
  order_number: string
  date: string
  items: number
  total: number
  status: string
  statusColor: string
}

export default function OrdersHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/account/orders", {
        credentials: "include",
      })

      if (response.status === 401) {
        router.push("/auth/login")
        return
      }

      const data = await response.json()
      if (data.success) {
        setOrders(
          data.data.map((order: any) => ({
            id: order.order_number,
            order_number: order.order_number,
            date: new Date(order.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            items: order.item_count || 0,
            total: Number.parseFloat(order.total_amount),
            status: order.status.charAt(0).toUpperCase() + order.status.slice(1).replace("_", " "),
            statusColor: getStatusColor(order.status),
          })),
        )
      } else {
        setError(data.error || "Failed to fetch orders")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError("Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-600"
      case "shipped":
      case "out_for_delivery":
        return "bg-blue-100 text-blue-600"
      case "processing":
        return "bg-yellow-100 text-yellow-600"
      case "pending":
        return "bg-orange-100 text-orange-600"
      case "cancelled":
        return "bg-red-100 text-red-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const handleReorder = async (orderNumber: string) => {
    // TODO: Implement reorder functionality
    console.log("Reorder:", orderNumber)
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const breadcrumbItems = [{ label: "Account", href: "/account" }, { label: "Orders History" }]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <BreadcrumbComponent items={breadcrumbItems} />

        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
              <p className="text-gray-600">View and manage all your past orders</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
              />
            </div>
          </div>

          {error && (
            <Card className="bg-red-50 border-red-200 mb-6">
              <CardContent className="p-4">
                <p className="text-red-600">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="bg-white shadow-lg border-0 rounded-xl hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{order.order_number}</h3>
                        <p className="text-gray-600">
                          {order.date} • {order.items} items
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-xl text-gray-900">₨{order.total.toLocaleString()}</p>
                        <Badge className={`${order.statusColor} border-0`}>{order.status}</Badge>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/track-order?order=${order.order_number}`}>
                          <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
                            <Eye className="w-4 h-4 mr-2" />
                            Track
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg bg-transparent"
                          onClick={() => handleReorder(order.order_number)}
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reorder
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
                          <Download className="w-4 h-4 mr-2" />
                          Invoice
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredOrders.length === 0 && !loading && (
            <Card className="bg-white shadow-lg border-0 rounded-xl">
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ? "Try adjusting your search terms" : "You haven't placed any orders yet"}
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
    </div>
  )
}
