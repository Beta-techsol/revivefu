"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface CompareItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  material: string
  color: string
  brand: string
  rating: number
  reviews: number
  inStock: boolean
}

interface CompareContextType {
  items: CompareItem[]
  addItem: (item: CompareItem) => void
  removeItem: (id: string) => void
  clearCompare: () => void
  isInCompare: (id: string) => boolean
}

const CompareContext = createContext<CompareContextType | undefined>(undefined)

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([])

  // Load compare list from localStorage on mount
  useEffect(() => {
    const savedCompare = localStorage.getItem("compare")
    if (savedCompare) {
      try {
        setItems(JSON.parse(savedCompare))
      } catch (error) {
        console.error("Error loading compare list from localStorage:", error)
      }
    }
  }, [])

  // Save compare list to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("compare", JSON.stringify(items))
  }, [items])

  const addItem = (item: CompareItem) => {
    try {
      setItems((prevItems) => {
        // Limit to 4 items for comparison
        if (prevItems.length >= 4) {
          alert("You can only compare up to 4 items at a time")
          return prevItems
        }

        const existingItem = prevItems.find((i) => i.id === item.id)
        if (existingItem) {
          return prevItems // Item already in compare list
        }

        return [...prevItems, item]
      })
    } catch (error) {
      console.error("Error adding item to compare:", error)
    }
  }

  const removeItem = (id: string) => {
    try {
      setItems((prevItems) => prevItems.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Error removing item from compare:", error)
    }
  }

  const clearCompare = () => {
    try {
      setItems([])
    } catch (error) {
      console.error("Error clearing compare:", error)
    }
  }

  const isInCompare = (id: string) => {
    return items.some((item) => item.id === id)
  }

  const contextValue: CompareContextType = {
    items,
    addItem,
    removeItem,
    clearCompare,
    isInCompare,
  }

  return <CompareContext.Provider value={contextValue}>{children}</CompareContext.Provider>
}

export function useCompare() {
  const context = useContext(CompareContext)
  if (context === undefined) {
    throw new Error("useCompare must be used within a CompareProvider")
  }
  return context
}
