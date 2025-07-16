"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Eye, Edit, Trash2, ChevronDown, Plus, Mail, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  orders: number
  totalSpent: number
  pendingAmount: number
  status: string
  joinDate: string
  lastOrder: string
}

export default function AdminCustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch customers data
  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (statusFilter !== "all") params.append("status", statusFilter)

      const response = await fetch(`/api/admin/customers?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setCustomers(data.data)
      } else {
        setError(data.error || "Failed to fetch customers")
      }
    } catch (err) {
      setError("Failed to fetch customers")
      console.error("Error fetching customers:", err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch customers on component mount and when filters change
  useEffect(() => {
    fetchCustomers()
  }, [searchTerm, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "VIP":
        return "bg-purple-100 text-purple-800"
      case "New":
        return "bg-blue-100 text-blue-800"
      case "Inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDeleteCustomer = (customerId: string, customerName: string) => {
    toast({
      title: "Action Not Available",
      description: "Customer data is derived from orders and cannot be deleted directly.",
      variant: "destructive",
    })
  }

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId) ? prev.filter((id) => id !== customerId) : [...prev, customerId],
    )
  }

  const handleSelectAll = () => {
    setSelectedCustomers(selectedCustomers.length === customers.length ? [] : customers.map((customer) => customer.id))
  }

  const handleEmailSelected = () => {
    toast({
      title: "Email Feature",
      description: `Email functionality would be implemented to send emails to ${selectedCustomers.length} selected customers.`,
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchCustomers}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-montserrat">Customer Management</h1>
          <p className="text-gray-600 font-poppins">Manage your customer database</p>
        </div>
        <Button className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C53D39] focus:border-transparent font-poppins"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                    <Filter className="w-4 h-4" />
                    <span>Status: {statusFilter === "all" ? "All" : statusFilter}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("vip")}>VIP</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("new")}>New</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>Inactive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {selectedCustomers.length > 0 && (
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="bg-transparent" onClick={handleEmailSelected}>
                  <Mail className="w-4 h-4 mr-2" />
                  Email ({selectedCustomers.length})
                </Button>
                <Button variant="outline" className="text-red-600 hover:bg-red-50 hover:border-red-300 bg-transparent">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete ({selectedCustomers.length})
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-montserrat">Customers ({customers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      checked={customers.length > 0 && selectedCustomers.length === customers.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-[#C53D39] focus:ring-[#C53D39]"
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Contact</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Orders</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Total Spent</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Pending</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Join Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => handleSelectCustomer(customer.id)}
                        className="rounded border-gray-300 text-[#C53D39] focus:ring-[#C53D39]"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900 font-poppins">{customer.name}</div>
                        <div className="text-sm text-gray-500 font-poppins">{customer.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-gray-900 font-poppins">{customer.email}</div>
                        <div className="text-sm text-gray-500 font-poppins">{customer.phone}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900 font-poppins">{customer.orders}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900 font-poppins">
                      ${customer.totalSpent.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-orange-600 font-poppins">
                      ${customer.pendingAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-poppins">{customer.joinDate}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 bg-transparent"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="font-montserrat">Customer Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-700 font-poppins">Name</label>
                                  <p className="text-gray-900 font-poppins">{customer.name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700 font-poppins">Status</label>
                                  <span
                                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}
                                  >
                                    {customer.status}
                                  </span>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700 font-poppins">Email</label>
                                  <p className="text-gray-900 font-poppins">{customer.email}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700 font-poppins">Phone</label>
                                  <p className="text-gray-900 font-poppins">{customer.phone}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700 font-poppins">Total Orders</label>
                                  <p className="text-gray-900 font-poppins">{customer.orders}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700 font-poppins">Total Spent</label>
                                  <p className="text-gray-900 font-poppins">${customer.totalSpent.toFixed(2)}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700 font-poppins">
                                    Pending Amount
                                  </label>
                                  <p className="text-orange-600 font-poppins">${customer.pendingAmount.toFixed(2)}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700 font-poppins">Join Date</label>
                                  <p className="text-gray-900 font-poppins">{customer.joinDate}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700 font-poppins">Last Order</label>
                                  <p className="text-gray-900 font-poppins">{customer.lastOrder}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-green-50 hover:border-green-300 hover:text-green-600 bg-transparent"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                          className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 bg-transparent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
