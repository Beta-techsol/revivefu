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
  const [isLoaded, setIsLoaded] = useState(false)

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist")
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist)
        if (Array.isArray(parsedWishlist)) {
          setItems(parsedWishlist)
        }
      }
    } catch (error) {
      console.error("Error loading wishlist:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("wishlist", JSON.stringify(items))
      } catch (error) {
        console.error("Error saving wishlist:", error)
      }
    }
  }, [items, isLoaded])

  const addItem = (item: WishlistItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)
      if (existingItem) {
        return prevItems // Item already in wishlist
      }
      return [...prevItems, item]
    })
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const clearWishlist = () => {
    setItems([])
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
