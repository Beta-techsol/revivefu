import type { Metadata } from "next"
import ShopPageWrapper from "@/components/shop-page-wrapper"

export const metadata: Metadata = {
  title: "Living Room Furniture in Pakistan | Revive Furniture",
  description:
    "Discover premium living room furniture in Pakistan. Sofas, coffee tables, TV units, and more. Quality furniture for your living space at Revive Furniture.",
  keywords:
    "living room furniture Pakistan, sofa sets Pakistan, coffee tables, TV units, living room decor, furniture Lahore",
  openGraph: {
    title: "Living Room Furniture in Pakistan | Revive Furniture",
    description:
      "Discover premium living room furniture in Pakistan. Sofas, coffee tables, TV units, and more. Quality furniture for your living space.",
    url: "https://revivefurniture.pk/living-room",
    siteName: "Revive Furniture",
    images: [
      {
        url: "https://revivefurniture.pk/images/living-room.jpg",
        width: 1200,
        height: 630,
        alt: "Living Room Furniture Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Living Room Furniture in Pakistan | Revive Furniture",
    description: "Discover premium living room furniture in Pakistan. Sofas, coffee tables, TV units, and more.",
    images: ["https://revivefurniture.pk/images/living-room.jpg"],
  },
  alternates: {
    canonical: "https://revivefurniture.pk/living-room",
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

export default function LivingRoomPage() {
  return <ShopPageWrapper initialSearch="Living Room" />
}
