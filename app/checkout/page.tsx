"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Mail,
  MessageCircle,
  Truck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BankAccountDetails } from "@/components/payment/bank-account-details"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import {
  FREE_DELIVERY_THRESHOLD,
  PAYMENT_METHOD_CODE,
  PAYMENT_METHOD_LABEL,
  PAYMENT_SHORT_LABEL,
  SUPPORT_CONTACT,
  calculateDeliveryCharge,
  calculatePaymentBreakdown,
} from "@/lib/payment-utils"

interface PlacedOrderSnapshot {
  orderNumber: string
  subtotal: number
  deliveryCharge: number
  totalAmount: number
  advanceAmount: number
  remainingAmount: number
  customerName: string
  customerEmail: string
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [placedOrder, setPlacedOrder] = useState<PlacedOrderSnapshot | null>(null)
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
      const deliveryCharge = calculateDeliveryCharge(total)
      const finalTotal = total + deliveryCharge
      const clientBreakdown = calculatePaymentBreakdown(finalTotal)

      const orderData = {
        customer_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        customer_email: formData.email.trim(),
        customer_phone: formData.phone.trim(),
        customer_address: formData.address.trim(),
        customer_city: formData.city.trim(),
        customer_zip: formData.zipCode.trim(),
        customer_landmark: formData.landmark.trim(),
        special_instructions: formData.notes.trim(),
        payment_method: PAYMENT_METHOD_CODE,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          sku: item.sku || "",
          image: item.image || "",
          color: item.color || "",
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: total,
        delivery_charge: deliveryCharge,
        total_amount: finalTotal,
      }

      const response = await fetch("/api/admin/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (result.success && result.data) {
        const serverTotal = Number(result.data.total_amount ?? finalTotal)
        const serverSubtotal = Number(result.data.subtotal ?? total)
        const serverDelivery = Number(result.data.delivery_charge ?? deliveryCharge)
        const serverBreakdown = calculatePaymentBreakdown(serverTotal)

        setPlacedOrder({
          orderNumber: result.data.order_number,
          subtotal: serverSubtotal,
          deliveryCharge: serverDelivery,
          totalAmount: serverTotal,
          advanceAmount: Number(result.data.advance_amount ?? clientBreakdown.advanceAmount ?? serverBreakdown.advanceAmount),
          remainingAmount: Number(result.data.remaining_amount ?? clientBreakdown.remainingAmount ?? serverBreakdown.remainingAmount),
          customerName: orderData.customer_name,
          customerEmail: orderData.customer_email,
        })
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

  if (orderPlaced && placedOrder) {
    const whatsappMessage = encodeURIComponent(
      `Assalam-o-Alaikum, I have placed order ${placedOrder.orderNumber} (Total: ₨${placedOrder.totalAmount.toLocaleString()}, 50% Advance: ₨${placedOrder.advanceAmount.toLocaleString()}). Here is my advance payment screenshot.`,
    )

    return (
      <div className="container mx-auto px-4 py-10 sm:py-14">
        <div className="max-w-3xl mx-auto">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-green-50 via-white to-orange-50">
            <CardContent className="p-6 sm:p-10 space-y-8">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Your Order Has Been Successfully Placed!
                </h1>
                <p className="text-lg text-gray-600">Thank you for choosing Revive Furniture</p>

                <div className="inline-block bg-white px-6 py-3 rounded-lg shadow-sm border border-green-200">
                  <p className="text-base sm:text-lg font-medium text-gray-900">
                    Order Number:{" "}
                    <span className="text-green-700 font-mono font-bold">{placedOrder.orderNumber}</span>
                  </p>
                </div>
              </div>

              {/* Dynamic Payment Breakdown */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Breakdown</h2>
                <div className="space-y-3 text-sm sm:text-base">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Total Order Amount</span>
                    <span className="font-bold text-gray-900">₨{placedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-orange-800 font-medium">Advance Payment (50%)</span>
                    <span className="font-bold text-orange-700">₨{placedOrder.advanceAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700 font-medium">Remaining Payment (50%) on Delivery</span>
                    <span className="font-bold text-gray-900">₨{placedOrder.remainingAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 sm:p-6 space-y-3 text-left">
                <h2 className="text-lg font-semibold text-amber-900">Payment Instructions</h2>
                <p className="text-sm sm:text-base text-amber-900 leading-relaxed">
                  To confirm your order, please transfer 50% of the total order amount (
                  <strong>₨{placedOrder.advanceAmount.toLocaleString()}</strong>) to the bank account below. After
                  making the payment, send the payment screenshot to us through WhatsApp or email for verification.
                </p>
                <p className="text-sm sm:text-base text-amber-900 leading-relaxed">
                  The remaining 50% (<strong>₨{placedOrder.remainingAmount.toLocaleString()}</strong>) will be collected
                  by our delivery team when your furniture is delivered.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Button asChild variant="outline" className="bg-white border-green-300 text-green-800 hover:bg-green-50">
                    <a
                      href={`${SUPPORT_CONTACT.whatsappHref}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Screenshot on WhatsApp ({SUPPORT_CONTACT.whatsappDisplay})
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="bg-white border-amber-300 text-amber-900 hover:bg-amber-100">
                    <a
                      href={`mailto:${SUPPORT_CONTACT.email}?subject=${encodeURIComponent(
                        `Advance Payment Screenshot - ${placedOrder.orderNumber}`,
                      )}`}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email Screenshot ({SUPPORT_CONTACT.email})
                    </a>
                  </Button>
                </div>
              </div>

              {/* Bank Account Details with Copy Buttons */}
              <BankAccountDetails title="Bank Account Details for 50% Advance Transfer" />

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Button asChild size="lg">
                  <Link href={`/track-order?order=${encodeURIComponent(placedOrder.orderNumber)}`}>Track Order</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const deliveryCharge = calculateDeliveryCharge(total)
  const finalTotal = total + deliveryCharge
  const { advanceAmount, remainingAmount } = calculatePaymentBreakdown(finalTotal)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600">{PAYMENT_SHORT_LABEL}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-orange-500" />
              <span>Delivery Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-5 sm:p-6 rounded-xl border border-orange-200 space-y-4">
                <div className="flex items-start space-x-3">
                  <CreditCard className="h-6 w-6 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-orange-900">Payment Method</h3>
                    <p className="text-orange-700 font-semibold">{PAYMENT_METHOD_LABEL}</p>
                  </div>
                </div>

                <p className="text-sm text-orange-800 leading-relaxed">
                  Pay 50% of your total order amount in advance through bank transfer to confirm your order. The
                  remaining 50% will be collected in cash when your furniture is delivered to your doorstep.
                </p>

                <div className="bg-white/90 rounded-lg border border-orange-200 p-4 space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Order Amount</span>
                    <span className="font-bold text-gray-900">₨{finalTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-800 font-medium">50% Advance Payment</span>
                    <span className="font-bold text-orange-700">₨{advanceAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">50% Remaining on Delivery</span>
                    <span className="font-bold text-gray-900">₨{remainingAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing Order...</span>
                  </div>
                ) : (
                  `Place Order - ₨${finalTotal.toLocaleString()} (50% Advance: ₨${advanceAmount.toLocaleString()})`
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6 lg:sticky lg:top-8">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex-1 pr-3">
                      <span className="font-medium text-sm text-gray-900">{item.name}</span>
                      <span className="text-gray-500 text-sm ml-2">x {item.quantity}</span>
                      {item.color && item.color !== "Default" && (
                        <p className="text-xs text-gray-500">Color: {item.color}</p>
                      )}
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
                    Free delivery on orders over ₨{FREE_DELIVERY_THRESHOLD.toLocaleString()}!
                  </p>
                )}

                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Order Amount:</span>
                    <span className="text-2xl bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                      ₨{finalTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-orange-800 font-medium">50% Advance Payment:</span>
                    <span className="font-bold text-orange-700">₨{advanceAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 font-medium">Remaining 50% on Delivery:</span>
                    <span className="font-bold text-gray-900">₨{remainingAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2">
                <h3 className="text-sm font-semibold text-amber-900">Payment Instructions:</h3>
                <p className="text-sm text-amber-900 leading-relaxed">
                  To confirm your order, please transfer 50% of the total order amount (
                  <strong>₨{advanceAmount.toLocaleString()}</strong>) to the bank account below. After making the
                  payment, send the payment screenshot to us through WhatsApp ({SUPPORT_CONTACT.whatsappDisplay}) or email (
                  {SUPPORT_CONTACT.email}).
                </p>
                <p className="text-sm text-amber-900 leading-relaxed">
                  The remaining 50% (<strong>₨{remainingAmount.toLocaleString()}</strong>) will be collected by our
                  delivery team when your furniture is delivered.
                </p>
              </div>

              {/* Bank Account Details with individual & copy-all buttons */}
              <BankAccountDetails />

              <div className="text-center text-sm text-gray-600 space-y-1.5 pt-1">
                <p className="font-medium text-gray-800">{PAYMENT_SHORT_LABEL}</p>
                <p>Estimated delivery: 3-7 business days</p>
                <p>We&apos;ll call you before delivery</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
