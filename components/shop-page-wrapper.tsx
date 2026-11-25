"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ShopPage from "@/app/shop/page"

interface ShopPageWrapperProps {
  initialSearch?: string
}

function ShopPageWrapperContent({ initialSearch }: ShopPageWrapperProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (initialSearch && !searchParams.get("search")) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("search", initialSearch)
      router.replace(`/shop?${params.toString()}`, { scroll: false })
    }
  }, [initialSearch, searchParams, router])

  return <ShopPage />
}

export default function ShopPageWrapper({ initialSearch }: ShopPageWrapperProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#C53D39] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ShopPageWrapperContent initialSearch={initialSearch} />
    </Suspense>
  )
}
