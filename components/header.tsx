"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import {
  ShoppingCart,
  Heart,
  Scale,
  Phone,
  Mail,
  User,
  Package,
  MapPin,
  Settings,
  LogOut,
  Truck,
  Eye,
  Trash2,
  Plus,
  Minus,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { SearchComponent } from "./header/search-component"
import { useCompare } from "@/hooks/use-compare"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function Header() {
  const { items, addToCart, removeFromCart, updateQuantity } = useCart()
  const { items: wishlistItems, removeFromWishlist } = useWishlist()
  const { items: compareItems, removeFromCompare } = useCompare()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
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
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const cartDropdownRef = useRef<HTMLDivElement>(null)
  const wishlistDropdownRef = useRef<HTMLDivElement>(null)
  const compareDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAccountDropdown(false)
      }
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target as Node)) {
        setShowCartDropdown(false)
      }
      if (wishlistDropdownRef.current && !wishlistDropdownRef.current.contains(event.target as Node)) {
        setShowWishlistDropdown(false)
      }
      if (compareDropdownRef.current && !compareDropdownRef.current.contains(event.target as Node)) {
        setShowCompareDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
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

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      setShowAccountDropdown(false)
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleRemoveFromCart = (itemId: string) => {
    removeFromCart(itemId)
    toast.success("Item removed from cart")
  }

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleMoveToCart = (item: any) => {
    try {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      })
      removeFromWishlist(item.id)
      toast.success(`${item.name} moved to cart!`)
    } catch (error) {
      console.error("Error moving to cart:", error)
      toast.error("Failed to move item to cart")
    }
  }

  const handleAddToCartFromCompare = (item: any) => {
    try {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      })
      toast.success(`${item.name} added to cart!`)
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add item to cart")
    }
  }

  // Get user initials
  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString()}`
  }

  // Cart Dropdown Component with quantity controls
  const CartDropdown = () => {
    if (!showCartDropdown) return null

    return (
      <div
        ref={cartDropdownRef}
        className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto"
      >
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shopping Cart ({itemCount})</h3>
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={50}
                    height={50}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900">{item.name}</h4>
                    <p className="text-sm font-semibold text-[#C53D39]">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="h-6 w-6 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="h-6 w-6 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-[#C53D39]">
                    {formatPrice(items.reduce((sum, item) => sum + item.price * item.quantity, 0))}
                  </span>
                </div>
                <div className="space-y-2">
                  <Link href="/cart" className="block">
                    <Button
                      className="w-full bg-gradient-to-r from-[#C53D39] to-[#E85A4F] hover:from-[#B12E2A] hover:to-[#D74B3F]"
                      onClick={() => setShowCartDropdown(false)}
                    >
                      View Cart
                    </Button>
                  </Link>
                  <Link href="/checkout" className="block">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => setShowCartDropdown(false)}
                    >
                      Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Wishlist Dropdown Component - Simplified with only view functionality
  const WishlistDropdown = () => {
    if (!showWishlistDropdown) return null

    return (
      <div
        ref={wishlistDropdownRef}
        className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto"
      >
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Wishlist ({wishlistCount})</h3>
          {wishlistItems.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Your wishlist is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlistItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={50}
                    height={50}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900">{item.name}</h4>
                    <p className="text-sm font-semibold text-[#C53D39]">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex gap-1">
                    <Link href={`/product/${item.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                        onClick={() => setShowWishlistDropdown(false)}
                      >
                        <Eye className="h-4 w-4 text-gray-500" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4">
                <Link href="/account/wishlist" className="block">
                  <Button
                    className="w-full bg-gradient-to-r from-[#C53D39] to-[#E85A4F] hover:from-[#B12E2A] hover:to-[#D74B3F]"
                    onClick={() => setShowWishlistDropdown(false)}
                  >
                    View Wishlist
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Compare Dropdown Component - Simplified with only view functionality
  const CompareDropdown = () => {
    if (!showCompareDropdown) return null

    return (
      <div
        ref={compareDropdownRef}
        className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Compare ({compareCount})</h3>
          </div>
          {compareItems.length === 0 ? (
            <div className="text-center py-8">
              <Scale className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No items to compare</p>
            </div>
          ) : (
            <div className="space-y-4">
              {compareItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={50}
                    height={50}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900">{item.name}</h4>
                    <p className="text-sm font-semibold text-[#C53D39]">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex gap-1">
                    <Link href={`/product/${item.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                        onClick={() => setShowCompareDropdown(false)}
                      >
                        <Eye className="h-4 w-4 text-gray-500" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4">
                <Link href="/compare" className="block">
                  <Button
                    className="w-full bg-gradient-to-r from-[#C53D39] to-[#E85A4F] hover:from-[#B12E2A] hover:to-[#D74B3F]"
                    onClick={() => setShowCompareDropdown(false)}
                  >
                    <Eye className="h-3 w-3 mr-2" />
                    Compare Items
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Account Dropdown Component
  const AccountDropdown = () => {
    if (!showAccountDropdown || !user) return null

    const accountMenuItems = [
      {
        title: "Dashboard",
        description: "Account overview",
        icon: User,
        href: "/account",
      },
      {
        title: "Orders",
        description: "View your order history",
        icon: Package,
        href: "/account/orders",
      },
      {
        title: "Track Order",
        description: "Track your current orders",
        icon: Truck,
        href: "/track-order",
      },
      {
        title: "Wishlist",
        description: "Your saved items",
        icon: Heart,
        href: "/account/wishlist",
      },
      {
        title: "Addresses",
        description: "Manage shipping addresses",
        icon: MapPin,
        href: "/account/addresses",
      },
      {
        title: "Account Settings",
        description: "Update your profile",
        icon: Settings,
        href: "/account/settings",
      },
    ]

    return (
      <div
        ref={dropdownRef}
        className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto"
      >
        <div className="p-0">
          {/* User Info Header with Gradient Background */}
          <div className="bg-gradient-to-r from-[#C53D39] to-[#E85A4F] p-4 rounded-t-xl">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-white">
                {user.profilePicture ? (
                  <AvatarImage
                    src={user.profilePicture || "/placeholder.svg"}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                ) : (
                  <AvatarFallback className="bg-white text-[#C53D39] text-sm font-medium">
                    {getUserInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="font-semibold text-white">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-white/80">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-4 space-y-1">
            {accountMenuItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                onClick={() => setShowAccountDropdown(false)}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-[#C53D39] to-[#E85A4F] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Logout Button */}
          <div className="border-t border-gray-100 p-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors group w-full text-left"
            >
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium text-red-600">Logout</h4>
                <p className="text-sm text-red-500">Sign out of your account</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Sticky Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Desktop Secondary header with contact info, search, and social media */}
          <div className="hidden lg:flex items-center justify-between py-3 text-sm text-gray-600 border-b border-gray-100">
            {/* Contact Info - Stacked Vertically */}
            <div className="flex flex-col space-y-1 font-poppins">
              <a
                href="mailto:revivefurniture01@gmail.com"
                className="flex items-center space-x-2 hover:text-[#C53D39] transition-colors text-sm"
              >
                <Mail className="h-4 w-4" />
                <span>revivefurniture01@gmail.com</span>
              </a>
              <a
                href="tel:+923066203252"
                className="flex items-center space-x-2 hover:text-[#C53D39] transition-colors text-sm"
              >
                <Phone className="h-4 w-4" />
                <span>Hot Line: (+92)-306-6203252</span>
              </a>
            </div>

            {/* Search Component - Centered and Wider */}
            <div className="flex-1 flex justify-center px-8">
              <SearchComponent />
            </div>

            {/* Social Media Icons - Larger */}
            <div className="flex items-center space-x-3">
              <a
                href="https://www.facebook.com/ReviveFurnituree/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-[#1877F2] hover:bg-[#1877F2]/10 rounded-full transition-all duration-200"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/company/revive-furniture"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 rounded-full transition-all duration-200"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>

              <a
                href="https://www.pinterest.com/revivefurniture01/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-[#E60023] hover:bg-[#E60023]/10 rounded-full transition-all duration-200"
                aria-label="Pinterest"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12C24.007 5.367 18.641.001 12.017.001z" />
                </svg>
              </a>

              <a
                href="https://www.instagram.com/revivefurniturepk/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-[#E4405F] hover:bg-[#E4405F]/10 rounded-full transition-all duration-200"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d=\"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.689-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-
