"use client"

import { useState, useEffect } from "react"
import { User, Mail, Phone, Lock, Save, Eye, EyeOff } from "lucide-react"
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
  created_at: string
}

export default function AccountSettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

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
        setUserData(data.user)
        setFormData({
          firstName: data.user.first_name,
          lastName: data.user.last_name,
          email: data.user.email,
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
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
    setMessage("")
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    setError("")
    setMessage("")

    try {
      // Validate password fields if changing password
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setError("New passwords do not match")
          setIsSaving(false)
          return
        }
        if (formData.newPassword.length < 8) {
          setError("New password must be at least 8 characters long")
          setIsSaving(false)
          return
        }
        if (!formData.currentPassword) {
          setError("Current password is required to change password")
          setIsSaving(false)
          return
        }
      }

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
        setUserData(data.user)
        setMessage(data.message || "Settings updated successfully")
        // Clear password fields
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }))
      } else {
        setError(data.error || "Failed to update settings")
      }
    } catch (error) {
      console.error("Error updating settings:", error)
      setError("Failed to update settings")
    } finally {
      setIsSaving(false)
    }
  }

  const breadcrumbItems = [{ label: "Account", href: "/account" }, { label: "Settings" }]

  if (isLoading) {
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
            <p className="text-gray-600">Update your personal information and security settings</p>
          </div>

          {/* Success/Error Messages */}
          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800">{message}</div>
          )}
          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">{error}</div>}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Information */}
            <Card className="bg-white shadow-lg border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First Name *
                    </Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="pl-10 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last Name *
                    </Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="pl-10 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address *
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="pl-10 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                    />
                  </div>
                </div>

                {userData && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Account Information</h4>
                    <p className="text-sm text-gray-600">
                      Member since: {new Date(userData.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">User ID: {userData.id}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card className="bg-white shadow-lg border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                    Current Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                      className="pl-10 pr-10 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
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
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange("newPassword", e.target.value)}
                      className="pl-10 pr-10 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm New Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="pl-10 pr-10 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
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

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <h4 className="font-medium text-orange-900 mb-2">Password Requirements:</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Include uppercase and lowercase letters</li>
                    <li>• Include at least one number</li>
                    <li>• Include at least one special character</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="mt-8 text-center">
            <Button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="w-full max-w-md h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-xl transition-all duration-300"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save All Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
