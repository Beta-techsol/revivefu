import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat, Poppins, Dancing_Script } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/hooks/use-cart"
import { WishlistProvider } from "@/hooks/use-wishlist"
import { CompareProvider } from "@/hooks/use-compare"
import { AuthProvider } from "@/hooks/use-auth"
{/*import { TopBar } from "@/components/top-bar"*/}
import dynamic from "next/dynamic"; // <-- REQUIRED
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import WhatsAppWrapper from "@/components/WhatsAppWrapper";
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
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing-script",
})

export const metadata: Metadata = {
  title: "Revive Furniture - Premium Furniture Store",
  description:
    "Discover premium furniture for your home and office. Quality craftsmanship, modern designs, and exceptional service.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${montserrat.variable} ${poppins.variable} ${dancingScript.variable} overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <CompareProvider>
                  {/*<TopBar />*/}
                  <Header />
                  <main>{children}</main>
                  <Footer />
                 <WhatsAppWrapper />
                  <Toaster />
                </CompareProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
