"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useAuth } from "@/hooks/use-auth"
import { ShoppingCart, Search, Heart, Menu, X, Scale } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { MegaMenu } from "./mega-menu"
import { AccountDropdown } from "./header/account-dropdown"
import { CartDropdown } from "./header/cart-dropdown"
import { WishlistDropdown } from "./header/wishlist-dropdown"
import { CompareDropdown } from "./header/compare-dropdown"
import { useCompare } from "@/hooks/use-compare"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SearchResult {
  id: string
  name: string
  price: number
  images: string
  category_name: string
}

export function Header() {
  const { items } = useCart()
  const { items: wishlistItems } = useWishlist()
  const { items: compareItems } = useCompare()
  const { user, logout } = useAuth()
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
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const searchRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  // Handle search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (searchQuery.trim().length > 2) {
      setIsSearching(true)
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=8`)
          if (response.ok) {
            const data = await response.json()
            setSearchResults(data.products || [])
            setShowSearchResults(true)
          }
        } catch (error) {
          console.error("Search failed:", error)
        } finally {
          setIsSearching(false)
        }
      }, 300)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
      setIsSearching(false)
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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

  const handleSearchResultClick = (productId: string) => {
    setShowSearchResults(false)
    setSearchQuery("")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Secondary header with search */}
        <div className="flex items-center justify-between py-3 text-sm text-gray-600 border-b border-gray-100">
          <div className="flex items-center space-x-6 font-poppins">
            <span className="flex items-center space-x-2">
              <span>📞 +92 300 1234567</span>
            </span>
            <span className="flex items-center space-x-2">
              <span>✉️ furniture@revive.pk</span>
            </span>
          </div>

          {/* Centered Search Bar */}
          <div className="flex-1 max-w-2xl mx-8 relative" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all duration-300 font-poppins text-gray-700 placeholder-gray-500 shadow-sm"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              {isSearching && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                </div>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto z-50">
                {searchResults.length > 0 ? (
                  <>
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        onClick={() => handleSearchResultClick(product.id)}
                        className="flex items-center p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg mr-4 flex-shrink-0 overflow-hidden">
                          {product.images && (
                            <Image
                              src={JSON.parse(product.images)[0] || "/placeholder.svg?height=48&width=48"}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                          <p className="text-sm text-gray-500">{product.category_name}</p>
                          <p className="text-sm font-semibold text-orange-600">PKR {product.price.toLocaleString()}</p>
                        </div>
                      </Link>
                    ))}
                    <div className="p-4 border-t border-gray-100">
                      <Link
                        href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                        onClick={() => setShowSearchResults(false)}
                        className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                      >
                        View all results for "{searchQuery}"
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center text-gray-500">No products found for "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4 font-poppins">
            <span>Summer sale discount of 50% off! Shop Now</span>
            <div className="flex items-center space-x-2">
              <span>🇵🇰 PKR</span>
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
            {/* Mobile Search */}
            <Button variant="ghost" size="icon" className="hover:bg-gray-100 transition-all duration-300 md:hidden">
              <Search className="h-5 w-5" />
            </Button>

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

            {/* Account Section - Moved to far right */}
            <div className="relative">
              {user ? (
                <Button
                  variant="ghost"
                  className="hover:bg-gray-100 transition-all duration-300 p-2"
                  onClick={handleAccountClick}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profile_picture || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-medium">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/auth/login">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full border-gray-300 hover:border-orange-400 hover:text-orange-600 bg-transparent"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button
                      size="sm"
                      className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      Register
                    </Button>
                  </Link>
                </div>
              )}
              {user && (
                <AccountDropdown
                  isOpen={showAccountDropdown}
                  onClose={() => setShowAccountDropdown(false)}
                  user={user}
                  onLogout={logout}
                />
              )}
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
            {/* Mobile Search */}
            <div className="px-4 mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search furniture..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 font-poppins"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

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

              {!user && (
                <div className="px-4 pt-4 border-t border-gray-200 space-y-2">
                  <Link href="/auth/login" onClick={() => setShowMobileMenu(false)}>
                    <Button variant="outline" className="w-full rounded-full bg-transparent">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setShowMobileMenu(false)}>
                    <Button className="w-full rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
