import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get("action")
    const itemId = searchParams.get("itemId")

    console.log("Header Dropdown Action Debug:", {
      action,
      itemId,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
      referer: request.headers.get("referer"),
    })

    return NextResponse.json({
      success: true,
      message: "Debug info logged",
      data: {
        action,
        itemId,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Header dropdown debug error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Debug logging failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("Header Dropdown Action POST Debug:", {
      body,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
    })

    return NextResponse.json({
      success: true,
      message: "POST debug info logged",
      data: body,
    })
  } catch (error) {
    console.error("Header dropdown POST debug error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "POST debug logging failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
