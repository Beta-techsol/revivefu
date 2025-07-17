"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Heart, ShoppingCart, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MegaMenu } from "./mega-menu"
import { AccountDropdown } from "./header/account-dropdown"
import { WishlistDropdown } from "./header/wishlist-dropdown"
import { CartDropdown } from "./header/cart-dropdown"
import { CompareDropdown } from "./header/compare-dropdown"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCompare } from "@/hooks/use-compare"
import { useAuth } from "@/contexts/auth-context"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { items: cartItems } = useCart()
  const { items: wishlistItems } = useWishlist()
  const { items: compareItems } = useCompare()
  const { user, loading } = useAuth()

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <header className="bg-white shadow-sm border-b">
      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.webp" alt="Revive Furniture" className="h-8 w-auto" />
            <span className="text-xl font-bold text-gray-900">Revive</span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Compare */}
            <CompareDropdown>
              <Button variant="ghost" size="sm" className="relative">
                <Search className="h-5 w-5" />
                {compareItems.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {compareItems.length}
                  </Badge>
                )}
              </Button>
            </CompareDropdown>

            {/* Wishlist */}
            <WishlistDropdown>
              <Button variant="ghost" size="sm" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {wishlistItems.length}
                  </Badge>
                )}
              </Button>
            </WishlistDropdown>

            {/* Cart */}
            <CartDropdown>
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </CartDropdown>

            {/* Account - Moved to far right */}
            {!loading && (
              <>
                {user ? (
                  <AccountDropdown>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.profilePictureUrl || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {getInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline text-sm">{user.firstName}</span>
                    </Button>
                  </AccountDropdown>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/auth/login">
                      <Button variant="ghost" size="sm">
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button size="sm">Register</Button>
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search - Shown when menu is open */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <MegaMenu />
    </header>
  )
}
