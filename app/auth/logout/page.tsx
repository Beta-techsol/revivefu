"use client"

import { useEffect } from "react"
import { LogOut, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function LogoutPage() {
  useEffect(() => {
    // Clear user session/tokens here
    localStorage.removeItem("user")
    sessionStorage.clear()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogOut className="w-10 h-10 text-white" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">You've been logged out</h1>
              <p className="text-gray-600 mb-8">Thank you for visiting Revive Furniture. See you again soon!</p>

              <div className="space-y-4">
                <Link href="/auth/login">
                  <Button className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105">
                    Log In Again
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>

                <Link href="/">
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-xl border-gray-200 hover:bg-gray-50 bg-transparent"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <Link href="/" className="inline-block">
                  <Image src="/logo.webp" alt="Revive Furniture" width={120} height={40} />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
