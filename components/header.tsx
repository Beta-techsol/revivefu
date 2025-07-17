"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { ShoppingCart, Heart, Menu, X, Scale } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { MegaMenu } from "./mega-menu"
import { AccountDropdown } from "./header/account-dropdown"
import { CartDropdown } from "./header/cart-dropdown"
import { WishlistDropdown } from "./header/wishlist-dropdown"
import { CompareDropdown } from "./header/compare-dropdown"
import { SearchComponent } from "./header/search-component"
import { useCompare } from "@/hooks/use-compare"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  const { items } = useCart()
  const { items: wishlistItems } = useWishlist()
  const { items: compareItems } = useCompare()
  const { user, loading: authLoading } = useAuth()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const wishlistCount = wishlistItems.length
  const compareCount = compareItems.length
  const [showMegaMenu, setShowMegaMenu] = useState(false)
  const [activeLink, setActiveLink] = useState("")
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [showCartDropdown, setShowCartDropdown] = useState(false)
  const [showWishlistDropdown, setShowWishlistDropdown] = useState(false)
  const [showCompareDropdown, setShowCompareDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

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

  // Get user initials
  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Secondary header - Contact Info Only */}
        <div className="flex items-center justify-between py-3 text-sm text-gray-600 border-b border-gray-100">
          <div className="flex items-center space-x-6 font-poppins">
            <span className="flex items-center space-x-2">
              <span>📞 +92 300 1234567</span>
            </span>
            <span className="flex items-center space-x-2">
              <span>✉️ furniture@revive.pk</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-4 font-poppins text-xs">
            <span className="text-gray-500">Free shipping on orders over PKR 50,000</span>
          </div>
        </div>

        {/* Main header with prominent search */}
        <div className="py-6">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
              <Image src="/logo.webp" alt="Revive Furniture" width={180} height={60} className="h-12 w-auto" />
            </Link>

            {/* Prominent Search Component - Takes center stage */}
            <div className="flex-1 max-w-3xl mx-8 hidden md:block">
              <SearchComponent />
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {/* Wishlist Dropdown */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 transition-all duration-300 relative h-12 w-12 rounded-xl"
                  onClick={handleWishlistClick}
                >
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#C53D39] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
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
                  className="hover:bg-gray-100 transition-all duration-300 relative h-12 w-12 rounded-xl"
                  onClick={handleCompareClick}
                >
                  <Scale className="h-5 w-5" />
                  {compareCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#C53D39] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
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
                  className="relative hover:bg-gray-100 transition-all duration-300 h-12 px-4 rounded-xl"
                  onClick={handleCartClick}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#C53D39] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {itemCount}
                    </span>
                  )}
                </Button>
                <CartDropdown isOpen={showCartDropdown} onClose={() => setShowCartDropdown(false)} />
              </div>

              {/* Sign In Button or User Account */}
              <div className="relative">
                {!authLoading && user ? (
                  <Button
                    variant="ghost"
                    className="hover:bg-gray-100 transition-all duration-300 p-2 h-12 w-12 rounded-xl"
                    onClick={handleAccountClick}
                  >
                    <Avatar className="h-8 w-8">
                      {user.profilePicture ? (
                        <AvatarImage
                          src={user.profilePicture || "/placeholder.svg"}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                      ) : null}
                      <AvatarFallback className="bg-gradient-to-r from-[#C53D39] to-[#E85A4F] text-white text-sm font-medium">
                        {getUserInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                ) : (
                  <Link href="/auth/login">
                    <Button className="bg-gradient-to-r from-[#C53D39] to-[#E85A4F] hover:from-[#B12E2A] hover:to-[#D74B3F] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-poppins text-sm h-12">
                      Sign In
                    </Button>
                  </Link>
                )}
                {user && (
                  <AccountDropdown
                    isOpen={showAccountDropdown}
                    onClose={() => setShowAccountDropdown(false)}
                    user={user}
                  />
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-12 w-12 rounded-xl"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Desktop Navigation - Moved below search for better hierarchy */}
          <nav className="hidden lg:flex items-center justify-center space-x-8 font-poppins font-medium mt-6 pt-6 border-t border-gray-100">
            <Link
              href="/"
              className={`text-gray-700 hover:text-[#C53D39] transition-all duration-300 py-2 px-4 rounded-lg hover:bg-gray-50 ${activeLink === "home" ? "text-[#C53D39] bg-gray-50" : ""}`}
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
                className={`text-gray-700 hover:text-[#C53D39] transition-all duration-300 py-2 px-4 rounded-lg hover:bg-gray-50 ${activeLink === "shop" ? "text-[#C53D39] bg-gray-50" : ""}`}
                onMouseEnter={() => setActiveLink("shop")}
              >
                Shop
              </Link>
            </div>
            <Link
              href="/portfolio"
              className={`text-gray-700 hover:text-[#C53D39] transition-all duration-300 py-2 px-4 rounded-lg hover:bg-gray-50 ${activeLink === "portfolio" ? "text-[#C53D39] bg-gray-50" : ""}`}
              onMouseEnter={() => setActiveLink("portfolio")}
              onMouseLeave={() => setActiveLink("")}
            >
              Portfolio
            </Link>
            <Link
              href="/about"
              className={`text-gray-700 hover:text-[#C53D39] transition-all duration-300 py-2 px-4 rounded-lg hover:bg-gray-50 ${activeLink === "about" ? "text-[#C53D39] bg-gray-50" : ""}`}
              onMouseEnter={() => setActiveLink("about")}
              onMouseLeave={() => setActiveLink("")}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`text-gray-700 hover:text-[#C53D39] transition-all duration-300 py-2 px-4 rounded-lg hover:bg-gray-50 ${activeLink === "contact" ? "text-[#C53D39] bg-gray-50" : ""}`}
              onMouseEnter={() => setActiveLink("contact")}
              onMouseLeave={() => setActiveLink("")}
            >
              Contact
            </Link>
          </nav>

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
            {/* Mobile Search */}
            <div className="px-4 mb-6">
              <SearchComponent />
            </div>

            <nav className="flex flex-col space-y-2 font-poppins font-medium">
              <Link
                href="/"
                className="text-gray-700 hover:text-[#C53D39] hover:bg-gray-50 transition-colors px-4 py-3 rounded-lg mx-4"
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="text-gray-700 hover:text-[#C53D39] hover:bg-gray-50 transition-colors px-4 py-3 rounded-lg mx-4"
                onClick={() => setShowMobileMenu(false)}
              >
                Shop
              </Link>
              <Link
                href="/portfolio"
                className="text-gray-700 hover:text-[#C53D39] hover:bg-gray-50 transition-colors px-4 py-3 rounded-lg mx-4"
                onClick={() => setShowMobileMenu(false)}
              >
                Portfolio
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-[#C53D39] hover:bg-gray-50 transition-colors px-4 py-3 rounded-lg mx-4"
                onClick={() => setShowMobileMenu(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-[#C53D39] hover:bg-gray-50 transition-colors px-4 py-3 rounded-lg mx-4"
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
