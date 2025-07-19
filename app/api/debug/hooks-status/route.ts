import { NextResponse } from "next/server"

export async function GET() {
  try {
    // This API will help us understand what's happening with the hooks
    const debugInfo = {
      timestamp: new Date().toISOString(),
      message: "Debug API for hooks status",
      suggestions: [
        "Check if useCart hook is properly exported",
        "Check if useWishlist hook is properly exported",
        "Check if useCompare hook is properly exported",
        "Verify hook context providers are wrapped around components",
        "Check for any circular dependencies in hooks",
      ],
      commonIssues: {
        "t is not a function": "Usually indicates a hook function (like addItem, removeItem) is undefined",
        "j is not a function": "Usually indicates addItem function from useCart is undefined",
        "Hook not found": "Context provider might not be wrapping the component",
      },
      hookFiles: ["/hooks/use-cart.tsx", "/hooks/use-wishlist.tsx", "/hooks/use-compare.tsx"],
      requiredProviders: ["CartProvider", "WishlistProvider", "CompareProvider"],
    }

    return NextResponse.json(debugInfo)
  } catch (error) {
    return NextResponse.json(
      {
        error: "Debug API error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
