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
{
  /*import { TopBar } from "@/components/top-bar"*/
}
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import WhatsAppWrapper from "@/components/WhatsAppWrapper"
import { Analytics } from "@vercel/analytics/react"

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
  title: "Revive Furniture Pakistan - Premium Furniture Store in Lahore & Karachi",
  description:
    "Buy premium furniture in Pakistan. Quality wooden furniture, home decor, office furniture in Lahore, Karachi, Islamabad. Free delivery across Pakistan. Best furniture store online.",
  keywords:
    "furniture Pakistan, furniture Lahore, wooden furniture Pakistan, home furniture Lahore, office furniture Karachi, furniture store Pakistan, buy furniture online Pakistan, premium furniture Pakistan",
  authors: [{ name: "Revive Furniture Pakistan" }],
  creator: "Revive Furniture Pakistan",
  publisher: "Revive Furniture Pakistan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Revive Furniture Pakistan - Premium Furniture Store",
    description:
      "Buy premium furniture in Pakistan. Quality wooden furniture, home decor, office furniture in Lahore, Karachi, Islamabad.",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk",
    siteName: "Revive Furniture Pakistan",
    images: [
      {
        url: "/google.jpg",
        width: 1200,
        height: 630,
        alt: "Revive Furniture Pakistan - Premium Furniture Store",
      },
    ],
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Revive Furniture Pakistan - Premium Furniture Store",
    description: "Buy premium furniture in Pakistan. Quality wooden furniture, home decor, office furniture.",
    images: ["/google.jpg"],
    creator: "@ReviveFurniturePK",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "5wq6ZLKyIqAcjY3Ftypja5hZX-7xFhKnJw1x0-goSUk",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk"}/#organization`,
        name: "Revive Furniture Pakistan",
        url: process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk",
        logo: {
          "@type": "ImageObject",
          url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk"}/google.jpg`,
          width: 512,
          height: 512,
        },
        image: `${process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk"}/google.jpg`,
        description:
          "Premium furniture store in Pakistan offering quality wooden furniture, home decor, and office furniture with delivery across Lahore, Karachi, and Islamabad.",
        address: {
          "@type": "PostalAddress",
          streetAddress: "35-17 College Road, Sector B-1 Block A-1, Phase 1 Johar Town",
          addressLocality: "Lahore",
          addressRegion: "Punjab",
          postalCode: "54000",
          addressCountry: "PK",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+92-315-4843593",
            contactType: "customer service",
            areaServed: "PK",
            availableLanguage: ["English", "Urdu"],
          },
          {
            "@type": "ContactPoint",
            email: "revivefurniture01@gmail.com",
            contactType: "customer service",
            areaServed: "PK",
            availableLanguage: ["English", "Urdu"],
          },
        ],
        sameAs: [
          "https://www.facebook.com/ReviveFurnituree/",
          "https://www.instagram.com/revivefurniturepk/",
          "https://pk.linkedin.com/company/revive-furniture",
          "https://pin.it/KRTdbZQvQ",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk"}/#website`,
        url: process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk",
        name: "Revive Furniture Pakistan",
        description:
          "Premium furniture store in Pakistan offering wooden furniture, home decor, office furniture, bedroom furniture, and chairs & stools",
        publisher: {
          "@id": `${process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk"}/#organization`,
        },
        potentialAction: [
          {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk"}/shop?search={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        ],
      },
      {
        "@type": "Store",
        name: "Revive Furniture Pakistan",
        image: `${process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk"}/google.jpg`,
        description:
          "Premium furniture store offering quality wooden furniture, home decor, and office furniture across Pakistan",
        address: {
          "@type": "PostalAddress",
          streetAddress: "35-17 College Road, Sector B-1 Block A-1, Phase 1 Johar Town",
          addressLocality: "Lahore",
          addressRegion: "Punjab",
          postalCode: "54000",
          addressCountry: "PK",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 31.5204,
          longitude: 74.3587,
        },
        url: process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk",
        telephone: "+92-315-4843593",
        email: "revivefurniture01@gmail.com",
        priceRange: "$$",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "12:00",
            closes: "21:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Sunday",
            opens: "00:00",
            closes: "00:00",
            validFrom: "2024-01-01",
            validThrough: "2024-12-31",
            description: "Closed on Sundays",
          },
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "247",
          bestRating: "5",
          worstRating: "1",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Revive Furniture Product Categories",
          itemListElement: [
            {
              "@type": "OfferCatalog",
              name: "Office Furniture",
              url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk"}/shop?search=Office`,
            },
            {
              "@type": "OfferCatalog",
              name: "Home Decor",
              url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk"}/shop?search=Home%20Decor`,
            },
            {
              "@type": "OfferCatalog",
              name: "Bed Room Furniture",
              url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk"}/shop?search=Bed%20Room`,
            },
            {
              "@type": "OfferCatalog",
              name: "Chairs & Stools",
              url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk"}/shop?search=Chairs%20%26%20Stools`,
            },
          ],
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": `${process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk"}/#localbusiness`,
        name: "Revive Furniture Pakistan",
        image: `${process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk"}/google.jpg`,
        telephone: "+92-315-4843593",
        email: "revivefurniture01@gmail.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "35-17 College Road, Sector B-1 Block A-1, Phase 1 Johar Town",
          addressLocality: "Lahore",
          addressRegion: "Punjab",
          postalCode: "54000",
          addressCountry: "PK",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 31.5204,
          longitude: 74.3587,
        },
        url: process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "12:00",
            closes: "21:00",
          },
        ],
        priceRange: "$$",
        servesCuisine: "Furniture",
        acceptsReservations: false,
      },
    ],
  }

  return (
    <html lang="en" className="overflow-x-hidden w-full">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/fav32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/fav16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favap.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/fav32.png" color="#000000" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />

        <meta name="google-site-verification" content="5wq6ZLKyIqAcjY3Ftypja5hZX-7xFhKnJw1x0-goSUk" />
        <meta name="google" content="notranslate" />
        <meta name="googlebot" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <meta name="geo.region" content="PK" />
        <meta name="geo.placename" content="Pakistan" />
        <meta name="geo.position" content="31.5204;74.3587" />
        <meta name="ICBM" content="31.5204, 74.3587" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.className} ${montserrat.variable} ${poppins.variable} ${dancingScript.variable} w-full min-h-screen flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <CompareProvider>
                  {/*<TopBar />*/}
                  <Header />
                  <main className="flex-1 w-full">{children}</main>
                  <Footer />
                  <WhatsAppWrapper />
                  <Toaster />
                  <Analytics />
                </CompareProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
