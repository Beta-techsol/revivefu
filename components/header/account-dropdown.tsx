"use client"

import { useRef, useEffect } from "react"
import { User, Package, MapPin, Settings, BarChart3, Heart, LogOut, Truck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface AccountDropdownProps {
  isOpen: boolean
  onClose: () => void
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

export function AccountDropdown({ isOpen, onClose, user }: AccountDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  if (!isOpen) return null

  const menuItems = [
    { icon: Package, label: "My Orders", href: "/account/orders" },
    { icon: Truck, label: "Track Order", href: "/account/track-order" },
    { icon: Heart, label: "Wishlist", href: "/account/wishlist" },
    { icon: MapPin, label: "My Addresses", href: "/account/addresses" },
    { icon: Settings, label: "Account Settings", href: "/account/settings" },
    { icon: BarChart3, label: "Compare", href: "/compare" },
  ]

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
      style={{
        animation: isOpen ? "slideDown 0.2s ease-out" : "slideUp 0.2s ease-in",
      }}
    >
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
      `}</style>

      {/* User Greeting */}
      <div className="p-4 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <Image
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <User className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <p className="font-semibold font-montserrat">Hi, {user?.name || "Guest"}!</p>
            <p className="text-sm text-white/80 font-poppins">{user?.email || "Welcome back"}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-[#C53D39]/5 hover:to-[#F1BA69]/5 hover:text-[#C53D39] transition-all duration-200 group"
            onClick={onClose}
          >
            <item.icon className="w-5 h-5 text-gray-400 group-hover:text-[#C53D39] transition-colors" />
            <span className="font-poppins font-medium">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Logout */}
      <div className="border-t border-gray-100">
        <button
          onClick={async () => {
            try {
              const response = await fetch("/api/auth/logout", {
                method: "POST",
              })

              if (response.ok) {
                // Redirect to logout page or home
                window.location.href = "/auth/logout"
              }
            } catch (error) {
              console.error("Logout failed:", error)
            }
            onClose()
          }}
          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group w-full text-left"
        >
          <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
          <span className="font-poppins font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}
