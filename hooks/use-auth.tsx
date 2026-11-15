"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  name?: string
  role?: string
  isAdmin?: boolean
  phone?: string
  profilePicture?: string
  emailVerified: boolean
  lastLogin?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  register: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }) => Promise<{ success: boolean; error?: string }>
  refreshUser: () => Promise<void>
}

function normalizeUserPayload(data: any): User | null {
  const raw = data?.user ?? (data?.id ? data : null)
  if (!raw || raw.id === undefined || raw.id === null) {
    return null
  }
  const fallbackName = (raw.name || raw.email || "User").trim()
  const parts = fallbackName.split(/\s+/)
  const firstName = typeof raw.firstName === "string" ? raw.firstName : parts[0] || ""
  const lastName = typeof raw.lastName === "string" ? raw.lastName : parts.slice(1).join(" ") || ""

  return {
    id: String(raw.id),
    email: raw.email || "",
    firstName,
    lastName,
    name: raw.name || `${firstName} ${lastName}`.trim(),
    role: raw.role,
    isAdmin: Boolean(raw.isAdmin ?? data?.isAdmin),
    phone: raw.phone,
    profilePicture: raw.profilePicture,
    emailVerified: raw.emailVerified !== undefined ? Boolean(raw.emailVerified) : true,
    lastLogin: raw.lastLogin,
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        cache: "no-store",
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setUser(normalizeUserPayload(data))
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async () => {
    await checkAuth()
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(normalizeUserPayload(data))
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error("Login failed:", error)
      return { success: false, error: "Login failed. Please try again." }
    }
  }

  const register = async (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error("Registration failed:", error)
      return { success: false, error: "Registration failed. Please try again." }
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setUser(null)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
