"use client"

import { useState } from "react"
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface OrderDetailModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
}

export function OrderDetailModal({ isOpen, onClose, orderId }: OrderDetailModalProps) {
  const { toast } = useToast()
  const [orderStatus, setOrderStatus] = useState("Processing")

  // Mock order data
  const order = {
    id: orderId,
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
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-montserrat">Order Details - {order.id}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Items */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat text-lg">Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-white rounded-lg overflow-hidden">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 font-poppins text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-600 font-poppins">SKU: {item.sku}</p>
                        <p className="text-xs text-gray-600 font-poppins">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 font-poppins text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat text-lg">Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="font-poppins text-sm">{order.customer.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="font-poppins text-sm">{order.customer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="font-poppins text-sm">{order.customer.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Status */}
          <div className="space-y-4">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat text-lg">Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-poppins text-sm">Current Status:</span>
                    <Badge className={getStatusColor(orderStatus)}>
                      {getStatusIcon(orderStatus)}
                      <span className="ml-1">{orderStatus}</span>
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white">
                        Update Status
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      {statusOptions.map((status) => (
                        <DropdownMenuItem key={status} onClick={() => handleStatusUpdate(status)}>
                          {getStatusIcon(status)}
                          <span className="ml-2">{status}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat text-lg">Shipping Address</CardTitle>
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

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between font-poppins text-sm">
                    <span>Subtotal:</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-poppins text-sm">
                    <span>Shipping:</span>
                    <span>${order.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-poppins text-sm">
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
