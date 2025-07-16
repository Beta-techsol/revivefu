"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Search, Filter, Eye, Download, ChevronDown, CreditCard, DollarSign, RefreshCw, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
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
  orderStatus: string
  date: string
  gateway: string
  reference: string
  rawId: string
}

export default function AdminTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const { toast } = useToast()

  const fetchTransactions = useCallback(
    async (showRefreshIndicator = false) => {
      try {
        if (showRefreshIndicator) {
          setRefreshing(true)
        } else {
          setLoading(true)
        }

        console.log("Fetching transactions with cache-busting...")

        const timestamp = new Date().getTime()
        const params = new URLSearchParams({
          _t: timestamp.toString(),
        })

        if (searchTerm.trim()) {
          params.append("search", searchTerm.trim())
        }

        if (statusFilter !== "all") {
          params.append("status", statusFilter)
        }

        if (paymentFilter !== "all") {
          params.append("payment", paymentFilter)
        }

        const response = await fetch(`/api/admin/transactions?${params.toString()}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Transactions API response:", data)

        if (data.success && data.data && data.data.transactions) {
          setTransactions(data.data.transactions)
          console.log(`Set ${data.data.transactions.length} transactions in state`)
        } else {
          console.error("Invalid API response:", data)
          toast({
            title: "Error",
            description: data.error || "Failed to fetch transactions",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching transactions:", error)
        toast({
          title: "Error",
          description: "Failed to fetch transactions",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [searchTerm, statusFilter, paymentFilter, toast],
  )

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const handleRefresh = () => {
    fetchTransactions(true)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "unpaid":
        return "bg-red-100 text-red-800"
      case "refunded":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "credit card":
      case "debit card":
        return <CreditCard className="w-4 h-4" />
      case "cash on delivery":
      case "cash_on_delivery":
        return <DollarSign className="w-4 h-4" />
      case "bank transfer":
        return <DollarSign className="w-4 h-4" />
      default:
        return <DollarSign className="w-4 h-4" />
    }
  }

  const handleUpdatePayment = async (transactionData: any) => {
    try {
      console.log("Updating payment info:", transactionData)

      const response = await fetch(`/api/admin/transactions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
        body: JSON.stringify({
          orderId: transactionData.rawId,
          payment_method: transactionData.payment_method,
          payment_status: transactionData.payment_status,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        await fetchTransactions(true)
        setShowEditModal(false)
        setEditingTransaction(null)

        toast({
          title: "Payment Updated",
          description: result.message || "Payment information has been updated successfully",
        })
      } else {
        console.error("Update failed:", result)
        toast({
          title: "Error",
          description: result.error || "Failed to update payment information",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Update exception:", error)
      toast({
        title: "Error",
        description: "Failed to update payment information",
        variant: "destructive",
      })
    }
  }

  const totalRevenue = transactions
    .filter((t) => t.status.toLowerCase() === "paid")
    .reduce((sum, t) => sum + t.amount, 0)
  const totalFees = transactions.filter((t) => t.status.toLowerCase() === "paid").reduce((sum, t) => sum + t.fee, 0)
  const netRevenue = totalRevenue - totalFees

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#C53D39] border-t-transparent rounded-full animate-spin"></div>
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
          <p className="text-gray-600 font-poppins">
            Monitor payments and financial transactions ({transactions.length} transactions)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={refreshing}
            className="flex items-center space-x-2 bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
          <Button className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 font-poppins">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 font-montserrat">₨{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-600 font-poppins">From paid transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 font-poppins">Processing Fees</CardTitle>
            <CreditCard className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 font-montserrat">₨{totalFees.toLocaleString()}</div>
            <p className="text-xs text-gray-600 font-poppins">Delivery charges</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 font-poppins">Net Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 font-montserrat">₨{netRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-600 font-poppins">After delivery charges</p>
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
                  <DropdownMenuItem onClick={() => setStatusFilter("paid")}>Paid</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("unpaid")}>Unpaid</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
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
                  <DropdownMenuItem onClick={() => setPaymentFilter("cash_on_delivery")}>
                    Cash on Delivery
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPaymentFilter("bank_transfer")}>Bank Transfer</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPaymentFilter("credit_card")}>Credit Card</DropdownMenuItem>
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
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-gray-700 font-poppins">{transaction.customer}</div>
                        <div className="text-sm text-gray-500 font-poppins">{transaction.customerEmail}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-semibold text-gray-900 font-poppins">
                          ₨{transaction.amount.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 font-poppins">
                          Fee: ₨{transaction.fee.toLocaleString()} | Net: ₨{transaction.net.toLocaleString()}
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
                        {transaction.status.toUpperCase()}
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
                                  <label className="text-sm font-medium text-gray-700 font-poppins">Email</label>
                                  <p className="text-gray-900 font-poppins">{transaction.customerEmail}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700 font-poppins">
                                    Payment Method
                                  </label>
                                  <p className="text-gray-900 font-poppins">{transaction.method}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700 font-poppins">Amount</label>
                                  <p className="text-gray-900 font-poppins">₨{transaction.amount.toLocaleString()}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700 font-poppins">
                                    Processing Fee
                                  </label>
                                  <p className="text-gray-900 font-poppins">₨{transaction.fee.toLocaleString()}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700 font-poppins">Net Amount</label>
                                  <p className="text-gray-900 font-poppins">₨{transaction.net.toLocaleString()}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700 font-poppins">Status</label>
                                  <span
                                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
                                  >
                                    {transaction.status.toUpperCase()}
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
                          onClick={() => {
                            setEditingTransaction(transaction)
                            setShowEditModal(true)
                          }}
                          variant="outline"
                          size="sm"
                          className="hover:bg-green-50 hover:border-green-300 hover:text-green-600 bg-transparent"
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

          {transactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No transactions found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Payment Modal */}
      {showEditModal && editingTransaction && (
        <EditPaymentModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setEditingTransaction(null)
          }}
          transaction={editingTransaction}
          onSave={handleUpdatePayment}
        />
      )}
    </div>
  )
}

// Edit Payment Modal Component
function EditPaymentModal({
  isOpen,
  onClose,
  transaction,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction
  onSave: (data: any) => void
}) {
  const [formData, setFormData] = useState({
    payment_method: transaction.method || "cash_on_delivery",
    payment_status: transaction.status || "unpaid",
    rawId: transaction.rawId,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting payment update with data:", formData)
    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Update Payment - {transaction.orderId}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="payment_method">Payment Method</Label>
            <Select
              value={formData.payment_method}
              onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash_on_delivery">Cash on Delivery</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="debit_card">Debit Card</SelectItem>
                <SelectItem value="mobile_payment">Mobile Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="payment_status">Payment Status</Label>
            <Select
              value={formData.payment_status}
              onValueChange={(value) => setFormData({ ...formData, payment_status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
            >
              Update Payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
