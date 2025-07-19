"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  description: string
}

interface WishlistContextType {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  clearWishlist: () => void
  isInWishlist: (id: string) => boolean
  itemCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist")
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist))
      } catch (error) {
        console.error("Error loading wishlist:", error)
      }
    }
  }, [])

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(items))
  }, [items])

  const addItem = (item: WishlistItem) => {
    try {
      setItems((prevItems) => {
        const existingItem = prevItems.find((i) => i.id === item.id)
        if (existingItem) {
          return prevItems // Item already in wishlist
        }
        return [...prevItems, item]
      })
    } catch (error) {
      console.error("Error adding item to wishlist:", error)
    }
  }

  const removeItem = (id: string) => {
    try {
      setItems((prevItems) => prevItems.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Error removing item from wishlist:", error)
    }
  }

  const clearWishlist = () => {
    try {
      setItems([])
    } catch (error) {
      console.error("Error clearing wishlist:", error)
    }
  }

  const isInWishlist = (id: string) => {
    return items.some((item) => item.id === id)
  }

  const contextValue: WishlistContextType = {
    items,
    addItem,
    removeItem,
    clearWishlist,
    isInWishlist,
    itemCount: items.length,
  }

  return <WishlistContext.Provider value={contextValue}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
