"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { Order } from "@/types"

const formSchema = z.object({
  customerName: z.string().min(2, {
    message: "Customer name must be at least 2 characters.",
  }),
  customerEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  shippingAddress: z.string().min(5, {
    message: "Shipping address must be at least 5 characters.",
  }),
  orderStatus: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
  totalAmount: z.number().min(0, {
    message: "Total amount must be a positive number.",
  }),
})

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    accessorKey: "customerEmail",
    header: "Customer Email",
  },
  {
    accessorKey: "shippingAddress",
    header: "Shipping Address",
  },
  {
    accessorKey: "orderStatus",
    header: "Order Status",
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original
      return (
        <div className="flex items-center gap-2">
          <EditOrderDialog order={order} />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the order with ID: {order.id} from our
                  servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    toast.success(`Order with ID: ${order.id} deleted successfully!`)
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    },
  },
]

const EditOrderDialog = ({ order }: { order: Order }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      shippingAddress: order.shippingAddress,
      orderStatus: order.orderStatus,
      totalAmount: order.totalAmount,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success(`Order with ID: ${order.id} updated successfully!`)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Edit</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="font-montserrat">Edit Order</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-1">
          <div className="space-y-6 pb-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input id="customerName" placeholder="John Doe" {...form.register("customerName")} />
                  {form.formState.errors.customerName && (
                    <p className="text-sm text-red-500">{form.formState.errors.customerName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input id="customerEmail" placeholder="john.doe@example.com" {...form.register("customerEmail")} />
                  {form.formState.errors.customerEmail && (
                    <p className="text-sm text-red-500">{form.formState.errors.customerEmail.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shippingAddress">Shipping Address</Label>
                <Input id="shippingAddress" placeholder="123 Main St" {...form.register("shippingAddress")} />
                {form.formState.errors.shippingAddress && (
                  <p className="text-sm text-red-500">{form.formState.errors.shippingAddress.message}</p>
                )}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orderStatus">Order Status</Label>
                  <Select
                    defaultValue={order.orderStatus}
                    onValueChange={(value) => form.setValue("orderStatus", value)}
                  >
                    <SelectTrigger id="orderStatus">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.orderStatus && (
                    <p className="text-sm text-red-500">{form.formState.errors.orderStatus.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalAmount">Total Amount</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    placeholder="100.00"
                    {...form.register("totalAmount", { valueAsNumber: true })}
                  />
                  {form.formState.errors.totalAmount && (
                    <p className="text-sm text-red-500">{form.formState.errors.totalAmount.message}</p>
                  )}
                </div>
              </div>
              <Button type="submit">Update Order</Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const OrdersTable = ({ data }: { data: Order[] }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <div className="min-w-full inline-block align-middle">
        <table className="w-full min-w-[800px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => {
              return (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </table>
      </div>
    </div>
  )
}

const mockOrders: Order[] = [
  {
    id: "1",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    shippingAddress: "123 Main St",
    orderStatus: "pending",
    totalAmount: 100.0,
  },
  {
    id: "2",
    customerName: "Jane Smith",
    customerEmail: "jane.smith@example.com",
    shippingAddress: "456 Oak Ave",
    orderStatus: "processing",
    totalAmount: 200.0,
  },
  {
    id: "3",
    customerName: "Robert Jones",
    customerEmail: "robert.jones@example.com",
    shippingAddress: "789 Pine Ln",
    orderStatus: "shipped",
    totalAmount: 150.0,
  },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    // Simulate fetching orders from an API
    setTimeout(() => {
      setOrders(mockOrders)
    }, 500)
  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4 font-montserrat">Orders</h1>
      {orders.length > 0 ? <OrdersTable data={orders} /> : <p>Loading orders...</p>}
    </div>
  )
}
