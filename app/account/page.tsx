"use client"

import { useState } from "react"
import { User, Package, MapPin, Settings, Heart, LogOut, Truck, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AccountDashboard() {
  const [user] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    avatar: "/placeholder.svg?height=80&width=80",
  })

  const dashboardItems = [
    {
      title: "Orders",
      description: "View your order history",
      icon: Package,
      href: "/account/orders",
      count: 12,
    },
    {
      title: "Track Order",
      description: "Track your current orders",
      icon: Truck,
      href: "/account/track-order",
      count: 2,
    },
    {
      title: "Wishlist",
      description: "Your saved items",
      icon: Heart,
      href: "/account/wishlist",
      count: 8,
    },
    {
      title: "Addresses",
      description: "Manage shipping addresses",
      icon: MapPin,
      href: "/account/addresses",
      count: 2,
    },
    {
      title: "Payment Methods",
      description: "Manage payment options",
      icon: CreditCard,
      href: "/account/payment-methods",
      count: 3,
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
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
              <p className="text-white/90">Manage your account and track your orders</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-0 rounded-xl">
            <CardContent className="p-6 text-center">
              <Package className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg border-0 rounded-xl">
            <CardContent className="p-6 text-center">
              <Truck className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">2</div>
              <div className="text-sm text-gray-600">In Transit</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg border-0 rounded-xl">
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">8</div>
              <div className="text-sm text-gray-600">Wishlist Items</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg border-0 rounded-xl">
            <CardContent className="p-6 text-center">
              <CreditCard className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">$2,450</div>
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
            <div className="space-y-4">
              {[
                { id: "#ORD-001", date: "Dec 15, 2024", items: 3, total: "$1,299", status: "Delivered" },
                { id: "#ORD-002", date: "Dec 10, 2024", items: 1, total: "$599", status: "In Transit" },
                { id: "#ORD-003", date: "Dec 5, 2024", items: 2, total: "$899", status: "Processing" },
              ].map((order) => (
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
                          : order.status === "In Transit"
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
          <Button variant="outline" className="rounded-xl text-red-600 border-red-200 hover:bg-red-50 bg-transparent">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
