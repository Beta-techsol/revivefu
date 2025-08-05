"use client"

import { useParams } from "next/navigation"
import { CheckCircle, Download, RotateCcw, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BreadcrumbComponent } from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function OrderDetailsPage() {
  const params = useParams()

  // Mock order data - in real app, this would come from API
  const order = {
    id: params.id,
    date: "December 15, 2024",
    status: "Delivered",
    statusColor: "bg-green-100 text-green-600",
    total: 1299,
    subtotal: 1199,
    shipping: 50,
    tax: 50,
    items: [
      {
        id: "1",
        name: "Modern Sectional Sofa",
        image: "/shop/products/sofa-1.jpg",
        price: 899,
        quantity: 1,
        color: "Charcoal Gray",
        size: "Large",
      },
      {
        id: "2",
        name: "Coffee Table Set",
        image: "/shop/products/coffee-table-1.jpg",
        price: 300,
        quantity: 1,
        color: "Walnut",
        size: "Standard",
      },
    ],
    shippingAddress: {
      name: "Sarah Johnson",
      address: "123 Main Street",
      city: "Los Angeles",
      state: "CA",
      zip: "90210",
      country: "United States",
    },
    billingAddress: {
      name: "Sarah Johnson",
      address: "123 Main Street",
      city: "Los Angeles",
      state: "CA",
      zip: "90210",
      country: "United States",
    },
    paymentMethod: {
      type: "Credit Card",
      last4: "4242",
      brand: "Visa",
    },
    trackingSteps: [
      { title: "Order Placed", date: "Dec 15, 2024", completed: true },
      { title: "Processing", date: "Dec 16, 2024", completed: true },
      { title: "Shipped", date: "Dec 17, 2024", completed: true },
      { title: "Delivered", date: "Dec 19, 2024", completed: true },
    ],
  }

  const breadcrumbItems = [
    { label: "Account", href: "/account" },
    { label: "Orders", href: "/account/orders" },
    { label: `Order ${order.id}` },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <BreadcrumbComponent items={breadcrumbItems} />

        <div className="max-w-6xl mx-auto">
          {/* Order Header */}
          <Card className="bg-white shadow-lg border-0 rounded-xl mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Order {order.id}</CardTitle>
                  <p className="text-gray-600 mt-1">Placed on {order.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={`${order.statusColor} border-0 text-sm px-3 py-1`}>{order.status}</Badge>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">${order.total}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white shadow-lg border-0 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            Color: {item.color} • Size: {item.size}
                          </p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Status Tracker */}
              <Card className="bg-white shadow-lg border-0 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.trackingSteps.map((step, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.completed ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium ${step.completed ? "text-gray-900" : "text-gray-500"}`}>
                            {step.title}
                          </h4>
                          <p className="text-sm text-gray-500">{step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary & Actions */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card className="bg-white shadow-lg border-0 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${order.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">${order.shipping}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${order.tax}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="font-bold text-xl text-gray-900">${order.total}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="bg-white shadow-lg border-0 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reorder Items
                  </Button>
                  <Button variant="outline" className="w-full rounded-xl bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Download Invoice
                  </Button>
                  <Button variant="outline" className="w-full rounded-xl bg-transparent">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="bg-white shadow-lg border-0 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-600">
                    <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="bg-white shadow-lg border-0 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-600">
                    <p className="font-medium text-gray-900">
                      {order.paymentMethod.brand} ending in {order.paymentMethod.last4}
                    </p>
                    <p>{order.paymentMethod.type}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
