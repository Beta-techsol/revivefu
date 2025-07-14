import type React from "react"
import type { Metadata } from "next"
import { Inter, Urbanist, Poppins } from "next/font/google"
import "./globals.css"
import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { MovingTextBanner } from "@/components/moving-text-banner"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/hooks/use-cart"
import { CompareProvider } from "@/hooks/use-compare"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const urbanist = Urbanist({ subsets: ["latin"], variable: "--font-urbanist" })
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Revive Furniture - Transform Your Space Today",
  description:
    "Discover premium furniture with Cash on Delivery. Modern designs, exceptional comfort, and quality craftsmanship.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${urbanist.variable} ${poppins.variable}`}>
        <CompareProvider>
          <CartProvider>
            <TopBar />
            <Header />
            <MovingTextBanner />
            {children}
            <Footer />
          </CartProvider>
        </CompareProvider>
      </body>
    </html>
  )
}
