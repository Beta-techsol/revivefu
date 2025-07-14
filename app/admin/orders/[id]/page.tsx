"use client"

import { useState } from "react"
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [orderStatus, setOrderStatus] = useState("Processing")

  // Mock order data
  const order = {
    id: params.id,
    customer: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
    },
    shippingAddress: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
    },
    billingAddress: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
    },
    items: [
      {
        id: "1",
        name: "Modern Sectional Sofa",
        price: 1299.99,
        quantity: 1,
        image: "/shop/products/sofa-1.jpg",
        sku: "SOF-001",
      },
      {
        id: "2",
        name: "Coffee Table",
        price: 299.99,
        quantity: 2,
        image: "/shop/products/coffee-table-1.jpg",
        sku: "TBL-002",
      },
    ],
    subtotal: 1899.97,
    shipping: 99.99,
    tax: 152.0,
    total: 2051.96,
    paymentMethod: "Credit Card (**** 4242)",
    orderDate: "2024-01-15",
    status: "Processing",
    trackingNumber: "TRK123456789",
    notes: "Customer requested white glove delivery",
  }

  const statusOptions = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Processing":
        return "bg-blue-100 text-blue-800"
      case "Shipped":
        return "bg-purple-100 text-purple-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="w-4 h-4" />
      case "Processing":
        return <Package className="w-4 h-4" />
      case "Shipped":
        return <Truck className="w-4 h-4" />
      case "Pending":
        return <Clock className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const handleStatusUpdate = (newStatus: string) => {
    setOrderStatus(newStatus)
    toast({
      title: "Order Status Updated",
      description: `Order ${order.id} status changed to ${newStatus}`,
      variant: "success",
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild className="bg-transparent">
            <Link href="/admin/orders">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-montserrat">Order {order.id}</h1>
            <p className="text-gray-600 font-poppins">Placed on {order.orderDate}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white">
                {getStatusIcon(orderStatus)}
                <span className="ml-2">Update Status</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {statusOptions.map((status) => (
                <DropdownMenuItem key={status} onClick={() => handleStatusUpdate(status)}>
                  {getStatusIcon(status)}
                  <span className="ml-2">{status}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 font-poppins">{item.name}</h3>
                      <p className="text-sm text-gray-600 font-poppins">SKU: {item.sku}</p>
                      <p className="text-sm text-gray-600 font-poppins">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 font-poppins">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600 font-poppins">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 font-poppins">Order Placed</p>
                    <p className="text-sm text-gray-600 font-poppins">January 15, 2024 at 2:30 PM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 font-poppins">Order Processing</p>
                    <p className="text-sm text-gray-600 font-poppins">January 15, 2024 at 4:15 PM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Truck className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-400 font-poppins">Shipped</p>
                    <p className="text-sm text-gray-400 font-poppins">Pending</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Customer Info */}
        <div className="space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-poppins">Current Status:</span>
                  <Badge className={getStatusColor(orderStatus)}>
                    {getStatusIcon(orderStatus)}
                    <span className="ml-1">{orderStatus}</span>
                  </Badge>
                </div>
                {order.trackingNumber && (
                  <div className="flex items-center justify-between">
                    <span className="font-poppins">Tracking:</span>
                    <span className="font-mono text-sm font-poppins">{order.trackingNumber}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="font-poppins">{order.customer.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="font-poppins">{order.customer.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="font-poppins">{order.customer.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <div className="font-poppins text-sm">
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <span className="font-poppins">{order.paymentMethod}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between font-poppins">
                  <span>Subtotal:</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-poppins">
                  <span>Shipping:</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-poppins">
                  <span>Tax:</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg font-poppins">
                    <span>Total:</span>
                    <span className="text-[#C53D39]">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat">Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 font-poppins">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
