import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins, Montserrat } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/hooks/use-cart"
import { CompareProvider } from "@/hooks/use-compare"

const inter = Inter({ subsets: ["latin"] })
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "Revive Furniture - Premium Furniture Store",
  description:
    "Discover premium furniture for your home and office. Quality craftsmanship, modern designs, and exceptional service.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${poppins.variable} ${montserrat.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <CartProvider>
            <CompareProvider>
              <Header />
              <main>{children}</main>
              <Footer />
              <Toaster />
            </CompareProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
