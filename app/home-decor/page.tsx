import type { Metadata } from "next";
import Head from "next/head";
import ShopPageWrapper from "@/components/shop-page-wrapper";

export const metadata: Metadata = {
  title:
    "Home Decor Items in Pakistan | Wall Art, Mirrors & Accessories | Revive Furniture",
  description:
    "Beautiful home decor items in Pakistan. Wall art, mirrors, vases, and decorative accessories. Enhance your home's beauty with Revive Furniture's decor collection.",
  openGraph: {
    title:
      "Home Decor Items in Pakistan | Wall Art, Mirrors & Accessories | Revive Furniture",
    description:
      "Beautiful home decor items in Pakistan. Wall art, mirrors, vases, and decorative accessories.",
    url: "https://revivefurniture.pk/home-decor",
    siteName: "Revive Furniture",
    images: [
      {
        url: "https://revivefurniture.pk/images/home-decor.webp",
        width: 1200,
        height: 630,
        alt: "Home Decor Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Home Decor Items in Pakistan | Wall Art, Mirrors & Accessories | Revive Furniture",
    description:
      "Beautiful home decor items in Pakistan. Wall art, mirrors, vases, and decorative accessories.",
    images: ["https://revivefurniture.pk/images/home-decor.webp"],
  },
  alternates: {
    canonical: "https://revivefurniture.pk/home-decor",
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
};

export default function HomeDecorPage() {
  return (
    <>
      <Head>
        <meta
          name="keywords"
          content="home decor Pakistan, wall art, mirrors, decorative items, home accessories, interior decoration Lahore"
        />
      </Head>
      <ShopPageWrapper initialSearch="Home Decor" />
    </>
  );
}
