"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ShopPage from "@/app/shop/page"

interface ShopPageWrapperProps {
  initialSearch?: string
}

export default function ShopPageWrapper({ initialSearch }: ShopPageWrapperProps) {
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
