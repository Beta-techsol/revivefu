"use client"

import { useState } from "react"
import { Package, Eye, Download, RotateCcw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { BreadcrumbComponent } from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function OrdersHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const orders = [
    {
      id: "ORD-001234",
      date: "December 15, 2024",
      items: 3,
      total: 1299,
      status: "Delivered",
      statusColor: "bg-green-100 text-green-600",
    },
    {
      id: "ORD-001233",
      date: "December 10, 2024",
      items: 1,
      total: 599,
      status: "In Transit",
      statusColor: "bg-blue-100 text-blue-600",
    },
    {
      id: "ORD-001232",
      date: "December 5, 2024",
      items: 2,
      total: 899,
      status: "Processing",
      statusColor: "bg-yellow-100 text-yellow-600",
    },
    {
      id: "ORD-001231",
      date: "November 28, 2024",
      items: 1,
      total: 449,
      status: "Delivered",
      statusColor: "bg-green-100 text-green-600",
    },
    {
      id: "ORD-001230",
      date: "November 20, 2024",
      items: 4,
      total: 1899,
      status: "Delivered",
      statusColor: "bg-green-100 text-green-600",
    },
  ]

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const breadcrumbItems = [{ label: "Account", href: "/account" }, { label: "Orders History" }]

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
                        <h3 className="font-semibold text-gray-900 text-lg">{order.id}</h3>
                        <p className="text-gray-600">
                          {order.date} • {order.items} items
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-xl text-gray-900">${order.total}</p>
                        <Badge className={`${order.statusColor} border-0`}>{order.status}</Badge>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/account/orders/${order.id}`}>
                          <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
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

          {filteredOrders.length === 0 && (
            <Card className="bg-white shadow-lg border-0 rounded-xl">
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search terms or browse our products</p>
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
