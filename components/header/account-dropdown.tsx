"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { User, Settings, Package, MapPin, Heart, LogOut, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface AccountDropdownProps {
  isOpen: boolean
  onClose: () => void
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    profilePictureUrl?: string
  }
}

export function AccountDropdown({ isOpen, onClose, user }: AccountDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleLogout = async () => {
    await logout()
    onClose()
    router.push("/")
  }

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-4 z-50"
    >
      {/* User Info */}
      <div className="px-4 pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-medium">
            {user.firstName.charAt(0)}
            {user.lastName.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <Link
          href="/account"
          className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={onClose}
        >
          <User className="w-5 h-5 mr-3 text-gray-400" />
          <span>My Account</span>
        </Link>

        <Link
          href="/account/orders"
          className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={onClose}
        >
          <Package className="w-5 h-5 mr-3 text-gray-400" />
          <span>My Orders</span>
        </Link>

        <Link
          href="/account/addresses"
          className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={onClose}
        >
          <MapPin className="w-5 h-5 mr-3 text-gray-400" />
          <span>Addresses</span>
        </Link>

        <Link
          href="/account/wishlist"
          className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={onClose}
        >
          <Heart className="w-5 h-5 mr-3 text-gray-400" />
          <span>Wishlist</span>
        </Link>

        <Link
          href="/compare"
          className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={onClose}
        >
          <Scale className="w-5 h-5 mr-3 text-gray-400" />
          <span>Compare Products</span>
        </Link>

        <Link
          href="/account/settings"
          className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={onClose}
        >
          <Settings className="w-5 h-5 mr-3 text-gray-400" />
          <span>Account Settings</span>
        </Link>
      </div>

      {/* Logout */}
      <div className="border-t border-gray-100 pt-2">
        <Button
          variant="ghost"
          className="w-full justify-start px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  )
}
