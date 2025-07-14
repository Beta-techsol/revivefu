import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat, Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/hooks/use-cart"
import { CompareProvider } from "@/hooks/use-compare"

const inter = Inter({ subsets: ["latin"] })
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Furniture Store - Premium Home & Office Furniture",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${montserrat.variable} ${poppins.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <CartProvider>
            <CompareProvider>
              {children}
              <Toaster />
            </CompareProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
