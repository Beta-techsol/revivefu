"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Loader2 } from "lucide-react"

export function FurnitureShowcaseFooter() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    setEmail("")
    alert("Thank you for subscribing!")
  }

  return (
    <section className="relative h-[500px] w-full overflow-hidden pb-[100px]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E2%80%94Pngtree%E2%80%94serene%20minimalist%20living%20room%20with_16675637.png-MTHDQSDZXt6DwWfKQPtbXHw9cIgY1P.jpeg')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content Container */}
      <div className="relative h-full flex">
        {/* Left Section - Newsletter */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full space-y-6 text-center">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">Newsletter</h2>
              <p className="text-white/90 text-lg">Subscribe to get information about products and coupons</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-12 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A555] text-white font-semibold transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  "Subscribe Now"
                )}
              </Button>
            </form>

            <p className="text-white/70 text-sm">Join thousands of furniture lovers and get exclusive deals!</p>
          </div>
        </div>

        {/* Right Section - Vertical Text */}
        <div className="w-24 h-[500px] flex items-center justify-center bg-gradient-to-b from-[#C53D39] to-[#F1BA69]">
          <div className="transform -rotate-90 whitespace-nowrap flex items-center justify-center">
            <span
              className="text-white font-bold text-[36px] animate-shimmer-smooth bg-gradient-to-r from-white via-yellow-200 via-white via-yellow-200 to-white bg-[length:400%_100%] bg-clip-text text-transparent"
              style={{
                fontFamily: "Dancing Script, cursive",
                letterSpacing: "0.2em",
              }}
            >
              SUBSCRIBE US
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
