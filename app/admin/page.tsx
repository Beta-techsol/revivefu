"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Eye,
  Plus,
  BarChart3,
  Settings,
  Upload,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

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

interface NewOrderData {
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  total_amount: string
  status: string
  payment_status: string
  payment_method: string
  notes: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newOrderData, setNewOrderData] = useState<NewOrderData>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
    total_amount: "",
    status: "pending",
    payment_status: "pending",
    payment_method: "cash",
    notes: "",
  })

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
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/admin/orders/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrderData),
      })

      const data = await response.json()

      if (data.success) {
        setIsAddOrderOpen(false)
        setNewOrderData({
          customer_name: "",
          customer_email: "",
          customer_phone: "",
          shipping_address: "",
          total_amount: "",
          status: "pending",
          payment_status: "pending",
          payment_method: "cash",
          notes: "",
        })
        fetchDashboardData() // Refresh data
        alert("Order created successfully!")
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error("Error creating order:", error)
      alert("Failed to create order")
    } finally {
      setIsSubmitting(false)
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard. Here's what's happening with your store today.
        </p>
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
              +180.1% from last month
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
              +19% from last month
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
              +201 since last hour
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
          <Dialog open={isAddOrderOpen} onOpenChange={setIsAddOrderOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Order</DialogTitle>
                <DialogDescription>
                  Create a new order manually. This can be used for phone orders or testing.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddOrder} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer_name">Customer Name *</Label>
                    <Input
                      id="customer_name"
                      value={newOrderData.customer_name}
                      onChange={(e) => setNewOrderData({ ...newOrderData, customer_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer_email">Customer Email *</Label>
                    <Input
                      id="customer_email"
                      type="email"
                      value={newOrderData.customer_email}
                      onChange={(e) => setNewOrderData({ ...newOrderData, customer_email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer_phone">Customer Phone</Label>
                    <Input
                      id="customer_phone"
                      value={newOrderData.customer_phone}
                      onChange={(e) => setNewOrderData({ ...newOrderData, customer_phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="total_amount">Total Amount *</Label>
                    <Input
                      id="total_amount"
                      type="number"
                      step="0.01"
                      value={newOrderData.total_amount}
                      onChange={(e) => setNewOrderData({ ...newOrderData, total_amount: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping_address">Shipping Address</Label>
                  <Textarea
                    id="shipping_address"
                    value={newOrderData.shipping_address}
                    onChange={(e) => setNewOrderData({ ...newOrderData, shipping_address: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Order Status *</Label>
                    <Select
                      value={newOrderData.status}
                      onValueChange={(value) => setNewOrderData({ ...newOrderData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                  <div className="space-y-2">
                    <Label htmlFor="payment_status">Payment Status *</Label>
                    <Select
                      value={newOrderData.payment_status}
                      onValueChange={(value) => setNewOrderData({ ...newOrderData, payment_status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment_method">Payment Method</Label>
                    <Select
                      value={newOrderData.payment_method}
                      onValueChange={(value) => setNewOrderData({ ...newOrderData, payment_method: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newOrderData.notes}
                    onChange={(e) => setNewOrderData({ ...newOrderData, notes: e.target.value })}
                    rows={2}
                    placeholder="Any additional notes about this order..."
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddOrderOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Order"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
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
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/orders/${order.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
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
        <Button className="h-20 flex-col space-y-2" asChild>
          <Link href="/admin/products/new">
            <Package className="h-6 w-6" />
            <span>Add Product</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
          <Link href="/admin/orders">
            <ShoppingCart className="h-6 w-6" />
            <span>View Orders</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
          <Link href="/admin/customers">
            <Users className="h-6 w-6" />
            <span>Manage Customers</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
          <Link href="/admin/analytics">
            <BarChart3 className="h-6 w-6" />
            <span>View Analytics</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
          <Link href="/admin/categories">
            <FileText className="h-6 w-6" />
            <span>Categories</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
          <Link href="/admin/upload">
            <Upload className="h-6 w-6" />
            <span>Upload Images</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
          <Link href="/admin/settings">
            <Settings className="h-6 w-6" />
            <span>Settings</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
          <Link href="/admin/blog">
            <FileText className="h-6 w-6" />
            <span>Manage Blog</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}
