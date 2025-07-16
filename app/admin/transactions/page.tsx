"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Eye, Download, ChevronDown, CreditCard, DollarSign, Edit, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface Transaction {
  id: string
  orderId: string
  customer: string
  customerEmail: string
  amount: number
  fee: number
  net: number
  method: string
  status: string
  date: string
  gateway: string
  reference: string
  originalOrderId: string
  originalStatus: string
}

export default function AdminTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const { toast } = useToast()

  // Fetch transactions data
  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (paymentFilter !== "all") params.append("payment", paymentFilter)

      const response = await fetch(`/api/admin/transactions?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setTransactions(data.data)
      } else {
        setError(data.error || "Failed to fetch transactions")
      }
    } catch (err) {
      setError("Failed to fetch transactions")
      console.error("Error fetching transactions:", err)
    } finally {
      setLoading(false)
    }
  }

  // Update payment details
  const updatePaymentDetails = async (transactionId: string, payment_method: string, payment_status: string) => {
    try {
      const response = await fetch(`/api/admin/transactions/${transactionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payment_method, payment_status }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Payment details updated successfully",
        })
        fetchTransactions() // Refresh the list
        setIsUpdateDialogOpen(false)
        setEditingTransaction(null)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update payment details",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update payment details",
        variant: "destructive",
      })
    }
  }

  // Fetch transactions on component mount and when filters change
  useEffect(() => {
    fetchTransactions()
  }, [searchTerm, statusFilter, paymentFilter])

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
      case "Cash on Delivery":
        return <DollarSign className="w-4 h-4" />
      case "Bank Transfer":
        return <DollarSign className="w-4 h-4" />
      default:
        return <DollarSign className="w-4 h-4" />
    }
  }

  const totalRevenue = transactions.filter((t) => t.status === "Completed").reduce((sum, t) => sum + t.amount, 0)
  const totalFees = transactions.filter((t) => t.status === "Completed").reduce((sum, t) => sum + t.fee, 0)
  const netRevenue = totalRevenue - totalFees

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
          <Button onClick={fetchTransactions}>Retry</Button>
        </div>
      </div>
    )
  }

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
                  <DropdownMenuItem onClick={() => setPaymentFilter("cash")}>Cash on Delivery</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPaymentFilter("card")}>Credit Card</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPaymentFilter("bank")}>Bank Transfer</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-montserrat">Transactions ({transactions.length})</CardTitle>
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
                {transactions.map((transaction) => (
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
                              <DialogTitle className="font-montserrat">Transaction Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-700 font-poppins">
                                    Transaction ID
                                  </label>
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
                                  <label className="text-sm font-medium text-gray-700 font-poppins">
                                    Payment Method
                                  </label>
                                  <p className="text-gray-900 font-poppins">{transaction.method}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700 font-poppins">Amount</label>
                                  <p className="text-gray-900 font-poppins">${transaction.amount.toFixed(2)}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700 font-poppins">
                                    Processing Fee
                                  </label>
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
                                  <p className="text-gray-900 font-poppins font-mono text-sm">
                                    {transaction.reference}
                                  </p>
                                </div>
                                <div className="col-span-2">
                                  <label className="text-sm font-medium text-gray-700 font-poppins">Date & Time</label>
                                  <p className="text-gray-900 font-poppins">{transaction.date}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingTransaction(transaction)
                            setIsUpdateDialogOpen(true)
                          }}
                          className="hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 bg-transparent"
                        >
                          <Edit className="w-4 h-4" />
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

      {/* Update Payment Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-montserrat">Update Payment Details</DialogTitle>
          </DialogHeader>
          {editingTransaction && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 font-poppins">Transaction ID</label>
                <p className="text-gray-900 font-poppins">{editingTransaction.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 font-poppins">Order ID</label>
                <p className="text-blue-600 font-poppins">{editingTransaction.orderId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 font-poppins">Payment Method</label>
                <Select
                  defaultValue={editingTransaction.method.toLowerCase().replace(" ", "_")}
                  onValueChange={(value) => {
                    setEditingTransaction({
                      ...editingTransaction,
                      method:
                        value === "cash_on_delivery"
                          ? "Cash on Delivery"
                          : value === "bank_transfer"
                            ? "Bank Transfer"
                            : "Credit Card",
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash_on_delivery">Cash on Delivery</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="card">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 font-poppins">Payment Status</label>
                <Select
                  defaultValue={editingTransaction.status.toLowerCase()}
                  onValueChange={(value) => {
                    setEditingTransaction({
                      ...editingTransaction,
                      status: value.charAt(0).toUpperCase() + value.slice(1),
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsUpdateDialogOpen(false)
                    setEditingTransaction(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (editingTransaction) {
                      updatePaymentDetails(
                        editingTransaction.id,
                        editingTransaction.method.toLowerCase().replace(" ", "_"),
                        editingTransaction.status.toLowerCase(),
                      )
                    }
                  }}
                  className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
                >
                  Update
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
