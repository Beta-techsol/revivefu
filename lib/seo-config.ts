// Central SEO configuration for the entire website
// Customize keywords, descriptions, and meta tags for all pages and products

export const seoConfig = {
  // Base website information
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk",
  siteName: "Revive Furniture Pakistan",
  logo: "/google.jpg",

  // Pakistan-specific location data
  locations: {
    primary: {
      name: "Lahore",
      coordinates: { lat: 31.5204, lng: 74.3587 },
      address: "35-17 College Road, Sector B-1 Block A-1, Phase 1 Johar Town",
      city: "Lahore",
      region: "Punjab",
      postalCode: "54000",
      country: "PK",
    },
    secondary: [
      { name: "Karachi", city: "Karachi", region: "Sindh", country: "PK" },
      { name: "Islamabad", city: "Islamabad", region: "Islamabad Capital Territory", country: "PK" },
    ],
  },

  // Primary keywords for ranking
  keywords: {
    global: [
      "furniture Pakistan",
      "furniture Lahore",
      "wooden furniture",
      "home furniture",
      "office furniture",
      "furniture store Pakistan",
      "buy furniture online",
      "premium furniture",
      "modern furniture Pakistan",
      "traditional furniture",
    ],
    locations: {
      lahore: [
        "furniture Lahore",
        "wooden furniture Lahore",
        "office furniture Lahore",
        "home decor Lahore",
        "furniture store Lahore",
        "best furniture shop in Lahore",
        "affordable furniture Lahore",
        "sofa Lahore",
        "dining furniture Lahore",
        "bedroom furniture Lahore",
      ],
      karachi: ["furniture Karachi", "wooden furniture Karachi", "furniture store Karachi", "home furniture Karachi"],
      islamabad: [
        "furniture Islamabad",
        "wooden furniture Islamabad",
        "furniture store Islamabad",
        "home furniture Islamabad",
      ],
    },
    categories: {
      office: [
        "office furniture",
        "office desk Pakistan",
        "office chair Lahore",
        "workspace furniture",
        "commercial furniture",
        "office sofa",
        "executive furniture",
        "modern office furniture",
      ],
      bedroom: [
        "bedroom furniture",
        "bed frame Pakistan",
        "wooden bed",
        "wardrobe furniture",
        "bedroom set",
        "queen size bed",
        "double bed Pakistan",
      ],
      living: [
        "sofa Pakistan",
        "living room furniture",
        "sofa set Lahore",
        "leather sofa",
        "sectional sofa",
        "lounge furniture",
        "coffee table",
        "side table",
      ],
      dining: [
        "dining furniture",
        "dining table",
        "dining chairs",
        "dining set",
        "wooden dining table",
        "extendable dining table",
      ],
    },
  },

  // Page-specific SEO configuration
  pages: {
    home: {
      title: "Revive Furniture Pakistan - Premium Furniture Store in Lahore & Karachi",
      description:
        "Buy premium furniture in Pakistan. Quality wooden furniture, home decor, office furniture in Lahore, Karachi, Islamabad. Free delivery across Pakistan. Best furniture store online.",
      keywords: [
        "furniture Pakistan",
        "furniture Lahore",
        "wooden furniture",
        "home furniture",
        "office furniture",
        "furniture store Pakistan",
      ],
    },
    shop: {
      title: "Shop Premium Furniture Online | Revive Furniture Pakistan",
      description:
        "Browse our extensive collection of premium wooden furniture, home decor, office furniture, and more. Best prices with free delivery across Pakistan.",
      keywords: ["buy furniture online", "furniture shop", "wooden furniture", "home decor", "office furniture"],
    },
    about: {
      title: "About Revive Furniture - Premium Furniture Store Pakistan",
      description:
        "Learn about Revive Furniture Pakistan, your trusted partner for quality wooden furniture and home decor in Lahore, Karachi, and Islamabad.",
      keywords: ["furniture store", "quality furniture", "trusted furniture", "Pakistan"],
    },
    contact: {
      title: "Contact Revive Furniture Pakistan - Get in Touch",
      description: "Contact Revive Furniture Pakistan for inquiries, orders, and customer support. We're here to help!",
      keywords: ["contact furniture", "customer service", "furniture support"],
    },
  },

  // Contact information
  contact: {
    phone: "+92-315-4843593",
    email: "revivefurniture01@gmail.com",
    address: "35-17 College Road, Sector B-1 Block A-1, Phase 1 Johar Town, Lahore, Punjab 54000, Pakistan",
  },

  // Social media
  social: {
    facebook: "https://www.facebook.com/ReviveFurnituree/",
    instagram: "https://www.instagram.com/revivefurniturepk/",
    linkedin: "https://pk.linkedin.com/company/revive-furniture",
    pinterest: "https://pin.it/KRTdbZQvQ",
  },

  // Business hours
  businessHours: {
    weekdays: { opens: "12:00", closes: "21:00" },
    weekends: { opens: "12:00", closes: "21:00" },
    closedDays: ["Sunday"],
  },

  // Rating info (update as you receive reviews)
  rating: {
    ratingValue: "4.8",
    reviewCount: "247",
    bestRating: "5",
    worstRating: "1",
  },
}

// Generate dynamic meta description
export function generateMetaDescription(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + "..."
}

// Generate keywords string from array
export function generateKeywordString(keywords: string[]): string {
  return keywords.join(", ")
}

// Get location-specific keywords
export function getLocationKeywords(location: string): string[] {
  const locationLower = location.toLowerCase()
  const keywordSet = (seoConfig.keywords.locations as Record<string, string[]>)[locationLower] || []
  return [...seoConfig.keywords.global, ...keywordSet]
}

// Get category-specific keywords
export function getCategoryKeywords(category: string): string[] {
  const categoryLower = category.toLowerCase().replace(/\s+/g, "")
  const keywordSet = (seoConfig.keywords.categories as Record<string, string[]>)[categoryLower] || []
  return [...seoConfig.keywords.global, ...keywordSet]
}
