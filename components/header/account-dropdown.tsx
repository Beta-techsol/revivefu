"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"
import { LogOut } from "lucide-react"
import { logout } from "@/lib/auth"

export function AccountDropdown() {
  const handleLogout = async () => {
    try {
      await logout()
      // Redirect to home page after logout
      window.location.href = "/"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <User className="w-6 h-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="align-middle">
        <DropdownMenuItem>My Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
