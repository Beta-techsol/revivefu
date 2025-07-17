"use client"

import { Settings, Package, MapPin, Heart, LogOut, Shield } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AccountDropdownProps {
  isOpen: boolean
  onClose: () => void
  user: {
    id: string
    email: string
    name: string
    phone?: string
    profile_picture?: string
    email_verified: boolean
  }
  onLogout: () => void
}

export function AccountDropdown({ isOpen, onClose, user, onLogout }: AccountDropdownProps) {
  if (!isOpen) return null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = async () => {
    await onLogout()
    onClose()
  }

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
      {/* User Info Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.profile_picture || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
            {!user.email_verified && (
              <div className="flex items-center mt-1">
                <Shield className="w-3 h-3 text-amber-500 mr-1" />
                <span className="text-xs text-amber-600">Email not verified</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <Link
          href="/account"
          onClick={onClose}
          className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span className="w-5 h-5 mr-3 text-gray-400">U</span>
          <span>My Account</span>
        </Link>

        <Link
          href="/account/orders"
          onClick={onClose}
          className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Package className="w-5 h-5 mr-3 text-gray-400" />
          <span>My Orders</span>
        </Link>

        <Link
          href="/account/addresses"
          onClick={onClose}
          className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <MapPin className="w-5 h-5 mr-3 text-gray-400" />
          <span>Addresses</span>
        </Link>

        <Link
          href="/account/wishlist"
          onClick={onClose}
          className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Heart className="w-5 h-5 mr-3 text-gray-400" />
          <span>Wishlist</span>
        </Link>

        <Link
          href="/account/settings"
          onClick={onClose}
          className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-5 h-5 mr-3 text-gray-400" />
          <span>Settings</span>
        </Link>

        <div className="border-t border-gray-100 mt-2 pt-2">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3 text-gray-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
