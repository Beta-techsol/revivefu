"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface CompareItem {
  id: string
  name: string
  price: number
  image: string
  description: string
  category?: string
}

interface CompareContextType {
  items: CompareItem[]
  addItem: (item: CompareItem) => void
  removeItem: (id: string) => void
  clearCompare: () => void
  isInCompare: (id: string) => boolean
  itemCount: number
  maxItems: number
}

const CompareContext = createContext<CompareContextType | undefined>(undefined)

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const maxItems = 4 // Maximum items that can be compared

  // Load compare from localStorage on mount
  useEffect(() => {
    try {
      const savedCompare = localStorage.getItem("compare")
      if (savedCompare) {
        const parsedCompare = JSON.parse(savedCompare)
        if (Array.isArray(parsedCompare)) {
          setItems(parsedCompare)
        }
      }
    } catch (error) {
      console.error("Error loading compare:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("compare", JSON.stringify(items))
      } catch (error) {
        console.error("Error saving compare:", error)
      }
    }
  }, [items, isLoaded])

  const addItem = (item: CompareItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)
      if (existingItem) {
        return prevItems // Item already in compare
      }

      if (prevItems.length >= maxItems) {
        // Remove first item if at max capacity
        return [...prevItems.slice(1), item]
      }

      return [...prevItems, item]
    })
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const clearCompare = () => {
    setItems([])
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
    itemCount: items.length,
    maxItems,
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
