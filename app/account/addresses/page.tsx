"use client"

import { useState, useEffect } from "react"
import { Edit, Plus, Home, Building, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BreadcrumbComponent } from "@/components/ui/breadcrumb"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Address {
  id: string
  type: "billing" | "shipping"
  name: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  phone?: string
  is_default: boolean
}

export default function AddressesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingAddress, setEditingAddress] = useState<string | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [formData, setFormData] = useState({
    type: "billing" as "billing" | "shipping",
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "Pakistan",
    phone: "",
    is_default: false,
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    fetchAddresses()
  }, [user, router])

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/api/user/addresses")
      if (response.ok) {
        const data = await response.json()
        setAddresses(data.addresses || [])
      } else {
        toast.error("Failed to load addresses")
      }
    } catch (error) {
      toast.error("Failed to load addresses")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveAddress = async (addressId?: string) => {
    try {
      const url = addressId ? `/api/user/addresses/${addressId}` : "/api/user/addresses"
      const method = addressId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(addressId ? "Address updated successfully" : "Address added successfully")
        await fetchAddresses()
        setEditingAddress(null)
        setIsAddingNew(false)
        resetForm()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to save address")
      }
    } catch (error) {
      toast.error("Failed to save address")
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return

    try {
      const response = await fetch(`/api/user/addresses/${addressId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Address deleted successfully")
        await fetchAddresses()
      } else {
        toast.error("Failed to delete address")
      }
    } catch (error) {
      toast.error("Failed to delete address")
    }
  }

  const handleEditAddress = (address: Address) => {
    setFormData({
      type: address.type,
      name: address.name,
      address: address.address,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      phone: address.phone || "",
      is_default: address.is_default,
    })
    setEditingAddress(address.id)
    setIsAddingNew(false)
  }

  const handleAddNew = () => {
    resetForm()
    setIsAddingNew(true)
    setEditingAddress(null)
  }

  const resetForm = () => {
    setFormData({
      type: "billing",
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "Pakistan",
      phone: "",
      is_default: false,
    })
  }

  const handleCancel = () => {
    setEditingAddress(null)
    setIsAddingNew(false)
    resetForm()
  }

  const breadcrumbItems = [{ label: "Account", href: "/account" }, { label: "Addresses" }]

  const AddressForm = ({ address, isEditing }: { address?: Address; isEditing: boolean }) => (
    <Card className="bg-white shadow-lg border-0 rounded-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              {(address?.type || formData.type) === "billing" ? (
                <Building className="w-5 h-5 text-white" />
              ) : (
                <Home className="w-5 h-5 text-white" />
              )}
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900 capitalize">
              {address?.type || formData.type} Address
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {address && !isEditing && (
              <>
                <Button onClick={() => handleEditAddress(address)} variant="outline" size="sm" className="rounded-lg">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteAddress(address.id)}
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
            {isEditing && (
              <Button onClick={handleCancel} variant="outline" size="sm" className="rounded-lg bg-transparent">
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              handleSaveAddress(address?.id)
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                  Address Type
                </Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="mt-1 h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm transition-all duration-300 focus:border-orange-400 focus:ring-orange-400"
                >
                  <option value="billing">Billing</option>
                  <option value="shipping">Shipping</option>
                </select>
              </div>
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="mt-1 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                Street Address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="mt-1 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                  City
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="mt-1 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                  State
                </Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="mt-1 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>
              <div>
                <Label htmlFor="zip" className="text-sm font-medium text-gray-700">
                  ZIP Code
                </Label>
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => handleInputChange("zip", e.target.value)}
                  className="mt-1 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                  Country
                </Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="mt-1 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="mt-1 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="default" className="rounded-lg">
                Save
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Address Type</Label>
                <div className="mt-1 h-12 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm">
                  {formData.type}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                <div className="mt-1 h-12 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm">
                  {formData.name}
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Street Address</Label>
              <div className="mt-1 h-12 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm">
                {formData.address}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">City</Label>
                <div className="mt-1 h-12 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm">
                  {formData.city}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">State</Label>
                <div className="mt-1 h-12 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm">
                  {formData.state}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">ZIP Code</Label>
                <div className="mt-1 h-12 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm">
                  {formData.zip}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Country</Label>
                <div className="mt-1 h-12 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm">
                  {formData.country}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
                <div className="mt-1 h-12 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm">
                  {formData.phone}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="p-4">
      <BreadcrumbComponent items={breadcrumbItems} />
      <div className="mt-4">
        {isAddingNew || editingAddress ? (
          <AddressForm address={addresses.find((addr) => addr.id === editingAddress)} isEditing={true} />
        ) : (
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Addresses</h2>
            <Button onClick={handleAddNew} variant="default" className="rounded-lg">
              <Plus className="w-4 h-4 mr-2" />
              Add New Address
            </Button>
          </div>
        )}
        {isLoading ? (
          <div>Loading addresses...</div>
        ) : (
          <div className="mt-4 space-y-4">
            {addresses.map((address) => (
              <AddressForm key={address.id} address={address} isEditing={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
