import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching analytics data...")

    // Get monthly sales data for the last 7 months
    const salesData = await sql`
      SELECT 
        TO_CHAR(created_at, 'Mon') as name,
        COALESCE(SUM(total_amount), 0) as sales,
        COUNT(*) as orders
      FROM orders 
      WHERE created_at >= NOW() - INTERVAL '7 months'
      AND payment_status = 'paid'
      GROUP BY DATE_TRUNC('month', created_at), TO_CHAR(created_at, 'Mon')
      ORDER BY DATE_TRUNC('month', created_at)
    `

    // Get category distribution from order items
    const categoryData = await sql`
      SELECT 
        COALESCE(p.category, 'Other') as name,
        COUNT(oi.id) as value
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.payment_status = 'paid'
      GROUP BY p.category
      ORDER BY COUNT(oi.id) DESC
      LIMIT 4
    `

    // Get top selling products
    const topProducts = await sql`
      SELECT 
        COALESCE(p.name, oi.product_name) as name,
        SUM(oi.quantity) as sales,
        SUM(oi.price * oi.quantity) as revenue
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.payment_status = 'paid'
      GROUP BY p.name, oi.product_name
      ORDER BY SUM(oi.quantity) DESC
      LIMIT 5
    `

    // Get dashboard stats
    const statsResult = await sql`
      SELECT 
        COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END), 0) as total_revenue,
        COUNT(*) as total_orders,
        COUNT(DISTINCT customer_email) as total_customers
      FROM orders
    `

    const productsResult = await sql`
      SELECT COALESCE(SUM(oi.quantity), 0) as products_sold
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.payment_status = 'paid'
    `

    // Format the data
    const formattedSalesData = salesData.map((row) => ({
      name: row.name,
      sales: Number(row.sales),
      orders: Number(row.orders),
    }))

    const formattedCategoryData = categoryData.map((row, index) => {
      const colors = ["#C53D39", "#F1BA69", "#8B5CF6", "#10B981"]
      return {
        name: row.name,
        value: Number(row.value),
        color: colors[index % colors.length],
      }
    })

    const formattedTopProducts = topProducts.map((row) => ({
      name: row.name,
      sales: Number(row.sales),
      revenue: `₨${Number(row.revenue).toLocaleString()}`,
    }))

    const stats = [
      {
        title: "Total Revenue",
        value: `₨${Number(statsResult[0]?.total_revenue || 0).toLocaleString()}`,
        change: "+20.1%",
        trend: "up",
        icon: "DollarSign",
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        title: "Total Orders",
        value: Number(statsResult[0]?.total_orders || 0).toLocaleString(),
        change: "+15.3%",
        trend: "up",
        icon: "ShoppingCart",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        title: "Total Customers",
        value: Number(statsResult[0]?.total_customers || 0).toLocaleString(),
        change: "+12.4%",
        trend: "up",
        icon: "Users",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      },
      {
        title: "Products Sold",
        value: Number(productsResult[0]?.products_sold || 0).toLocaleString(),
        change: "+8.7%",
        trend: "up",
        icon: "Package",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      },
    ]

    const analyticsData = {
      salesData: formattedSalesData,
      categoryData: formattedCategoryData,
      topProducts: formattedTopProducts,
      stats,
    }

    console.log("Analytics data:", analyticsData)

    const response = NextResponse.json({
      success: true,
      data: analyticsData,
    })

    // Add cache control headers
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")

    return response
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch analytics data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
