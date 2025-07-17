"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { User, Lock, Mail, Phone, Save, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BreadcrumbComponent } from "@/components/ui/breadcrumb"
import { useRouter } from "next/navigation"

interface UserData {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  profile_picture_url?: string
  email_verified: boolean
  is_active: boolean
  last_login?: string
  created_at: string
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const router = useRouter()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/account/settings")
      if (response.status === 401) {
        router.push("/auth/login")
        return
      }

      const data = await response.json()
      if (response.ok) {
        setUser(data.user)
        setFormData({
          firstName: data.user.first_name || "",
          lastName: data.user.last_name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        setError(data.error || "Failed to fetch user data")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      setError("Failed to fetch user data")
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")
    setError("")

    try {
      const response = await fetch("/api/account/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        setMessage(data.message || "Profile updated successfully")
      } else {
        setError(data.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setError("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")
    setError("")

    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match")
      setSaving(false)
      return
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long")
      setSaving(false)
      return
    }

    try {
      const response = await fetch("/api/account/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        setMessage(data.message || "Password updated successfully")
        // Clear password fields
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }))
      } else {
        setError(data.error || "Failed to update password")
      }
    } catch (error) {
      console.error("Error updating password:", error)
      setError("Failed to update password")
    } finally {
      setSaving(false)
    }
  }

  const breadcrumbItems = [{ label: "Account", href: "/account" }, { label: "Settings" }]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading settings...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <BreadcrumbComponent items={breadcrumbItems} />

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
            <p className="text-gray-600">Manage your account information and security settings</p>
          </div>

          {/* Messages */}
          {message && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl">{message}</div>
          )}

          {error && <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">{error}</div>}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Information */}
            <Card className="bg-white shadow-lg border-0 rounded-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">Profile Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                        className="mt-1 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                        className="mt-1 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        className="mt-1 h-12 pl-10 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        className="mt-1 h-12 pl-10 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={saving}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-xl transition-all duration-300"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Saving..." : "Save Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card className="bg-white shadow-lg border-0 rounded-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">Change Password</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={formData.currentPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                        className="mt-1 h-12 pr-10 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, newPassword: e.target.value }))}
                        className="mt-1 h-12 pr-10 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long</p>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        className="mt-1 h-12 pr-10 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={saving}
                    className="w-full h-12 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium rounded-xl transition-all duration-300"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    {saving ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Account Information */}
          {user && (
            <Card className="mt-8 bg-white shadow-lg border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Account Status</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.email_verified ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.email_verified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Member Since</Label>
                    <p className="text-gray-900 mt-1">
                      {new Date(user.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {user.last_login && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Last Login</Label>
                      <p className="text-gray-900 mt-1">
                        {new Date(user.last_login).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-medium text-gray-700">User ID</Label>
                    <p className="text-gray-900 mt-1 font-mono text-sm">{user.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
