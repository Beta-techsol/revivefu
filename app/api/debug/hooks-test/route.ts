import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get("action")
    const component = searchParams.get("component")

    console.log("Hook Debug Test:", {
      action,
      component,
      timestamp: new Date().toISOString(),
    })

    const debugInfo = {
      timestamp: new Date().toISOString(),
      action,
      component,
      status: "received",
      recommendations: [
        "Check if hooks are properly imported",
        "Verify function destructuring from hooks",
        "Ensure components are wrapped in providers",
        "Check for any minification issues",
      ],
    }

    return NextResponse.json(debugInfo)
  } catch (error) {
    console.error("Hook Debug Error:", error)
    return NextResponse.json(
      {
        error: "Debug failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("Hook Action Debug:", {
      ...body,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      status: "logged",
      timestamp: new Date().toISOString(),
      received: body,
    })
  } catch (error) {
    console.error("Hook Debug POST Error:", error)
    return NextResponse.json(
      {
        error: "Debug POST failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
