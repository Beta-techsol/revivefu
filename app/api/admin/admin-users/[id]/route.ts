import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Delete admin user
    const result = await sql`
      DELETE FROM admin_users 
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Admin user not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Admin user deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting admin user:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete admin user",
      },
      { status: 500 },
    )
  }
}
