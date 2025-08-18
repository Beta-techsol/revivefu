"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  Settings,
  LogOut,
  Upload,
  FolderOpen,
  PenTool,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface AdminUser {
  id: number
  email: string
  name: string
  role: string
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [unviewedOrdersCount, setUnviewedOrdersCount] = useState(0)
  const router = useRouter()
  const pathname = usePathname()

  // Check authentication on mount
  useEffect(() => {
    checkAuth()
  }, [])

  // Fetch unviewed orders count
  useEffect(() => {
    if (user) {
      fetchUnviewedOrdersCount()
      // Poll every 30 seconds for new orders
      const interval = setInterval(fetchUnviewedOrdersCount, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  // Mark orders as viewed when visiting orders page
  useEffect(() => {
    if (pathname === "/admin/orders" && unviewedOrdersCount > 0) {
      markOrdersAsViewed()
    }
  }, [pathname, unviewedOrdersCount])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchUnviewedOrdersCount = async () => {
    try {
      const response = await fetch("/api/admin/orders/unviewed-count")
      const data = await response.json()
      if (data.success) {
        setUnviewedOrdersCount(data.data.count)
      }
    } catch (error) {
      console.error("Error fetching unviewed orders count:", error)
    }
  }

  const markOrdersAsViewed = async () => {
    try {
      await fetch("/api/admin/orders/unviewed-count", {
        method: "POST",
      })
      setUnviewedOrdersCount(0)
    } catch (error) {
      console.error("Error marking orders as viewed:", error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        setLoginError("")
      } else {
        setLoginError(data.error || "Invalid credentials")
      }
    } catch (error) {
      setLoginError("Network error. Please try again.")
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      router.push("/admin")
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#C53D39]" />
          <span className="text-gray-600">Checking authentication...</span>
        </div>
      </div>
    )
  }

  // Login form if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#C53D39] to-[#F1BA69] bg-clip-text text-transparent font-montserrat">
                Revive Admin
              </h1>
              <p className="text-sm text-gray-600 font-poppins mt-2">Sign in to access the admin panel</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="admin@revivefurniture.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {loginError && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{loginError}</div>}

              <Button type="submit" className="w-full" disabled={loginLoading}>
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
      href: "/admin/orders",
      badge: unviewedOrdersCount > 0 ? unviewedOrdersCount : null,
    },
    { id: "products", label: "Products", icon: Package, href: "/admin/products" },
    { id: "categories", label: "Categories", icon: FolderOpen, href: "/admin/categories" },
    { id: "ai-categorizer", label: "AI Categorizer", icon: PenTool, href: "/admin/ai-categorizer" },
    { id: "upload", label: "Upload CSV", icon: Upload, href: "/admin/upload" },
    { id: "customers", label: "Customers", icon: Users, href: "/admin/customers" },
    { id: "blog", label: "Blog", icon: PenTool, href: "/admin/blog" },
    { id: "transactions", label: "Transactions", icon: CreditCard, href: "/admin/transactions" },
    { id: "settings", label: "Settings", icon: Settings, href: "/admin/settings" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#C53D39] to-[#F1BA69] bg-clip-text text-transparent font-montserrat">
            Revive Admin
          </h1>
          <p className="text-sm text-gray-600 font-poppins">Store Management</p>
          <div className="mt-2 text-xs text-gray-500">Welcome, {user.name}</div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 font-poppins ${
                pathname === item.href
                  ? "bg-gradient-to-r from-[#C53D39]/10 to-[#F1BA69]/10 text-[#C53D39] border-l-4 border-[#C53D39]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#C53D39]"
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Fixed Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start text-gray-600 hover:text-red-600 hover:border-red-300 hover:bg-red-50 bg-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
