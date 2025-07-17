"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

interface AccountDropdownProps {
  isOpen: boolean
  onClose: () => void
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    profilePicture?: string
  }
  isMobile?: boolean
}

export function AccountDropdown({ isOpen, onClose, user, isMobile = false }: AccountDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

  if (!isOpen) return null

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        onClose()
        router.push("/auth/login")
        router.refresh()
      }
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose}>
        <div
          ref={dropdownRef}
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-out max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle bar */}
          <div className="flex justify-center py-3">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 font-poppins">My Account</h3>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                {user.profilePicture ? (
                  <AvatarImage
                    src={user.profilePicture || "/placeholder.svg"}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                ) : (
                  <AvatarFallback className="bg-gradient-to-r from-[#C53D39] to-[#E85A4F] text-white font-medium">
                    {getUserInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </h4>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="px-6 py-4 space-y-2">
            <Link
              href="/account"
              onClick={onClose}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Avatar className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-700">Profile</span>
            </Link>
            <Link
              href="/account/orders"
              onClick={onClose}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Avatar className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-700">My Orders</span>
            </Link>
            <Link
              href="/account/wishlist"
              onClick={onClose}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Avatar className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-700">Wishlist</span>
            </Link>
            <Link
              href="/account/settings"
              onClick={onClose}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Avatar className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-700">Settings</span>
            </Link>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-white">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Desktop dropdown
  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
    >
      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            {user.profilePicture ? (
              <AvatarImage src={user.profilePicture || "/placeholder.svg"} alt={`${user.firstName} ${user.lastName}`} />
            ) : (
              <AvatarFallback className="bg-gradient-to-r from-[#C53D39] to-[#E85A4F] text-white text-sm font-medium">
                {getUserInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h4>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-2">
        <Link
          href="/account"
          onClick={onClose}
          className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm"
        >
          <Avatar className="h-4 w-4 text-gray-500" />
          <span className="text-gray-700">Profile</span>
        </Link>
        <Link
          href="/account/orders"
          onClick={onClose}
          className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm"
        >
          <Avatar className="h-4 w-4 text-gray-500" />
          <span className="text-gray-700">My Orders</span>
        </Link>
        <Link
          href="/account/wishlist"
          onClick={onClose}
          className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm"
        >
          <Avatar className="h-4 w-4 text-gray-500" />
          <span className="text-gray-700">Wishlist</span>
        </Link>
        <Link
          href="/account/settings"
          onClick={onClose}
          className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm"
        >
          <Avatar className="h-4 w-4 text-gray-500" />
          <span className="text-gray-700">Settings</span>
        </Link>
      </div>

      {/* Logout */}
      <div className="border-t border-gray-200 p-2">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-red-50 transition-colors text-sm w-full text-left text-red-600"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}
