"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { User, Settings, Package, MapPin, LogOut, Heart } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"

interface AccountDropdownProps {
  children: React.ReactNode
}

export function AccountDropdown({ children }: AccountDropdownProps) {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
  }

  if (!user) {
    return null
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/account" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>My Account</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/account/orders" className="flex items-center">
            <Package className="mr-2 h-4 w-4" />
            <span>My Orders</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/account/wishlist" className="flex items-center">
            <Heart className="mr-2 h-4 w-4" />
            <span>Wishlist</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/account/addresses" className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            <span>Addresses</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/account/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} className="flex items-center text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
