"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { ShoppingCart, Search, User, Heart, Menu, X, Scale } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { MegaMenu } from "./mega-menu"
import { AccountDropdown } from "./header/account-dropdown"
import { CartDropdown } from "./header/cart-dropdown"
import { WishlistDropdown } from "./header/wishlist-dropdown"
import { CompareDropdown } from "./header/compare-dropdown"
import { useCompare } from "@/hooks/use-compare"

export function Header() {
  const { items } = useCart()
  const { items: compareItems } = useCompare()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const compareCount = compareItems.length
  const [showMegaMenu, setShowMegaMenu] = useState(false)
  const [activeLink, setActiveLink] = useState("")
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [showCartDropdown, setShowCartDropdown] = useState(false)
  const [showWishlistDropdown, setShowWishlistDropdown] = useState(false)
  const [showCompareDropdown, setShowCompareDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Mock user data - in real app this would come from auth context
  const user = {
    name: "Sarah Johnson",
    email: "sarah@example.com",
    avatar: "/placeholder.svg?height=48&width=48",
  }

  const wishlistCount = 3 // Mock wishlist count

  const closeAllDropdowns = () => {
    setShowAccountDropdown(false)
    setShowCartDropdown(false)
    setShowWishlistDropdown(false)
    setShowCompareDropdown(false)
  }

  const handleAccountClick = () => {
    closeAllDropdowns()
    setShowAccountDropdown(!showAccountDropdown)
  }

  const handleCartClick = () => {
    closeAllDropdowns()
    setShowCartDropdown(!showCartDropdown)
  }

  const handleWishlistClick = () => {
    closeAllDropdowns()
    setShowWishlistDropdown(!showWishlistDropdown)
  }

  const handleCompareClick = () => {
    closeAllDropdowns()
    setShowCompareDropdown(!showCompareDropdown)
  }

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Secondary header */}
        <div className="flex items-center justify-between py-3 text-sm text-gray-600 border-b border-gray-100">
          <div className="flex items-center space-x-6 font-poppins">
            <span className="flex items-center space-x-2">
              <span>📞 +01 23456789</span>
            </span>
            <span className="flex items-center space-x-2">
              <span>✉️ furniture@domain.com</span>
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-4 font-poppins">
            <span>Summer sale discount of 50% off! Shop Now</span>
            <div className="flex items-center space-x-2">
              <span>🇺🇸 USD</span>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4 relative">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.webp" alt="Revive Furniture" width={180} height={60} className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 font-poppins font-medium">
            <Link
              href="/"
              className={`text-gray-700 hover:text-[#C53D39] transition-all duration-300 ${activeLink === "home" ? "text-[#C53D39]" : ""}`}
              onMouseEnter={() => setActiveLink("home")}
              onMouseLeave={() => setActiveLink("")}
            >
              Home
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            >
              <Link
                href="/shop"
                className={`text-gray-700 hover:text-[#C53D39] transition-all duration-300 ${activeLink === "shop" ? "text-[#C53D39]" : ""}`}
                onMouseEnter={() => setActiveLink("shop")}
              >
                Shop
              </Link>
            </div>
            <Link
              href="/portfolio"
              className={`text-gray-700 hover:text-[#C53D39] transition-all duration-300 ${activeLink === "portfolio" ? "text-[#C53D39]" : ""}`}
              onMouseEnter={() => setActiveLink("portfolio")}
              onMouseLeave={() => setActiveLink("")}
            >
              Portfolio
            </Link>
            <Link
              href="/about"
              className={`text-gray-700 hover:text-[#C53D39] transition-all duration-300 ${activeLink === "about" ? "text-[#C53D39]" : ""}`}
              onMouseEnter={() => setActiveLink("about")}
              onMouseLeave={() => setActiveLink("")}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`text-gray-700 hover:text-[#C53D39] transition-all duration-300 ${activeLink === "contact" ? "text-[#C53D39]" : ""}`}
              onMouseEnter={() => setActiveLink("contact")}
              onMouseLeave={() => setActiveLink("")}
            >
              Contact
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search furniture..."
                className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C53D39] focus:border-transparent transition-all duration-300 font-poppins"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            <Button variant="ghost" size="icon" className="hover:bg-gray-100 transition-all duration-300 md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* Account Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 transition-all duration-300"
                onClick={handleAccountClick}
              >
                <User className="h-5 w-5" />
              </Button>
              <AccountDropdown isOpen={showAccountDropdown} onClose={() => setShowAccountDropdown(false)} user={user} />
            </div>

            {/* Wishlist Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 transition-all duration-300 relative"
                onClick={handleWishlistClick}
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C53D39] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Button>
              <WishlistDropdown isOpen={showWishlistDropdown} onClose={() => setShowWishlistDropdown(false)} />
            </div>

            {/* Compare Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 transition-all duration-300 relative"
                onClick={handleCompareClick}
              >
                <Scale className="h-5 w-5" />
                {compareCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C53D39] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {compareCount}
                  </span>
                )}
              </Button>
              <CompareDropdown isOpen={showCompareDropdown} onClose={() => setShowCompareDropdown(false)} />
            </div>

            {/* Cart Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                className="relative hover:bg-gray-100 transition-all duration-300"
                onClick={handleCartClick}
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C53D39] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
              <CartDropdown isOpen={showCartDropdown} onClose={() => setShowCartDropdown(false)} />
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mega Menu */}
          <MegaMenu
            isVisible={showMegaMenu}
            onMouseEnter={() => setShowMegaMenu(true)}
            onMouseLeave={() => setShowMegaMenu(false)}
          />
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4 font-poppins font-medium">
              <Link
                href="/"
                className="text-gray-700 hover:text-[#C53D39] transition-colors px-4 py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="text-gray-700 hover:text-[#C53D39] transition-colors px-4 py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Shop
              </Link>
              <Link
                href="/portfolio"
                className="text-gray-700 hover:text-[#C53D39] transition-colors px-4 py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Portfolio
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-[#C53D39] transition-colors px-4 py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-[#C53D39] transition-colors px-4 py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
