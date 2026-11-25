import type { Metadata } from "next"
import Head from "next/head"
import ShopPageWrapper from "@/components/shop-page-wrapper"

export const metadata: Metadata = {
  title: "Bedroom Furniture in Pakistan | Beds, Wardrobes & More | Revive Furniture",
  description:
    "Shop premium bedroom furniture in Pakistan. Beds, wardrobes, dressing tables, and nightstands. Transform your bedroom with quality furniture from Revive Furniture.",
  openGraph: {
    title: "Bedroom Furniture in Pakistan | Beds, Wardrobes & More | Revive Furniture",
    description: "Shop premium bedroom furniture in Pakistan. Beds, wardrobes, dressing tables, and nightstands.",
    url: "https://revivefurniture.pk/bed-room",
    siteName: "Revive Furniture",
    images: [
      {
        url: "https://revivefurniture.pk/images/bedroom-furniture.webp",
        width: 1200,
        height: 630,
        alt: "Bedroom Furniture Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bedroom Furniture in Pakistan | Beds, Wardrobes & More | Revive Furniture",
    description: "Shop premium bedroom furniture in Pakistan. Beds, wardrobes, dressing tables, and nightstands.",
    images: ["https://revivefurniture.pk/images/bedroom-furniture.webp"],
  },
  alternates: {
    canonical: "https://revivefurniture.pk/bed-room",
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
}

export default function BedRoomPage() {
  return (
    <>
      <Head>
        <meta
          name="keywords"
          content="bedroom furniture Pakistan, beds Pakistan, wardrobes, dressing tables, nightstands, bedroom sets Lahore"
        />
      </Head>
      <ShopPageWrapper initialSearch="Bed Room" />
    </>
  )
}
