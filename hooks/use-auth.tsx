"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
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

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        setUser({
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          phone: data.user.phone,
          profilePicture: data.user.profilePicture,
          emailVerified: data.user.emailVerified,
          lastLogin: data.user.lastLogin,
        })
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
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser({
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          phone: data.user.phone,
          profilePicture: data.user.profilePicture,
          emailVerified: data.user.emailVerified,
          lastLogin: data.user.lastLogin,
        })
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
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (response.ok) {
        setUser(null)
        // Force a page reload to clear any cached data
        window.location.reload()
      }
    } catch (error) {
      console.error("Logout failed:", error)
      // Even if the API call fails, clear the user state
      setUser(null)
      window.location.reload()
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
