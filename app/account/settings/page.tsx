"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { Eye, EyeOff, Upload } from "lucide-react"

export default function AccountSettingsPage() {
  const { user, updateProfile, changePassword } = useAuth()
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    profilePictureUrl: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profileMessage, setProfileMessage] = useState("")
  const [profileError, setProfileError] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName,
        lastName: user.lastName,
        profilePictureUrl: user.profilePictureUrl || "",
      })
    }
  }, [user])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setProfileError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setProfileData((prev) => ({
          ...prev,
          profilePictureUrl: data.url,
        }))
      } else {
        setProfileError(data.error || "Failed to upload image")
      }
    } catch (error) {
      setProfileError("Failed to upload image")
    }

    setUploadingImage(false)
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError("")
    setProfileMessage("")
    setProfileLoading(true)

    const result = await updateProfile(profileData)

    if (result.success) {
      setProfileMessage("Profile updated successfully")
    } else {
      setProfileError(result.error || "Failed to update profile")
    }

    setProfileLoading(false)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordMessage("")

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long")
      return
    }

    setPasswordLoading(true)

    const result = await changePassword(passwordData.currentPassword, passwordData.newPassword)

    if (result.success) {
      setPasswordMessage("Password changed successfully")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } else {
      setPasswordError(result.error || "Failed to change password")
    }

    setPasswordLoading(false)
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>Please log in to access your account settings.</AlertDescription>
        </Alert>
      </div>
    )
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      {/* Profile Settings */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your profile picture and personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {profileError && (
              <Alert variant="destructive">
                <AlertDescription>{profileError}</AlertDescription>
              </Alert>
            )}

            {profileMessage && (
              <Alert>
                <AlertDescription>{profileMessage}</AlertDescription>
              </Alert>
            )}

            {/* Profile Picture */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profileData.profilePictureUrl || "/placeholder.svg"} />
                <AvatarFallback className="text-lg">
                  {getInitials(profileData.firstName, profileData.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="profilePicture" className="cursor-pointer">
                  <Button type="button" variant="outline" disabled={uploadingImage} asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingImage ? "Uploading..." : "Change Picture"}
                    </span>
                  </Button>
                </Label>
                <Input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max size 5MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email} disabled className="bg-gray-50" />
              <p className="text-sm text-gray-500">Email cannot be changed. Contact support if needed.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" value={user.phone || ""} disabled className="bg-gray-50" />
              <p className="text-sm text-gray-500">Phone number cannot be changed. Contact support if needed.</p>
            </div>

            <Button type="submit" disabled={profileLoading}>
              {profileLoading ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Password Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {passwordError && (
              <Alert variant="destructive">
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}

            {passwordMessage && (
              <Alert>
                <AlertDescription>{passwordMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" disabled={passwordLoading}>
              {passwordLoading ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
