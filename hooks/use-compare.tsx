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
  addToCompare: (item: CompareItem) => void
  removeFromCompare: (id: string) => void
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

  const addToCompare = (item: CompareItem) => {
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
  }

  const removeFromCompare = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const clearCompare = () => {
    setItems([])
  }

  const isInCompare = (id: string) => {
    return items.some((item) => item.id === id)
  }

  return (
    <CompareContext.Provider
      value={{
        items,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const context = useContext(CompareContext)
  if (context === undefined) {
    throw new Error("useCompare must be used within a CompareProvider")
  }
  return context
}
