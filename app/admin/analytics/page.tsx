"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, TrendingDown } from "lucide-react"

interface AnalyticsData {
  salesData: Array<{ name: string; sales: number; orders: number }>
  categoryData: Array<{ name: string; value: number; color: string }>
  topProducts: Array<{ name: string; sales: number; revenue: string }>
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

const iconMap = {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching analytics data...")

      // Use same cache-busting approach as orders page
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/admin/analytics-data?_t=${timestamp}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Analytics data response:", result)

      if (result.success && result.data) {
        setData(result.data)
      } else {
        setError(result.error || "Failed to fetch analytics data")
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error)
      setError("Failed to fetch analytics data")
    } finally {
      setLoading(false)
    }
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

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="text-center">
            <p className="text-red-600 font-poppins mb-4">{error || "Failed to load analytics data"}</p>
            <button
              onClick={fetchAnalyticsData}
              className="px-4 py-2 bg-[#C53D39] text-white rounded-lg hover:bg-[#B12E2A] font-poppins"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-montserrat">Analytics Dashboard</h1>
          <p className="text-gray-600 font-poppins">Track your business performance and insights</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.stats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon as keyof typeof iconMap]
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 font-poppins">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 font-montserrat">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        {stat.trend === "up" ? (
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span
                          className={`text-sm font-poppins ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                        >
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <IconComponent className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Sales Overview</CardTitle>
              <CardDescription className="font-poppins">Monthly sales performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  sales: {
                    label: "Sales",
                    color: "#C53D39",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="sales" fill="#C53D39" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Orders Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Orders Overview</CardTitle>
              <CardDescription className="font-poppins">Monthly order counts</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  orders: {
                    label: "Orders",
                    color: "#F1BA69",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="orders" fill="#F1BA69" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Category Distribution</CardTitle>
              <CardDescription className="font-poppins">Sales by product category</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  category: {
                    label: "Category",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Top Products</CardTitle>
              <CardDescription className="font-poppins">Best selling products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 font-poppins">{product.name}</h3>
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
