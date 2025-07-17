"use client"

import { useState } from "react"
import { Search, Heart, ShoppingBag, User, Home, Scale } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { SearchComponent } from "./search-component"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCompare } from "@/hooks/use-compare"
import { useAuth } from "@/hooks/use-auth"

export function MobileHeader() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [showSearch, setShowSearch] = useState(false)

  const { items: cartItems } = useCart()
  const { items: wishlistItems } = useWishlist()
  const { items: compareItems } = useCompare()
  const { user } = useAuth()

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  const closeDropdown = () => {
    setActiveDropdown(null)
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        {/* Logo and Search Row */}
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo.webp" alt="Revive Furniture" width={120} height={40} className="h-8 w-auto" />
          </Link>

          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 text-gray-600 hover:text-[#C53D39] transition-colors"
          >
            <Search className="w-6 h-6" />
          </button>
        </div>

        {/* Search Bar (Expandable) */}
        {showSearch && (
          <div className="px-4 pb-3 border-t border-gray-100">
            <SearchComponent onClose={() => setShowSearch(false)} />
          </div>
        )}

        {/* Bottom Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="flex items-center justify-around py-2">
            {/* Home */}
            <Link
              href="/"
              className="flex flex-col items-center p-2 text-gray-600 hover:text-[#C53D39] transition-colors"
            >
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1 font-poppins">Home</span>
            </Link>

            {/* Wishlist */}
            <button
              onClick={() => toggleDropdown("wishlist")}
              className="flex flex-col items-center p-2 text-gray-600 hover:text-[#C53D39] transition-colors relative"
            >
              <div className="relative">
                <Heart className="w-6 h-6" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {wishlistItems.length}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-poppins">Wishlist</span>
            </button>

            {/* Account (Center) */}
            <button
              onClick={() => toggleDropdown("account")}
              className="flex flex-col items-center p-2 text-white bg-gradient-to-r from-[#C53D39] to-[#F1BA69] rounded-full mx-2 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <User className="w-7 h-7" />
            </button>

            {/* Compare */}
            <button
              onClick={() => toggleDropdown("compare")}
              className="flex flex-col items-center p-2 text-gray-600 hover:text-[#C53D39] transition-colors relative"
            >
              <div className="relative">
                <Scale className="w-6 h-6" />
                {compareItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {compareItems.length}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-poppins">Compare</span>
            </button>

            {/* Cart */}
            <button
              onClick={() => toggleDropdown("cart")}
              className="flex flex-col items-center p-2 text-gray-600 hover:text-[#C53D39] transition-colors relative"
            >
              <div className="relative">
                <ShoppingBag className="w-6 h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartItems.length}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-poppins">Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-up Modals */}
      {activeDropdown && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={closeDropdown} />

          {/* Modal Content */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-hidden"
            style={{
              animation: "slideUp 0.3s ease-out",
            }}
          >
            <style jsx>{`
              @keyframes slideUp {
                from {
                  transform: translateY(100%);
                }
                to {
                  transform: translateY(0);
                }
              }
            `}</style>

            {/* Handle Bar */}
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Modal Content Based on Active Dropdown */}
            <div className="pb-20">
              {activeDropdown === "wishlist" && <MobileWishlistContent onClose={closeDropdown} />}
              {activeDropdown === "cart" && <MobileCartContent onClose={closeDropdown} />}
              {activeDropdown === "compare" && <MobileCompareContent onClose={closeDropdown} />}
              {activeDropdown === "account" && <MobileAccountContent onClose={closeDropdown} user={user} />}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Mobile-specific content components
function MobileWishlistContent({ onClose }: { onClose: () => void }) {
  const { items: wishlistItems, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold text-center mb-4 font-montserrat">My Wishlist</h3>
      {wishlistItems.length === 0 ? (
        <div className="text-center py-8">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-poppins">Your wishlist is empty</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {wishlistItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={60}
                height={60}
                className="rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 font-poppins">{item.name}</h4>
                <p className="text-[#C53D39] font-semibold">₨{item.price.toLocaleString()}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => {
                    addToCart(item)
                    onClose()
                  }}
                  className="px-3 py-1 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white text-sm rounded-lg"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-lg"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function MobileCartContent({ onClose }: { onClose: () => void }) {
  const { items, updateQuantity, removeFromCart, total } = useCart()

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold text-center mb-4 font-montserrat">Shopping Cart</h3>
      {items.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-poppins">Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 font-poppins">{item.name}</h4>
                  <p className="text-[#C53D39] font-semibold">₨{item.price.toLocaleString()}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 p-2">
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-xl font-bold text-[#C53D39]">₨{total.toLocaleString()}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white text-center py-3 rounded-lg font-semibold"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

function MobileCompareContent({ onClose }: { onClose: () => void }) {
  const { items: compareItems, removeFromCompare } = useCompare()

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold text-center mb-4 font-montserrat">Compare Products</h3>
      {compareItems.length === 0 ? (
        <div className="text-center py-8">
          <Scale className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-poppins">No products to compare</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {compareItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={60}
                height={60}
                className="rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 font-poppins">{item.name}</h4>
                <p className="text-[#C53D39] font-semibold">₨{item.price.toLocaleString()}</p>
              </div>
              <button onClick={() => removeFromCompare(item.id)} className="text-red-500 p-2">
                ×
              </button>
            </div>
          ))}
          {compareItems.length > 0 && (
            <Link
              href="/compare"
              onClick={onClose}
              className="block w-full bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white text-center py-3 rounded-lg font-semibold mt-4"
            >
              Compare Now
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

function MobileAccountContent({ onClose, user }: { onClose: () => void; user?: any }) {
  const menuItems = [
    { icon: User, label: "My Profile", href: "/account" },
    { icon: ShoppingBag, label: "My Orders", href: "/account/orders" },
    { icon: Heart, label: "Wishlist", href: "/account/wishlist" },
    { icon: Scale, label: "Compare", href: "/compare" },
  ]

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#C53D39] to-[#F1BA69] flex items-center justify-center mx-auto mb-3">
          <User className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-xl font-bold font-montserrat">{user ? `Hi, ${user.name}!` : "Welcome!"}</h3>
        {user && <p className="text-gray-600 font-poppins">{user.email}</p>}
      </div>

      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            onClick={onClose}
            className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <item.icon className="w-6 h-6 text-[#C53D39]" />
            <span className="font-poppins font-medium">{item.label}</span>
          </Link>
        ))}
      </div>

      {user ? (
        <button
          onClick={async () => {
            try {
              await fetch("/api/auth/logout", { method: "POST" })
              onClose()
              window.location.href = "/auth/logout"
            } catch (error) {
              console.error("Logout error:", error)
            }
          }}
          className="w-full mt-6 bg-red-500 text-white py-3 rounded-lg font-semibold"
        >
          Logout
        </button>
      ) : (
        <div className="space-y-2 mt-6">
          <Link
            href="/auth/login"
            onClick={onClose}
            className="block w-full bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white text-center py-3 rounded-lg font-semibold"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            onClick={onClose}
            className="block w-full border border-[#C53D39] text-[#C53D39] text-center py-3 rounded-lg font-semibold"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  )
}
