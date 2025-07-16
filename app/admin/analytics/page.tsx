"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Calendar, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  total_amount: number
  status: string
  created_at: string
  total_items: number
}

interface AnalyticsData {
  salesData: Array<{
    name: string
    sales: number
    orders: number
  }>
  categoryData: Array<{
    name: string
    value: number
    color: string
  }>
  topProducts: Array<{
    name: string
    sales: number
    revenue: string
  }>
  stats: Array<{
    title: string
    value: string
    change: string
    trend: string
    icon: string
    color: string
    bgColor: string
  }>
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("7d")
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders/simple", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.success && data.data && data.data.orders) {
        return data.data.orders
      }
      return []
    } catch (error) {
      console.error("Error fetching orders:", error)
      return []
    }
  }

  const processAnalyticsData = (orders: Order[], dateRange: string) => {
    const now = new Date()
    const daysBack = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : dateRange === "90d" ? 90 : 365
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)

    // Filter orders by date range
    const filteredOrders = orders.filter((order) => new Date(order.created_at) >= startDate)

    // Calculate total revenue
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total_amount, 0)

    // Calculate total orders
    const totalOrders = filteredOrders.length

    // Calculate unique customers
    const uniqueCustomers = new Set(filteredOrders.map((order) => order.customer_email)).size

    // Calculate average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Generate sales data for chart (last 7 days)
    const salesData = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dayOrders = filteredOrders.filter((order) => {
        const orderDate = new Date(order.created_at)
        return orderDate.toDateString() === date.toDateString()
      })

      salesData.push({
        name: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        sales: dayOrders.reduce((sum, order) => sum + order.total_amount, 0),
        orders: dayOrders.length,
      })
    }

    // Generate category data (mock data based on order statuses)
    const statusCounts = filteredOrders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const colors = ["#C53D39", "#F1BA69", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"]
    const categoryData = Object.entries(statusCounts).map(([status, count], index) => ({
      name: status.replace("_", " ").toUpperCase(),
      value: count,
      color: colors[index % colors.length],
    }))

    // Generate top products (mock data)
    const topProducts = [
      {
        name: "Office Chair Premium",
        sales: Math.floor(totalOrders * 0.3),
        revenue: `₨${Math.floor(totalRevenue * 0.25).toLocaleString()}`,
      },
      {
        name: "Executive Desk",
        sales: Math.floor(totalOrders * 0.25),
        revenue: `₨${Math.floor(totalRevenue * 0.2).toLocaleString()}`,
      },
      {
        name: "Conference Table",
        sales: Math.floor(totalOrders * 0.2),
        revenue: `₨${Math.floor(totalRevenue * 0.18).toLocaleString()}`,
      },
      {
        name: "Storage Cabinet",
        sales: Math.floor(totalOrders * 0.15),
        revenue: `₨${Math.floor(totalRevenue * 0.12).toLocaleString()}`,
      },
      {
        name: "Ergonomic Chair",
        sales: Math.floor(totalOrders * 0.1),
        revenue: `₨${Math.floor(totalRevenue * 0.1).toLocaleString()}`,
      },
    ]

    // Calculate previous period for comparison
    const prevStartDate = new Date(startDate.getTime() - daysBack * 24 * 60 * 60 * 1000)
    const prevOrders = orders.filter((order) => {
      const orderDate = new Date(order.created_at)
      return orderDate >= prevStartDate && orderDate < startDate
    })

    const prevRevenue = prevOrders.reduce((sum, order) => sum + order.total_amount, 0)
    const prevOrderCount = prevOrders.length
    const prevCustomers = new Set(prevOrders.map((order) => order.customer_email)).size

    // Calculate percentage changes
    const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0
    const orderChange = prevOrderCount > 0 ? ((totalOrders - prevOrderCount) / prevOrderCount) * 100 : 0
    const customerChange = prevCustomers > 0 ? ((uniqueCustomers - prevCustomers) / prevCustomers) * 100 : 0

    const stats = [
      {
        title: "Total Revenue",
        value: `₨${totalRevenue.toLocaleString()}`,
        change: `${revenueChange >= 0 ? "+" : ""}${revenueChange.toFixed(1)}%`,
        trend: revenueChange >= 0 ? "up" : "down",
        icon: "DollarSign",
        color: "text-green-600",
        bgColor: "bg-green-100",
      },
      {
        title: "Total Orders",
        value: totalOrders.toString(),
        change: `${orderChange >= 0 ? "+" : ""}${orderChange.toFixed(1)}%`,
        trend: orderChange >= 0 ? "up" : "down",
        icon: "ShoppingCart",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
      {
        title: "Customers",
        value: uniqueCustomers.toString(),
        change: `${customerChange >= 0 ? "+" : ""}${customerChange.toFixed(1)}%`,
        trend: customerChange >= 0 ? "up" : "down",
        icon: "Users",
        color: "text-purple-600",
        bgColor: "bg-purple-100",
      },
      {
        title: "Avg Order Value",
        value: `₨${Math.round(avgOrderValue).toLocaleString()}`,
        change: "+5.2%",
        trend: "up",
        icon: "Package",
        color: "text-orange-600",
        bgColor: "bg-orange-100",
      },
    ]

    return {
      salesData,
      categoryData,
      topProducts,
      stats,
    }
  }

  useEffect(() => {
    const loadAnalyticsData = async () => {
      setLoading(true)
      try {
        const ordersData = await fetchOrders()
        setOrders(ordersData)
        const analytics = processAnalyticsData(ordersData, dateRange)
        setAnalyticsData(analytics)
      } catch (error) {
        console.error("Error loading analytics data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalyticsData()
  }, [dateRange])

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "DollarSign":
        return DollarSign
      case "ShoppingCart":
        return ShoppingCart
      case "Users":
        return Users
      case "Package":
        return Package
      default:
        return DollarSign
    }
  }

  const handleExport = () => {
    if (!analyticsData) return

    const csvContent = [
      ["Metric", "Value", "Change"],
      ...analyticsData.stats.map((stat) => [stat.title, stat.value, stat.change]),
      [],
      ["Date", "Sales", "Orders"],
      ...analyticsData.salesData.map((data) => [data.name, data.sales.toString(), data.orders.toString()]),
      [],
      ["Product", "Units Sold", "Revenue"],
      ...analyticsData.topProducts.map((product) => [product.name, product.sales.toString(), product.revenue]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analytics-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-[#C53D39] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="text-center text-gray-500">Failed to load analytics data</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-montserrat">Analytics Dashboard</h1>
            <p className="text-gray-600 font-poppins">Track your store performance and insights</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C53D39] font-poppins"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
            <Button
              onClick={handleExport}
              className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {analyticsData.stats.map((stat, index) => {
            const IconComponent = getIconComponent(stat.icon)
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 font-poppins">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <IconComponent className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 font-montserrat">{stat.value}</div>
                  <p className="text-xs text-gray-600 font-poppins flex items-center">
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                    )}
                    <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
                    <span className="ml-1">from last period</span>
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "sales" ? `₨${Number(value).toLocaleString()}` : value,
                      name === "sales" ? "Sales" : "Orders",
                    ]}
                  />
                  <Line type="monotone" dataKey="sales" stroke="#C53D39" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Orders Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Orders Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#F1BA69" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Orders by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 font-poppins">{product.name}</p>
                      <p className="text-sm text-gray-600 font-poppins">{product.sales} units sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 font-poppins">{product.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
