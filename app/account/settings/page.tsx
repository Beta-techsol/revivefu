"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { User, Mail, Phone, Lock, Save, Eye, EyeOff, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BreadcrumbComponent } from "@/components/ui/breadcrumb"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function AccountSettingsPage() {
  const { user, refreshUser } = useAuth()
  const router = useRouter()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name,
        last_name: user.last_name,
      })
    }
  }, [user])

  const handleProfileInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        await refreshUser()
      } else {
        toast.error(data.error || "Failed to update profile")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        toast.error(data.error || "Failed to change password")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }

    setIsUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append("avatar", file)

      const response = await fetch("/api/user/upload-avatar", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        await refreshUser()
      } else {
        toast.error(data.error || "Failed to upload avatar")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  if (!user) {
    router.push("/auth/login")
    return null
  }

  const breadcrumbItems = [{ label: "Account", href: "/account" }, { label: "Settings" }]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <BreadcrumbComponent items={breadcrumbItems} />

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
            <p className="text-gray-600">Update your personal information and security settings</p>
          </div>

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
                {/* Profile Picture */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    {user.profile_picture_url ? (
                      <img
                        src={user.profile_picture_url || "/placeholder.svg"}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
                        {getInitials(user.first_name, user.last_name)}
                      </div>
                    )}
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <Camera className="w-4 h-4 text-gray-600" />
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={isUploadingAvatar}
                    />
                  </div>
                  {isUploadingAvatar && <p className="text-sm text-gray-500">Uploading...</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">
                      First Name
                    </Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="first_name"
                        value={profileData.first_name}
                        onChange={(e) => handleProfileInputChange("first_name", e.target.value)}
                        className="pl-10 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
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
                        value={profileData.last_name}
                        onChange={(e) => handleProfileInputChange("last_name", e.target.value)}
                        className="pl-10 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
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
                      value={user.email}
                      disabled
                      className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
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
                      value={user.phone || ""}
                      disabled
                      className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Phone number cannot be changed</p>
                </div>

                <Button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-xl transition-all duration-300"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Profile"}
                </Button>
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
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordInputChange("currentPassword", e.target.value)}
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
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordInputChange("newPassword", e.target.value)}
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
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordInputChange("confirmPassword", e.target.value)}
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

                <Button
                  onClick={handleChangePassword}
                  disabled={
                    isLoading ||
                    !passwordData.currentPassword ||
                    !passwordData.newPassword ||
                    passwordData.newPassword !== passwordData.confirmPassword
                  }
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-xl transition-all duration-300"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Account Preferences */}
          <Card className="mt-8 bg-white shadow-lg border-0 rounded-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive updates about your orders and promotions</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                    <p className="text-sm text-gray-600">Get text updates for order status and delivery</p>
                  </div>
                  <input type="checkbox" className="rounded border-gray-300 text-orange-500 focus:ring-orange-400" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">Marketing Communications</h4>
                    <p className="text-sm text-gray-600">Receive special offers and product recommendations</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
