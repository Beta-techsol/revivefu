"use client"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Package, Truck, Heart, MapPin, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface AccountDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export function AccountDropdown({ isOpen, onClose }: AccountDropdownProps) {
  const { user } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      onClose()
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getUserInitials = (firstName = "", lastName = "") => {
    const first = (firstName || "").trim().charAt(0)
    const last = (lastName || "").trim().charAt(0)
    return (first + last || "U").toUpperCase()
  }

  const accountMenuItems = [
    {
      title: "Dashboard",
      description: "Account overview",
      icon: User,
      href: "/account",
    },
    {
      title: "Orders",
      description: "View your order history",
      icon: Package,
      href: "/account/orders",
    },
    {
      title: "Track Order",
      description: "Track your current orders",
      icon: Truck,
      href: "/track-order",
    },
    {
      title: "Wishlist",
      description: "Your saved items",
      icon: Heart,
      href: "/account/wishlist",
    },
    {
      title: "Addresses",
      description: "Manage shipping addresses",
      icon: MapPin,
      href: "/account/addresses",
    },
    {
      title: "Account Settings",
      description: "Update your profile",
      icon: Settings,
      href: "/account/settings",
    },
  ]

  if (!isOpen || !user) return null

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
      <div className="p-0">
        {/* User Info Header with Gradient Background */}
        <div className="bg-gradient-to-r from-[#C53D39] to-[#E85A4F] p-4 rounded-t-xl">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-white">
              {user.profilePicture ? (
                <AvatarImage
                  src={user.profilePicture || "/placeholder.svg"}
                  alt={`${user.firstName} ${user.lastName}`}
                />
              ) : (
                <AvatarFallback className="bg-white text-[#C53D39] text-sm font-medium">
                  {getUserInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="font-semibold text-white">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-white/80">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-1">
          {accountMenuItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              onClick={onClose}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-[#C53D39] to-[#E85A4F] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Logout Button */}
        <div className="border-t border-gray-100 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors group w-full text-left"
          >
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <LogOut className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium text-red-600">Logout</h4>
              <p className="text-sm text-red-500">Sign out of your account</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
