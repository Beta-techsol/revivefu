"use client"

import type React from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { id: "orders", label: "Orders", icon: ShoppingCart, href: "/admin/orders" },
    { id: "products", label: "Products", icon: Package, href: "/admin/products" },
    { id: "categories", label: "Categories", icon: FolderOpen, href: "/admin/categories" },
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
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 font-poppins ${
                pathname === item.href
                  ? "bg-gradient-to-r from-[#C53D39]/10 to-[#F1BA69]/10 text-[#C53D39] border-l-4 border-[#C53D39]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#C53D39]"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Fixed Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <Link href="/auth/logout">
            <Button
              variant="outline"
              className="w-full justify-start text-gray-600 hover:text-red-600 hover:border-red-300 hover:bg-red-50 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
