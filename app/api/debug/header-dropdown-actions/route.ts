import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get("action")
    const itemId = searchParams.get("itemId")
    const dropdown = searchParams.get("dropdown")

    console.log("Header Dropdown Action Debug:", {
      action,
      itemId,
      dropdown,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
    })

    const debugInfo = {
      action,
      itemId,
      dropdown,
      timestamp: new Date().toISOString(),
      status: "debug_logged",
      availableHooks: {
        useCart: {
          methods: ["addToCart", "removeFromCart", "updateQuantity", "clearCart"],
          properties: ["items", "total", "itemCount"],
        },
        useWishlist: {
          methods: ["addToWishlist", "removeFromWishlist", "clearWishlist", "isInWishlist"],
          properties: ["items", "itemCount"],
        },
        useCompare: {
          methods: ["addToCompare", "removeFromCompare", "clearCompare", "isInCompare"],
          properties: ["items"],
        },
      },
      commonErrors: [
        "Function not defined - check hook destructuring",
        "Incorrect method names - verify hook exports",
        "Missing event handlers - ensure proper binding",
        "Context not available - check provider wrapping",
      ],
    }

    return NextResponse.json(debugInfo)
  } catch (error) {
    console.error("Debug API Error:", error)
    return NextResponse.json(
      {
        error: "Debug API failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("Header Dropdown Error Report:", {
      ...body,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
    })

    return NextResponse.json({
      status: "error_logged",
      timestamp: new Date().toISOString(),
      received: body,
    })
  } catch (error) {
    console.error("Error logging failed:", error)
    return NextResponse.json(
      {
        error: "Failed to log error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
