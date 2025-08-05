"use client"

import Link from "next/link"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/hooks/use-cart"
import { useState } from "react"
import { Truck, CreditCard, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    landmark: "",
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.zipCode.trim()) newErrors.zipCode = "Zip code is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      })
      return
    }

    if (items.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Your cart is empty. Please add items before checkout.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const deliveryCharge = total > 100000 ? 0 : 2000
      const finalTotal = total + deliveryCharge

      const orderData = {
        customer_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        customer_email: formData.email.trim(),
        customer_phone: formData.phone.trim(),
        customer_address: formData.address.trim(),
        customer_city: formData.city.trim(),
        customer_zip: formData.zipCode.trim(),
        customer_landmark: formData.landmark.trim(),
        special_instructions: formData.notes.trim(),
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          sku: item.sku || "",
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: total,
        delivery_charge: deliveryCharge,
        total_amount: finalTotal,
      }

      console.log("Submitting order:", orderData)

      const response = await fetch("/api/admin/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()
      console.log("Order response:", result)

      if (result.success) {
        setOrderNumber(result.data.order_number)
        setOrderPlaced(true)
        clearCart()
        toast({
          title: "Order Placed Successfully!",
          description: `Your order ${result.data.order_number} has been placed.`,
        })
      } else {
        throw new Error(result.error || "Failed to create order")
      }
    } catch (error) {
      console.error("Order creation failed:", error)
      toast({
        title: "Order Failed",
        description: error instanceof Error ? error.message : "Failed to place order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some furniture to your cart before proceeding to checkout.</p>
          <Button asChild size="lg">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-12">
              <div className="space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl font-bold text-gray-900">Order Placed Successfully!</h1>
                  <p className="text-xl text-gray-600">Thank you for choosing Revive Furniture</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-green-200">
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Order Number: <span className="text-green-600 font-mono">{orderNumber}</span>
                  </p>
                  <p className="text-gray-600">
                    Your furniture will be delivered within 3-7 business days. You'll pay cash on delivery.
                  </p>
                </div>

                <div className="flex items-center justify-center space-x-2 text-orange-600">
                  <CreditCard className="h-5 w-5" />
                  <span className="font-medium">Cash on Delivery - No advance payment required</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href={`/track-order?order=${orderNumber}`}>Track Order</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const deliveryCharge = total > 100000 ? 0 : 2000 // Free delivery over PKR 100,000
  const finalTotal = total + deliveryCharge

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your furniture order with Cash on Delivery</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-orange-500" />
              <span>Delivery Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`mt-1 ${errors.firstName ? "border-red-500" : ""}`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={`mt-1 ${errors.lastName ? "border-red-500" : ""}`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`mt-1 ${errors.phone ? "border-red-500" : ""}`}
                  placeholder="+92 300 1234567"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="address">Complete Address *</Label>
                <Textarea
                  id="address"
                  placeholder="House/Flat No, Street, Area"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`mt-1 ${errors.address ? "border-red-500" : ""}`}
                  rows={3}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`mt-1 ${errors.city ? "border-red-500" : ""}`}
                    placeholder="Karachi, Lahore, etc."
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
                <div>
                  <Label htmlFor="zipCode">Zip Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className={`mt-1 ${errors.zipCode ? "border-red-500" : ""}`}
                    placeholder="75500"
                  />
                  {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="landmark">Landmark (Optional)</Label>
                <Input
                  id="landmark"
                  placeholder="Near hospital, school, etc."
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="notes">Special Instructions (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special delivery instructions..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>

              {/* Payment Method Display */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border border-orange-200">
                <div className="flex items-center space-x-3 mb-3">
                  <CreditCard className="h-6 w-6 text-orange-600" />
                  <div>
                    <h3 className="font-semibold text-orange-800">Payment Method</h3>
                    <p className="text-orange-600 font-medium">Cash on Delivery (COD)</p>
                  </div>
                </div>
                <p className="text-sm text-orange-700">
                  Pay ₨{finalTotal.toLocaleString()} in cash when your furniture is delivered to your doorstep. No
                  advance payment required!
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing Order...</span>
                  </div>
                ) : (
                  `Place Order - ₨${finalTotal.toLocaleString()} (COD)`
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="sticky top-8">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex-1">
                    <span className="font-medium text-sm">{item.name}</span>
                    <span className="text-gray-500 text-sm ml-2">x {item.quantity}</span>
                  </div>
                  <span className="font-medium">₨{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₨{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Charge:</span>
                <span className="font-medium">
                  {deliveryCharge === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `₨${deliveryCharge.toLocaleString()}`
                  )}
                </span>
              </div>
              {deliveryCharge === 0 && (
                <p className="text-sm text-green-600 bg-green-50 p-2 rounded">
                  🎉 Free delivery on orders over ₨100,000!
                </p>
              )}
              <div className="flex justify-between items-center text-lg font-bold border-t pt-3">
                <span>Total (COD):</span>
                <span className="text-2xl bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  ₨{finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> You will pay ₨{finalTotal.toLocaleString()} in cash when your furniture is
                delivered. Our delivery team will contact you before arrival.
              </p>
            </div>

            <div className="text-center text-sm text-gray-500 space-y-1">
              <p>🚚 Estimated delivery: 3-7 business days</p>
              <p>📞 We'll call you before delivery</p>
              <p>💰 Pay cash on delivery</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
