"use client"

import { useState, useEffect } from "react"
import { User, Package, MapPin, Settings, Heart, LogOut, Truck, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface DashboardData {
  totalOrders: number
  inTransit: number
  totalSpent: number
  recentOrders: Array<{
    id: string
    date: string
    items: number
    total: string
    status: string
  }>
  user: {
    name: string
    email: string
  }
}

export default function AccountDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [compareCount, setCompareCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchDashboardData()
    fetchWishlistCount()
    fetchCompareCount()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/account/dashboard", {
        credentials: "include",
      })

      if (response.status === 401) {
        router.push("/auth/login")
        return
      }

      const data = await response.json()
      if (data.success) {
        setDashboardData(data.data)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchWishlistCount = () => {
    const wishlist = localStorage.getItem("wishlist")
    if (wishlist) {
      try {
        const items = JSON.parse(wishlist)
        setWishlistCount(Array.isArray(items) ? items.length : 0)
      } catch (error) {
        setWishlistCount(0)
      }
    }
  }

  const fetchCompareCount = () => {
    const compare = localStorage.getItem("compare")
    if (compare) {
      try {
        const items = JSON.parse(compare)
        setCompareCount(Array.isArray(items) ? items.length : 0)
      } catch (error) {
        setCompareCount(0)
      }
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to load account data</h2>
          <Button onClick={() => router.push("/auth/login")}>Go to Login</Button>
        </div>
      </div>
    )
  }

  const dashboardItems = [
    {
      title: "Orders",
      description: "View your order history",
      icon: Package,
      href: "/account/orders",
      count: dashboardData.totalOrders,
    },
    {
      title: "Track Order",
      description: "Track your current orders",
      icon: Truck,
      href: "/track-order",
      count: dashboardData.inTransit,
    },
    {
      title: "Wishlist",
      description: "Your saved items",
      icon: Heart,
      href: "/account/wishlist",
      count: wishlistCount,
    },
    {
      title: "Addresses",
      description: "Manage shipping addresses",
      icon: MapPin,
      href: "/account/addresses",
      count: 2,
    },
    {
      title: "Compare",
      description: "Compare products",
      icon: Scale,
      href: "/compare",
      count: compareCount,
    },
    {
      title: "Account Settings",
      description: "Update your profile",
      icon: Settings,
      href: "/account/settings",
      count: null,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {dashboardData.user.name}!</h1>
              <p className="text-white/90">Manage your account and track your orders</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-0 rounded-xl">
            <CardContent className="p-6 text-center">
              <Package className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{dashboardData.totalOrders}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg border-0 rounded-xl">
            <CardContent className="p-6 text-center">
              <Truck className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{dashboardData.inTransit}</div>
              <div className="text-sm text-gray-600">In Transit</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg border-0 rounded-xl">
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{wishlistCount}</div>
              <div className="text-sm text-gray-600">Wishlist Items</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg border-0 rounded-xl">
            <CardContent className="p-6 text-center">
              <Scale className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">${dashboardData.totalSpent.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item) => (
            <Link key={item.title} href={item.href}>
              <Card className="bg-white shadow-lg border-0 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    {item.count !== null && (
                      <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-sm font-medium">
                        {item.count}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-2">{item.title}</CardTitle>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <Card className="mt-8 bg-white shadow-lg border-0 rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{order.id}</div>
                        <div className="text-sm text-gray-600">
                          {order.date} • {order.items} items
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{order.total}</div>
                      <div
                        className={`text-sm px-2 py-1 rounded-full ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-600"
                            : order.status === "Shipped" || order.status === "Out for delivery"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
                <Link href="/shop">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            )}
            <div className="mt-6 text-center">
              <Link href="/account/orders">
                <Button variant="outline" className="rounded-xl bg-transparent">
                  View All Orders
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="rounded-xl text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
