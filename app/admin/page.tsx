"use client"

import { useEffect, useState } from "react"
import { TrendingUp, DollarSign, Eye, Plus, ArrowUpRight, Package, ShoppingCart, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface Stats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
  recentOrders: Array<{
    id: string
    customer: string
    amount: string
    status: string
    date: string
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
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
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const statsCards = [
    {
      title: "Total Revenue",
      value: `$${stats?.totalRevenue.toLocaleString() || "0"}`,
      change: "+20.1% from last month",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Orders",
      value: stats?.totalOrders.toLocaleString() || "0",
      change: "+180.1% from last month",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Products",
      value: stats?.totalProducts.toLocaleString() || "0",
      change: "+19% from last month",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Active Users",
      value: stats?.totalCustomers.toLocaleString() || "0",
      change: "+201 since last hour",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-montserrat">Dashboard</h1>
          <p className="text-gray-600 font-poppins">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            asChild
            className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
          >
            <Link href="/" target="_blank">
              <Eye className="w-4 h-4 mr-2" />
              View Store
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 font-poppins">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 font-montserrat">{stat.value}</div>
              <p className="text-xs text-gray-600 font-poppins flex items-center">
                <ArrowUpRight className="w-3 h-3 text-green-600 mr-1" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-montserrat">Recent Orders</CardTitle>
            <CardDescription className="font-poppins">
              You have {stats?.recentOrders.length || 0} recent orders.
            </CardDescription>
          </div>
          <Button asChild variant="outline" className="bg-transparent">
            <Link href="/admin/orders">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Order ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders.map((order, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900 font-poppins">{order.id}</td>
                    <td className="py-3 px-4 text-gray-700 font-poppins">{order.customer}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900 font-poppins">{order.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-poppins">{order.date}</td>
                    <td className="py-3 px-4">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="hover:bg-[#C53D39] hover:text-white hover:border-[#C53D39] bg-transparent"
                      >
                        <Link href={`/admin/orders/${order.id.replace("#", "")}`}>View</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/products/new">
          <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 font-montserrat">
                <Package className="w-5 h-5 text-[#C53D39]" />
                <span>Add New Product</span>
              </CardTitle>
              <CardDescription className="font-poppins">Add a new product to your inventory</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/upload">
          <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 font-montserrat">
                <Plus className="w-5 h-5 text-[#C53D39]" />
                <span>Bulk Upload</span>
              </CardTitle>
              <CardDescription className="font-poppins">Upload products via CSV file</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/analytics">
          <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 font-montserrat">
                <TrendingUp className="w-5 h-5 text-[#C53D39]" />
                <span>View Analytics</span>
              </CardTitle>
              <CardDescription className="font-poppins">Check your store performance</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
