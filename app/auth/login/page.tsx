"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [creatingTestUser, setCreatingTestUser] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("[v0] Attempting login with:", email)

      if (email === "admin@revivefurniture.com" || email.includes("admin")) {
        console.log("[v0] Admin email detected, trying admin login...")

        const adminResponse = await fetch("/api/admin/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        })

        const adminData = await adminResponse.json()
        console.log("[v0] Admin login response:", adminData)

        if (adminResponse.ok) {
          console.log("[v0] Admin login successful, redirecting to admin panel...")
          router.push("/admin")
          router.refresh()
          return
        } else {
          console.log("[v0] Admin login failed:", adminData.error)
          // Show admin-specific error message
          setError(`Admin login failed: ${adminData.error || "Invalid credentials"}`)
          setLoading(false)
          return
        }
      }

      // Regular user login
      console.log("[v0] Attempting regular user login...")
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log("[v0] User login response:", data)

      if (!response.ok) {
        throw new Error(data.error || `Login failed (${response.status})`)
      }

      console.log("[v0] User login successful, redirecting...")
      router.push("/account")
      router.refresh()
    } catch (error) {
      console.error("[v0] Login error:", error)
      setError(error instanceof Error ? error.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const createTestUser = async () => {
    setCreatingTestUser(true)
    setError("")

    try {
      const response = await fetch("/api/create-test-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create test user")
      }

      // Auto-fill the form with test credentials
      setEmail("test@mail.com")
      setPassword("123456789")

      alert("Test user created successfully! Form filled with test credentials.")
    } catch (error) {
      console.error("Error creating test user:", error)
      setError(error instanceof Error ? error.message : "Failed to create test user")
    } finally {
      setCreatingTestUser(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
            <br />
            <span className="text-xs text-gray-500 mt-1">
              Admin users will be automatically redirected to the admin panel
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="text-center">
              <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                Forgot your password?
              </Link>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {/* Regular test user */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-medium text-blue-800 mb-2">For Testing (Regular User):</h3>
              <div className="space-y-2">
                <p className="text-xs text-blue-700">
                  <strong>Email:</strong> test@mail.com
                </p>
                <p className="text-xs text-blue-700">
                  <strong>Password:</strong> 123456789
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={createTestUser}
                  disabled={creatingTestUser}
                  className="w-full mt-2 bg-transparent"
                >
                  {creatingTestUser ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Creating Test User...
                    </>
                  ) : (
                    "Create Test User & Fill Form"
                  )}
                </Button>
              </div>
            </div>

            {/* Admin test credentials */}
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h3 className="text-sm font-medium text-red-800 mb-2">Admin Login:</h3>
              <div className="space-y-2">
                <p className="text-xs text-red-700">
                  <strong>Email:</strong> admin@revivefurniture.com
                </p>
                <p className="text-xs text-red-700">
                  <strong>Password:</strong> admin123
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEmail("admin@revivefurniture.com")
                    setPassword("admin123")
                  }}
                  className="w-full mt-2 bg-transparent border-red-300 text-red-700 hover:bg-red-100"
                >
                  Fill Admin Credentials
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
