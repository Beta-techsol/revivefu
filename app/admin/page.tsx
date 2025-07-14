"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Eye,
  Plus,
  FileText,
  Settings,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

interface Stats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
}

interface Order {
  id: number
  order_number: string
  customer_name: string
  total_amount: number
  status: string
  created_at: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      const data = await response.json()

      if (data.success) {
        setStats(data.stats)
        setRecentOrders(data.recentOrders)
      } else {
        console.error("Failed to fetch stats:", data.error)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your admin dashboard. Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
          <Button variant="outline" asChild className="bg-transparent">
            <Link href="/admin/orders">
              <Eye className="mr-2 h-4 w-4" />
              View Orders
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats ? formatCurrency(stats.totalRevenue) : "$0.00"}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats ? stats.totalOrders.toLocaleString() : "0"}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats ? stats.totalProducts.toLocaleString() : "0"}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +3 new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats ? stats.totalCustomers.toLocaleString() : "0"}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8 new this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>You have {recentOrders.length} recent orders.</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild className="bg-transparent">
            <Link href="/admin/orders">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-sm font-medium">{order.order_number}</p>
                    <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(order.total_amount)}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/orders/${order.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {recentOrders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No recent orders found.</div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button asChild className="h-20 flex-col space-y-2">
          <Link href="/admin/products/new">
            <Package className="h-6 w-6" />
            <span>Add Product</span>
          </Link>
        </Button>

        <Button variant="outline" asChild className="h-20 flex-col space-y-2 bg-transparent">
          <Link href="/admin/orders">
            <ShoppingCart className="h-6 w-6" />
            <span>View Orders</span>
          </Link>
        </Button>

        <Button variant="outline" asChild className="h-20 flex-col space-y-2 bg-transparent">
          <Link href="/admin/customers">
            <Users className="h-6 w-6" />
            <span>Manage Customers</span>
          </Link>
        </Button>

        <Button variant="outline" asChild className="h-20 flex-col space-y-2 bg-transparent">
          <Link href="/admin/analytics">
            <BarChart3 className="h-6 w-6" />
            <span>View Analytics</span>
          </Link>
        </Button>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Check your system connections and perform maintenance tasks.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" asChild className="bg-transparent">
              <Link href="/api/test-connections" target="_blank">
                <Settings className="mr-2 h-4 w-4" />
                Test Connections
              </Link>
            </Button>

            <Button variant="outline" asChild className="bg-transparent">
              <Link href="/api/init-db" target="_blank">
                <FileText className="mr-2 h-4 w-4" />
                Initialize Database
              </Link>
            </Button>

            <Button variant="outline" asChild className="bg-transparent">
              <Link href="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                System Settings
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
