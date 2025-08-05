import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching analytics data...")

    // Get monthly sales data for the last 7 months
    const salesDataQuery = `
      SELECT 
        TO_CHAR(created_at, 'Mon') as name,
        COALESCE(SUM(total_amount), 0) as sales,
        COUNT(*) as orders
      FROM orders 
      WHERE created_at >= NOW() - INTERVAL '7 months'
      GROUP BY DATE_TRUNC('month', created_at), TO_CHAR(created_at, 'Mon')
      ORDER BY DATE_TRUNC('month', created_at)
      LIMIT 7
    `

    // Get category distribution
    const categoryDataQuery = `
      SELECT 
        COALESCE(p.category, 'Uncategorized') as name,
        SUM(oi.quantity) as value
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      GROUP BY p.category
      ORDER BY value DESC
      LIMIT 4
    `

    // Get top products
    const topProductsQuery = `
      SELECT 
        oi.name,
        SUM(oi.quantity) as sales,
        SUM(oi.price * oi.quantity) as revenue
      FROM order_items oi
      GROUP BY oi.name
      ORDER BY sales DESC
      LIMIT 5
    `

    // Get stats
    const statsQuery = `
      SELECT 
        COALESCE(SUM(CASE WHEN status != 'cancelled' THEN total_amount ELSE 0 END), 0) as total_revenue,
        COUNT(*) as total_orders,
        COUNT(DISTINCT customer_email) as total_customers,
        COALESCE(SUM(
          (SELECT SUM(quantity) FROM order_items WHERE order_id = orders.id)
        ), 0) as total_products_sold
      FROM orders
    `

    const [salesData, categoryData, topProducts, stats] = await Promise.all([
      sql(salesDataQuery),
      sql(categoryDataQuery),
      sql(topProductsQuery),
      sql(statsQuery),
    ])

    console.log("Raw sales data:", salesData)
    console.log("Raw category data:", categoryData)
    console.log("Raw stats:", stats)

    // Process sales data
    const processedSalesData =
      salesData.length > 0
        ? salesData.map((row) => ({
            name: row.name,
            sales: Number(row.sales) || 0,
            orders: Number(row.orders) || 0,
          }))
        : [
            { name: "Jan", sales: 0, orders: 0 },
            { name: "Feb", sales: 0, orders: 0 },
            { name: "Mar", sales: 0, orders: 0 },
            { name: "Apr", sales: 0, orders: 0 },
            { name: "May", sales: 0, orders: 0 },
            { name: "Jun", sales: 0, orders: 0 },
            { name: "Jul", sales: 0, orders: 0 },
          ]

    // Process category data with colors
    const colors = ["#C53D39", "#F1BA69", "#8B5CF6", "#10B981"]
    const processedCategoryData =
      categoryData.length > 0
        ? categoryData.map((row, index) => ({
            name: row.name,
            value: Number(row.value) || 0,
            color: colors[index % colors.length],
          }))
        : [
            { name: "Living Room", value: 0, color: "#C53D39" },
            { name: "Bedroom", value: 0, color: "#F1BA69" },
            { name: "Office", value: 0, color: "#8B5CF6" },
            { name: "Dining", value: 0, color: "#10B981" },
          ]

    // Process top products
    const processedTopProducts =
      topProducts.length > 0
        ? topProducts.map((row) => ({
            name: row.name,
            sales: Number(row.sales) || 0,
            revenue: `₨${Number(row.revenue || 0).toLocaleString()}`,
          }))
        : [{ name: "No products sold yet", sales: 0, revenue: "₨0" }]

    // Process stats
    const statsRow = stats[0] || {}
    const totalRevenue = Number(statsRow.total_revenue) || 0
    const totalOrders = Number(statsRow.total_orders) || 0
    const totalCustomers = Number(statsRow.total_customers) || 0
    const totalProductsSold = Number(statsRow.total_products_sold) || 0

    const processedStats = [
      {
        title: "Total Revenue",
        value: `₨${totalRevenue.toLocaleString()}`,
        change: "+20.1%",
        trend: "up",
        icon: "DollarSign",
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        title: "Total Orders",
        value: totalOrders.toString(),
        change: "+15.3%",
        trend: "up",
        icon: "ShoppingCart",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        title: "Total Customers",
        value: totalCustomers.toString(),
        change: "+8.2%",
        trend: "up",
        icon: "Users",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      },
      {
        title: "Products Sold",
        value: totalProductsSold.toString(),
        change: "+8.7%",
        trend: "up",
        icon: "Package",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      },
    ]

    const responseData = {
      salesData: processedSalesData,
      categoryData: processedCategoryData,
      topProducts: processedTopProducts,
      stats: processedStats,
    }

    console.log("Processed analytics data:", responseData)

    return NextResponse.json({
      success: true,
      data: responseData,
    })
  } catch (error) {
    console.error("Analytics API error:", error)
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
