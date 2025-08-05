"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Edit, Plus, Home, Building, Trash2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BreadcrumbComponent } from "@/components/ui/breadcrumb"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

interface Address {
  id: string
  address_type: "billing" | "shipping"
  is_default: boolean
  customer_name: string
  customer_company?: string
  customer_address: string
  customer_address_line_2?: string
  customer_city: string
  customer_state?: string
  customer_zip: string
  customer_country: string
  customer_phone?: string
  customer_landmark?: string
  created_at: string
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState({
    addressType: "shipping" as "billing" | "shipping",
    isDefault: false,
    customerName: "",
    customerCompany: "",
    customerAddress: "",
    customerAddressLine2: "",
    customerCity: "",
    customerState: "",
    customerZip: "",
    customerCountry: "Pakistan",
    customerPhone: "",
    customerLandmark: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/api/account/addresses")
      if (response.status === 401) {
        router.push("/auth/login")
        return
      }
      const data = await response.json()
      if (response.ok) {
        setAddresses(data.addresses)
      }
    } catch (error) {
      console.error("Error fetching addresses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const url = editingAddress ? `/api/account/addresses/${editingAddress.id}` : "/api/account/addresses"
      const method = editingAddress ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchAddresses()
        setIsDialogOpen(false)
        resetForm()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to save address")
      }
    } catch (error) {
      console.error("Error saving address:", error)
      alert("Failed to save address")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setFormData({
      addressType: address.address_type,
      isDefault: address.is_default,
      customerName: address.customer_name,
      customerCompany: address.customer_company || "",
      customerAddress: address.customer_address,
      customerAddressLine2: address.customer_address_line_2 || "",
      customerCity: address.customer_city,
      customerState: address.customer_state || "",
      customerZip: address.customer_zip,
      customerCountry: address.customer_country,
      customerPhone: address.customer_phone || "",
      customerLandmark: address.customer_landmark || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (id.includes("default")) {
      alert("Cannot delete address from orders. You can edit it to create a new version.")
      return
    }

    if (!confirm("Are you sure you want to delete this address?")) return

    try {
      const response = await fetch(`/api/account/addresses/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchAddresses()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to delete address")
      }
    } catch (error) {
      console.error("Error deleting address:", error)
      alert("Failed to delete address")
    }
  }

  const resetForm = () => {
    setEditingAddress(null)
    setFormData({
      addressType: "shipping",
      isDefault: false,
      customerName: "",
      customerCompany: "",
      customerAddress: "",
      customerAddressLine2: "",
      customerCity: "",
      customerState: "",
      customerZip: "",
      customerCountry: "Pakistan",
      customerPhone: "",
      customerLandmark: "",
    })
  }

  const breadcrumbItems = [{ label: "Account", href: "/account" }, { label: "Addresses" }]

  const billingAddresses = addresses.filter((addr) => addr.address_type === "billing")
  const shippingAddresses = addresses.filter((addr) => addr.address_type === "shipping")

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading addresses...</p>
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

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Addresses</h1>
            <p className="text-gray-600">Manage your billing and shipping addresses</p>
          </div>

          {/* Billing Addresses */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Building className="w-5 h-5" />
                Billing Addresses
              </h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetForm()
                      setFormData((prev) => ({ ...prev, addressType: "billing" }))
                    }}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Billing Address
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {billingAddresses.map((address) => (
                <AddressCard key={address.id} address={address} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
              {billingAddresses.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">No billing addresses found</div>
              )}
            </div>
          </div>

          {/* Shipping Addresses */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Home className="w-5 h-5" />
                Shipping Addresses
              </h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetForm()
                      setFormData((prev) => ({ ...prev, addressType: "shipping" }))
                    }}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Shipping Address
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shippingAddresses.map((address) => (
                <AddressCard key={address.id} address={address} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
              {shippingAddresses.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">No shipping addresses found</div>
              )}
            </div>
          </div>

          {/* Address Form Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="addressType">Address Type</Label>
                    <Select
                      value={formData.addressType}
                      onValueChange={(value: "billing" | "shipping") =>
                        setFormData((prev) => ({ ...prev, addressType: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="shipping">Shipping</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 pt-6">
                    <Checkbox
                      id="isDefault"
                      checked={formData.isDefault}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isDefault: !!checked }))}
                    />
                    <Label htmlFor="isDefault">Set as default</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="customerName">Full Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customerName: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="customerCompany">Company (Optional)</Label>
                  <Input
                    id="customerCompany"
                    value={formData.customerCompany}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customerCompany: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="customerAddress">Address *</Label>
                  <Input
                    id="customerAddress"
                    value={formData.customerAddress}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customerAddress: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="customerAddressLine2">Address Line 2 (Optional)</Label>
                  <Input
                    id="customerAddressLine2"
                    value={formData.customerAddressLine2}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customerAddressLine2: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerCity">City *</Label>
                    <Input
                      id="customerCity"
                      value={formData.customerCity}
                      onChange={(e) => setFormData((prev) => ({ ...prev, customerCity: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerState">State</Label>
                    <Input
                      id="customerState"
                      value={formData.customerState}
                      onChange={(e) => setFormData((prev) => ({ ...prev, customerState: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerZip">ZIP Code *</Label>
                    <Input
                      id="customerZip"
                      value={formData.customerZip}
                      onChange={(e) => setFormData((prev) => ({ ...prev, customerZip: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerCountry">Country</Label>
                    <Input
                      id="customerCountry"
                      value={formData.customerCountry}
                      onChange={(e) => setFormData((prev) => ({ ...prev, customerCountry: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="customerPhone">Phone</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customerPhone: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="customerLandmark">Landmark</Label>
                  <Input
                    id="customerLandmark"
                    value={formData.customerLandmark}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customerLandmark: e.target.value }))}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    {submitting ? "Saving..." : editingAddress ? "Update Address" : "Add Address"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

function AddressCard({
  address,
  onEdit,
  onDelete,
}: {
  address: Address
  onEdit: (address: Address) => void
  onDelete: (id: string) => void
}) {
  const isFromOrder = address.id.includes("default")

  return (
    <Card className="bg-white shadow-lg border-0 rounded-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              {address.address_type === "billing" ? (
                <Building className="w-5 h-5 text-white" />
              ) : (
                <Home className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 capitalize">
                {address.address_type} Address
              </CardTitle>
              <div className="flex gap-2 mt-1">
                {address.is_default && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Default</span>
                )}
                {isFromOrder && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">From Order</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => onEdit(address)} variant="outline" size="sm" className="rounded-lg">
              <Edit className="w-4 h-4" />
            </Button>
            {!isFromOrder && (
              <Button
                onClick={() => onDelete(address.id)}
                variant="outline"
                size="sm"
                className="rounded-lg text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 text-sm">
          <p className="font-medium text-gray-900">{address.customer_name}</p>
          {address.customer_company && <p className="text-gray-600">{address.customer_company}</p>}
          <p className="text-gray-600">{address.customer_address}</p>
          {address.customer_address_line_2 && <p className="text-gray-600">{address.customer_address_line_2}</p>}
          <p className="text-gray-600">
            {address.customer_city}
            {address.customer_state && `, ${address.customer_state}`} {address.customer_zip}
          </p>
          <p className="text-gray-600">{address.customer_country}</p>
          {address.customer_phone && <p className="text-gray-600">{address.customer_phone}</p>}
          {address.customer_landmark && (
            <p className="text-gray-600 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {address.customer_landmark}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
