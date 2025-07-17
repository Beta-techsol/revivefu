"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { ShoppingCart, Search, Heart, Menu, X, Scale, LogOut } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { MegaMenu } from "./mega-menu"
import { AccountDropdown } from "./header/account-dropdown"
import { CartDropdown } from "./header/cart-dropdown"
import { WishlistDropdown } from "./header/wishlist-dropdown"
import { CompareDropdown } from "./header/compare-dropdown"
import { useCompare } from "@/hooks/use-compare"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SearchResult {
  id: string
  name: string
  price: number
  image: string
  category: string
}

export function Header() {
  const { items } = useCart()
  const { items: wishlistItems } = useWishlist()
  const { items: compareItems } = useCompare()
  const { user, loading: authLoading, logout } = useAuth()
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

  // Search functionality
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const closeAllDropdowns = () => {
    setShowAccountDropdown(false)
    setShowCartDropdown(false)
    setShowWishlistDropdown(false)
    setShowCompareDropdown(false)
    setShowSearchResults(false)
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

  const handleLogout = async () => {
    try {
      await logout()
      setShowAccountDropdown(false)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  // Search functionality
  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    setSearchLoading(true)
    try {
      const response = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=5`)
      const data = await response.json()

      if (data.success && data.products) {
        const results = data.products.map((product: any) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          image:
            typeof product.images === "string"
              ? JSON.parse(product.images)[0] || "/placeholder.svg"
              : product.images[0] || "/placeholder.svg",
          category: product.category_name || "Furniture",
        }))
        setSearchResults(results)
        setShowSearchResults(true)
      }
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setSearchLoading(false)
    }
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
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

  // Get user initials
  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Secondary header */}
        <div className="flex items-center justify-between py-3 text-sm text-gray-600 border-b border-gray-100">
          <div className="flex items-center space-x-6 font-poppins">
            <span className="flex items-center space-x-2">
              <span>📞 +92 300 1234567</span>
            </span>
            <span className="flex items-center space-x-2">
              <span>✉️ furniture@revive.pk</span>
            </span>
          </div>

          {/* Enhanced Search Bar */}
          <div className="flex-1 max-w-2xl mx-8" ref={searchRef}>
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for premium furniture, chairs, tables..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  className="w-full pl-12 pr-16 py-3 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C53D39] focus:border-[#C53D39] transition-all duration-300 font-poppins text-sm shadow-sm hover:shadow-md hover:border-gray-300"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                {searchLoading && (
                  <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#C53D39]"></div>
                  </div>
                )}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <kbd className="px-2 py-1 text-xs text-gray-500 bg-white border border-gray-200 rounded shadow-sm">
                    ⌘K
                  </kbd>
                </div>
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <>
                      <div className="p-3 border-b border-gray-100">
                        <p className="text-sm text-gray-600 font-medium">Search Results</p>
                      </div>
                      {searchResults.map((result) => (
                        <Link
                          key={result.id}
                          href={`/product/${result.id}`}
                          className="flex items-center p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                          onClick={() => {
                            setShowSearchResults(false)
                            setSearchQuery("")
                          }}
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={result.image || "/placeholder.svg"}
                              alt={result.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-3 flex-1">
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{result.name}</h4>
                            <p className="text-xs text-gray-500">{result.category}</p>
                            <p className="text-sm font-semibold text-[#C53D39]">PKR {result.price.toLocaleString()}</p>
                          </div>
                        </Link>
                      ))}
                      <div className="p-3 border-t border-gray-100">
                        <Link
                          href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                          className="text-sm text-[#C53D39] hover:text-[#A02E2A] font-medium"
                          onClick={() => {
                            setShowSearchResults(false)
                            setSearchQuery("")
                          }}
                        >
                          View all results for "{searchQuery}"
                        </Link>
                      </div>
                    </>
                  ) : searchQuery && !searchLoading ? (
                    <div className="p-6 text-center">
                      <p className="text-gray-500">No products found for "{searchQuery}"</p>
                      <Link
                        href="/shop"
                        className="text-sm text-[#C53D39] hover:text-[#A02E2A] font-medium mt-2 inline-block"
                        onClick={() => setShowSearchResults(false)}
                      >
                        Browse all products
                      </Link>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-500">Free shipping on orders over PKR 50,000</span>
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
          <div className="flex items-center space-x-3">
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

            {/* User Account Button */}
            <div className="relative">
              {!authLoading && user ? (
                <button
                  className="group relative bg-white text-gray-900 font-normal text-sm border border-[#C53D39] hover:text-white hover:border-transparent transition-all duration-700 overflow-hidden font-poppins flex items-center space-x-2 px-3 py-2 rounded-lg"
                  onClick={handleAccountClick}
                >
                  {/* Left-Right Fill Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center"></div>

                  {/* Button Content */}
                  <div className="relative z-10 flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      {user.profilePicture ? (
                        <AvatarImage
                          src={user.profilePicture || "/placeholder.svg"}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                      ) : null}
                      <AvatarFallback className="bg-gradient-to-r from-[#C53D39] to-[#E85A4F] text-white text-xs font-medium">
                        {getUserInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="transition-colors duration-300 hidden sm:inline">{user.firstName}</span>
                  </div>
                </button>
              ) : (
                <Link href="/auth/login">
                  <button className="group relative bg-white text-gray-900 font-normal text-sm border border-[#C53D39] hover:text-white hover:border-transparent transition-all duration-700 overflow-hidden font-poppins px-4 py-2 rounded-lg">
                    {/* Left-Right Fill Background Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center"></div>

                    {/* Button Content */}
                    <span className="relative z-10 transition-colors duration-300">Sign In</span>
                  </button>
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

            {/* Logout Button (when user is logged in) */}
            {user && (
              <button
                onClick={handleLogout}
                className="group relative bg-white text-gray-900 font-normal text-sm border border-red-500 hover:text-white hover:border-transparent transition-all duration-700 overflow-hidden font-poppins p-2 rounded-lg"
                title="Logout"
              >
                {/* Left-Right Fill Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center"></div>

                {/* Button Content */}
                <LogOut className="relative z-10 h-4 w-4 transition-colors duration-300" />
              </button>
            )}

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
            {/* Mobile Search */}
            <div className="px-4 mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search furniture..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C53D39] focus:border-transparent transition-all duration-300 font-poppins"
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
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
