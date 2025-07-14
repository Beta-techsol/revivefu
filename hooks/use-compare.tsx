"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface CompareItem {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  specifications: Record<string, string>
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

  const addToCompare = (item: CompareItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev
      if (prev.length >= 4) return prev
      return [...prev, item]
    })
  }

  const removeFromCompare = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCompare = () => {
    setItems([])
  }

  const isInCompare = (id: string) => {
    return items.some((item) => item.id === id)
  }

  return (
    <CompareContext.Provider value={{ items, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
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
