"use client"

import { useState } from "react"
import { MapPin, Edit, Plus, Home, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BreadcrumbComponent } from "@/components/ui/breadcrumb"

export default function AddressesPage() {
  const [isEditing, setIsEditing] = useState({ billing: false, shipping: false })
  const [addresses, setAddresses] = useState({
    billing: {
      name: "Sarah Johnson",
      address: "123 Main Street",
      city: "Los Angeles",
      state: "CA",
      zip: "90210",
      country: "United States",
      phone: "+1 (555) 123-4567",
    },
    shipping: {
      name: "Sarah Johnson",
      address: "456 Oak Avenue",
      city: "Beverly Hills",
      state: "CA",
      zip: "90212",
      country: "United States",
      phone: "+1 (555) 123-4567",
    },
  })

  const handleEdit = (type: "billing" | "shipping") => {
    setIsEditing((prev) => ({ ...prev, [type]: !prev[type] }))
  }

  const handleSave = (type: "billing" | "shipping") => {
    setIsEditing((prev) => ({ ...prev, [type]: false }))
    // Save logic here
  }

  const breadcrumbItems = [{ label: "Account", href: "/account" }, { label: "Addresses" }]

  const AddressForm = ({
    type,
    address,
    isEditing,
  }: { type: "billing" | "shipping"; address: any; isEditing: boolean }) => (
    <Card className="bg-white shadow-lg border-0 rounded-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              {type === "billing" ? (
                <Building className="w-5 h-5 text-white" />
              ) : (
                <Home className="w-5 h-5 text-white" />
              )}
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900 capitalize">{type} Address</CardTitle>
          </div>
          <Button onClick={() => handleEdit(type)} variant="outline" size="sm" className="rounded-lg">
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`${type}-name`} className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <Input
                  id={`${type}-name`}
                  defaultValue={address.name}
                  className="mt-1 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>
              <div>
                <Label htmlFor={`${type}-phone`} className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id={`${type}-phone`}
                  defaultValue={address.phone}
                  className="mt-1 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`${type}-address`} className="text-sm font-medium text-gray-700">
                Street Address
              </Label>
              <Input
                id={`${type}-address`}
                defaultValue={address.address}
                className="mt-1 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor={`${type}-city`} className="text-sm font-medium text-gray-700">
                  City
                </Label>
                <Input
                  id={`${type}-city`}
                  defaultValue={address.city}
                  className="mt-1 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>
              <div>
                <Label htmlFor={`${type}-state`} className="text-sm font-medium text-gray-700">
                  State
                </Label>
                <Input
                  id={`${type}-state`}
                  defaultValue={address.state}
                  className="mt-1 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>
              <div>
                <Label htmlFor={`${type}-zip`} className="text-sm font-medium text-gray-700">
                  ZIP Code
                </Label>
                <Input
                  id={`${type}-zip`}
                  defaultValue={address.zip}
                  className="mt-1 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`${type}-country`} className="text-sm font-medium text-gray-700">
                Country
              </Label>
              <Input
                id={`${type}-country`}
                defaultValue={address.country}
                className="mt-1 h-12 rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400"
              />
            </div>

            <Button
              onClick={() => handleSave(type)}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-xl transition-all duration-300"
            >
              Save Address
            </Button>
          </form>
        ) : (
          <div className="space-y-2">
            <p className="font-medium text-gray-900">{address.name}</p>
            <p className="text-gray-600">{address.address}</p>
            <p className="text-gray-600">
              {address.city}, {address.state} {address.zip}
            </p>
            <p className="text-gray-600">{address.country}</p>
            <p className="text-gray-600">{address.phone}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <BreadcrumbComponent items={breadcrumbItems} />

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Addresses</h1>
            <p className="text-gray-600">Manage your billing and shipping addresses</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AddressForm type="billing" address={addresses.billing} isEditing={isEditing.billing} />
            <AddressForm type="shipping" address={addresses.shipping} isEditing={isEditing.shipping} />
          </div>

          {/* Add New Address */}
          <Card className="mt-8 bg-white shadow-lg border-0 rounded-xl">
            <CardContent className="p-8 text-center">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add New Address</h3>
              <p className="text-gray-600 mb-6">Add additional shipping or billing addresses</p>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Add Address
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
