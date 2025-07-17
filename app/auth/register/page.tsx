"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        router.push("/auth/login?message=registration-success")
      } else {
        toast.error(data.error || "Registration failed")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg border-0 rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
          <p className="text-gray-600">Join us to start shopping</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">
                  First Name
                </Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="first_name"
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => handleInputChange("first_name", e.target.value)}
                    className="pl-10 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                    placeholder="John"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">
                  Last Name
                </Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="last_name"
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) => handleInputChange("last_name", e.target.value)}
                    className="pl-10 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number (Optional)
              </Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="pl-10 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                  placeholder="+92 300 1234567"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <h4 className="font-medium text-orange-900 mb-2">Password Requirements:</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• At least 8 characters long</li>
                <li>• Include uppercase and lowercase letters</li>
                <li>• Include at least one number</li>
                <li>• Include at least one special character</li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-xl transition-all duration-300"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-orange-600 hover:text-orange-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
