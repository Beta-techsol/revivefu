import type { Metadata } from "next"
import ShopPageWrapper from "@/components/shop-page-wrapper"

export const metadata: Metadata = {
  title: "Office Furniture in Pakistan | Desks, Chairs & Storage | Revive Furniture",
  description:
    "Professional office furniture in Pakistan. Office desks, chairs, storage solutions, and workstations. Create a productive workspace with Revive Furniture.",
  keywords:
    "office furniture Pakistan, office desks, office chairs, workstations, office storage, commercial furniture Lahore",
  openGraph: {
    title: "Office Furniture in Pakistan | Desks, Chairs & Storage | Revive Furniture",
    description:
      "Professional office furniture in Pakistan. Office desks, chairs, storage solutions, and workstations.",
    url: "https://revivefurniture.pk/office",
    siteName: "Revive Furniture",
    images: [
      {
        url: "https://revivefurniture.pk/images/office-furniture.webp",
        width: 1200,
        height: 630,
        alt: "Office Furniture Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Office Furniture in Pakistan | Desks, Chairs & Storage | Revive Furniture",
    description:
      "Professional office furniture in Pakistan. Office desks, chairs, storage solutions, and workstations.",
    images: ["https://revivefurniture.pk/images/office-furniture.webp"],
  },
  alternates: {
    canonical: "https://revivefurniture.pk/office",
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

export default function OfficePage() {
  return <ShopPageWrapper initialSearch="Office" />
}
