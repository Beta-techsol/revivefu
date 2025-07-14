"use client"

import { useState } from "react"
import { Search, Filter, Eye, Download, ChevronDown, CreditCard, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function AdminTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")

  const transactions = [
    {
      id: "TXN-001",
      orderId: "#3210",
      customer: "John Doe",
      amount: 250.0,
      fee: 7.5,
      net: 242.5,
      method: "Credit Card",
      status: "Completed",
      date: "2024-01-15 10:30 AM",
      gateway: "Stripe",
      reference: "pi_1234567890",
    },
    {
      id: "TXN-002",
      orderId: "#3209",
      customer: "Jane Smith",
      amount: 180.5,
      fee: 5.42,
      net: 175.08,
      method: "PayPal",
      status: "Completed",
      date: "2024-01-15 09:15 AM",
      gateway: "PayPal",
      reference: "PAYID-1234567890",
    },
    {
      id: "TXN-003",
      orderId: "#3208",
      customer: "Bob Johnson",
      amount: 320.75,
      fee: 9.62,
      net: 311.13,
      method: "Credit Card",
      status: "Pending",
      date: "2024-01-14 03:45 PM",
      gateway: "Stripe",
      reference: "pi_0987654321",
    },
    {
      id: "TXN-004",
      orderId: "#3207",
      customer: "Alice Brown",
      amount: 95.25,
      fee: 2.86,
      net: 92.39,
      method: "Bank Transfer",
      status: "Failed",
      date: "2024-01-14 11:20 AM",
      gateway: "Bank",
      reference: "BT-1234567890",
    },
    {
      id: "TXN-005",
      orderId: "#3206",
      customer: "Charlie Wilson",
      amount: 450.0,
      fee: 13.5,
      net: 436.5,
      method: "Credit Card",
      status: "Refunded",
      date: "2024-01-13 02:10 PM",
      gateway: "Stripe",
      reference: "pi_1122334455",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Failed":
        return "bg-red-100 text-red-800"
      case "Refunded":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "Credit Card":
        return <CreditCard className="w-4 h-4" />
      case "PayPal":
        return <DollarSign className="w-4 h-4" />
      case "Bank Transfer":
        return <DollarSign className="w-4 h-4" />
      default:
        return <DollarSign className="w-4 h-4" />
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || transaction.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesPayment = paymentFilter === "all" || transaction.method.toLowerCase() === paymentFilter.toLowerCase()
    return matchesSearch && matchesStatus && matchesPayment
  })

  const totalRevenue = transactions.filter((t) => t.status === "Completed").reduce((sum, t) => sum + t.amount, 0)
  const totalFees = transactions.filter((t) => t.status === "Completed").reduce((sum, t) => sum + t.fee, 0)
  const netRevenue = totalRevenue - totalFees

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-montserrat">Transaction Analytics</h1>
          <p className="text-gray-600 font-poppins">Monitor payments and financial transactions</p>
        </div>
        <Button className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 font-poppins">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 font-montserrat">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-600 font-poppins">From completed transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 font-poppins">Processing Fees</CardTitle>
            <CreditCard className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 font-montserrat">${totalFees.toFixed(2)}</div>
            <p className="text-xs text-gray-600 font-poppins">Gateway processing fees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 font-poppins">Net Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 font-montserrat">${netRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-600 font-poppins">After processing fees</p>
          </CardContent>
        </Card>
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
                  placeholder="Search transactions..."
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
                  <DropdownMenuItem onClick={() => setStatusFilter("completed")}>Completed</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("failed")}>Failed</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("refunded")}>Refunded</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                    <CreditCard className="w-4 h-4" />
                    <span>Method: {paymentFilter === "all" ? "All" : paymentFilter}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setPaymentFilter("all")}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPaymentFilter("credit card")}>Credit Card</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPaymentFilter("paypal")}>PayPal</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPaymentFilter("bank transfer")}>Bank Transfer</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-montserrat">Transactions ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Transaction ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Order</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Method</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 font-poppins">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900 font-poppins">{transaction.id}</td>
                    <td className="py-3 px-4 text-blue-600 font-poppins hover:underline cursor-pointer">
                      {transaction.orderId}
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-poppins">{transaction.customer}</td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-semibold text-gray-900 font-poppins">${transaction.amount.toFixed(2)}</div>
                        <div className="text-xs text-gray-500 font-poppins">
                          Fee: ${transaction.fee.toFixed(2)} | Net: ${transaction.net.toFixed(2)}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getMethodIcon(transaction.method)}
                        <span className="text-gray-700 font-poppins">{transaction.method}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-poppins">{transaction.date}</td>
                    <td className="py-3 px-4">
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
                            <DialogTitle className="font-montserrat">Transaction Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-700 font-poppins">Transaction ID</label>
                                <p className="text-gray-900 font-poppins">{transaction.id}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700 font-poppins">Order ID</label>
                                <p className="text-blue-600 font-poppins">{transaction.orderId}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700 font-poppins">Customer</label>
                                <p className="text-gray-900 font-poppins">{transaction.customer}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700 font-poppins">Payment Method</label>
                                <p className="text-gray-900 font-poppins">{transaction.method}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700 font-poppins">Amount</label>
                                <p className="text-gray-900 font-poppins">${transaction.amount.toFixed(2)}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700 font-poppins">Processing Fee</label>
                                <p className="text-gray-900 font-poppins">${transaction.fee.toFixed(2)}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700 font-poppins">Net Amount</label>
                                <p className="text-gray-900 font-poppins">${transaction.net.toFixed(2)}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700 font-poppins">Status</label>
                                <span
                                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
                                >
                                  {transaction.status}
                                </span>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700 font-poppins">Gateway</label>
                                <p className="text-gray-900 font-poppins">{transaction.gateway}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700 font-poppins">Reference</label>
                                <p className="text-gray-900 font-poppins font-mono text-sm">{transaction.reference}</p>
                              </div>
                              <div className="col-span-2">
                                <label className="text-sm font-medium text-gray-700 font-poppins">Date & Time</label>
                                <p className="text-gray-900 font-poppins">{transaction.date}</p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
