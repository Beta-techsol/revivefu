"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DirectTrackingPage({ params }: { params: { orderNumber: string } }) {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the main tracking page with the order number as a parameter
    router.push(`/track-order?order=${params.orderNumber}`)
  }, [params.orderNumber, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading order tracking...</p>
      </div>
    </div>
  )
}
