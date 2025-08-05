"use client"

import { useState } from "react"
import { Save, Upload, Eye, EyeOff, Bell, Shield, Palette, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

export default function AdminSettingsPage() {
  const [showApiKey, setShowApiKey] = useState(false)
  const { toast } = useToast()

  const [storeSettings, setStoreSettings] = useState({
    storeName: "Revive Furniture",
    storeDescription: "Premium furniture for modern living spaces",
    storeEmail: "info@revivefurniture.com",
    storePhone: "+1 234 567 8900",
    storeAddress: "123 Furniture Street, Design City, DC 12345",
    currency: "USD",
    timezone: "America/New_York",
    taxRate: "8.5",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderNotifications: true,
    inventoryAlerts: true,
    customerMessages: true,
    marketingEmails: false,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    apiKey: "sk_live_1234567890abcdef",
    webhookUrl: "https://revivefurniture.com/webhooks",
  })

  const [appearanceSettings, setAppearanceSettings] = useState({
    primaryColor: "#C53D39",
    secondaryColor: "#F1BA69",
    logoUrl: "/logo.webp",
    faviconUrl: "/favicon.ico",
  })

  const handleSaveSettings = (section: string) => {
    toast({
      title: "Settings Saved",
      description: `${section} settings have been updated successfully.`,
    })
  }

  const handleStoreSettingChange = (key: string, value: string) => {
    setStoreSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSecurityChange = (key: string, value: string | boolean) => {
    setSecuritySettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleAppearanceChange = (key: string, value: string) => {
    setAppearanceSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-montserrat">Store Settings</h1>
        <p className="text-gray-600 font-poppins">Manage your store configuration and preferences</p>
      </div>

      {/* Store Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2 font-montserrat">
              <Globe className="w-5 h-5 text-[#C53D39]" />
              <span>Store Information</span>
            </CardTitle>
            <CardDescription className="font-poppins">Basic information about your store</CardDescription>
          </div>
          <Button
            onClick={() => handleSaveSettings("Store Information")}
            className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="storeName" className="font-poppins">
                Store Name
              </Label>
              <Input
                id="storeName"
                value={storeSettings.storeName}
                onChange={(e) => handleStoreSettingChange("storeName", e.target.value)}
                className="font-poppins"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeEmail" className="font-poppins">
                Store Email
              </Label>
              <Input
                id="storeEmail"
                type="email"
                value={storeSettings.storeEmail}
                onChange={(e) => handleStoreSettingChange("storeEmail", e.target.value)}
                className="font-poppins"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storePhone" className="font-poppins">
                Store Phone
              </Label>
              <Input
                id="storePhone"
                value={storeSettings.storePhone}
                onChange={(e) => handleStoreSettingChange("storePhone", e.target.value)}
                className="font-poppins"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency" className="font-poppins">
                Currency
              </Label>
              <Input
                id="currency"
                value={storeSettings.currency}
                onChange={(e) => handleStoreSettingChange("currency", e.target.value)}
                className="font-poppins"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="storeDescription" className="font-poppins">
              Store Description
            </Label>
            <Textarea
              id="storeDescription"
              value={storeSettings.storeDescription}
              onChange={(e) => handleStoreSettingChange("storeDescription", e.target.value)}
              className="font-poppins"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storeAddress" className="font-poppins">
              Store Address
            </Label>
            <Textarea
              id="storeAddress"
              value={storeSettings.storeAddress}
              onChange={(e) => handleStoreSettingChange("storeAddress", e.target.value)}
              className="font-poppins"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2 font-montserrat">
              <Bell className="w-5 h-5 text-[#C53D39]" />
              <span>Notification Settings</span>
            </CardTitle>
            <CardDescription className="font-poppins">Configure your notification preferences</CardDescription>
          </div>
          <Button
            onClick={() => handleSaveSettings("Notification")}
            className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-poppins font-medium">Email Notifications</Label>
                <p className="text-sm text-gray-600 font-poppins">Receive general email notifications</p>
              </div>
              <Switch
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-poppins font-medium">Order Notifications</Label>
                <p className="text-sm text-gray-600 font-poppins">Get notified about new orders</p>
              </div>
              <Switch
                checked={notificationSettings.orderNotifications}
                onCheckedChange={(checked) => handleNotificationChange("orderNotifications", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-poppins font-medium">Inventory Alerts</Label>
                <p className="text-sm text-gray-600 font-poppins">Low stock and inventory alerts</p>
              </div>
              <Switch
                checked={notificationSettings.inventoryAlerts}
                onCheckedChange={(checked) => handleNotificationChange("inventoryAlerts", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-poppins font-medium">Customer Messages</Label>
                <p className="text-sm text-gray-600 font-poppins">Customer inquiries and messages</p>
              </div>
              <Switch
                checked={notificationSettings.customerMessages}
                onCheckedChange={(checked) => handleNotificationChange("customerMessages", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-poppins font-medium">Marketing Emails</Label>
                <p className="text-sm text-gray-600 font-poppins">Promotional and marketing emails</p>
              </div>
              <Switch
                checked={notificationSettings.marketingEmails}
                onCheckedChange={(checked) => handleNotificationChange("marketingEmails", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2 font-montserrat">
              <Shield className="w-5 h-5 text-[#C53D39]" />
              <span>Security Settings</span>
            </CardTitle>
            <CardDescription className="font-poppins">Manage security and API configurations</CardDescription>
          </div>
          <Button
            onClick={() => handleSaveSettings("Security")}
            className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-poppins font-medium">Two-Factor Authentication</Label>
              <p className="text-sm text-gray-600 font-poppins">Add an extra layer of security to your account</p>
            </div>
            <Switch
              checked={securitySettings.twoFactorAuth}
              onCheckedChange={(checked) => handleSecurityChange("twoFactorAuth", checked)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout" className="font-poppins">
                Session Timeout (minutes)
              </Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => handleSecurityChange("sessionTimeout", e.target.value)}
                className="font-poppins"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhookUrl" className="font-poppins">
                Webhook URL
              </Label>
              <Input
                id="webhookUrl"
                value={securitySettings.webhookUrl}
                onChange={(e) => handleSecurityChange("webhookUrl", e.target.value)}
                className="font-poppins"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="font-poppins">
              API Key
            </Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                value={securitySettings.apiKey}
                onChange={(e) => handleSecurityChange("apiKey", e.target.value)}
                className="font-poppins pr-10"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2 font-montserrat">
              <Palette className="w-5 h-5 text-[#C53D39]" />
              <span>Appearance Settings</span>
            </CardTitle>
            <CardDescription className="font-poppins">Customize your store's visual appearance</CardDescription>
          </div>
          <Button
            onClick={() => handleSaveSettings("Appearance")}
            className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primaryColor" className="font-poppins">
                Primary Color
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={appearanceSettings.primaryColor}
                  onChange={(e) => handleAppearanceChange("primaryColor", e.target.value)}
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  value={appearanceSettings.primaryColor}
                  onChange={(e) => handleAppearanceChange("primaryColor", e.target.value)}
                  className="font-poppins"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryColor" className="font-poppins">
                Secondary Color
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={appearanceSettings.secondaryColor}
                  onChange={(e) => handleAppearanceChange("secondaryColor", e.target.value)}
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  value={appearanceSettings.secondaryColor}
                  onChange={(e) => handleAppearanceChange("secondaryColor", e.target.value)}
                  className="font-poppins"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="logoUrl" className="font-poppins">
                Logo URL
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="logoUrl"
                  value={appearanceSettings.logoUrl}
                  onChange={(e) => handleAppearanceChange("logoUrl", e.target.value)}
                  className="font-poppins flex-1"
                />
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="faviconUrl" className="font-poppins">
                Favicon URL
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="faviconUrl"
                  value={appearanceSettings.faviconUrl}
                  onChange={(e) => handleAppearanceChange("faviconUrl", e.target.value)}
                  className="font-poppins flex-1"
                />
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
