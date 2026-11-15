import { neon } from "@neondatabase/serverless"

const UNSAFE_SQL = Symbol("UNSAFE_SQL")

const MOCK_CATEGORIES = [
  { id: 1, name: "Living Room", slug: "living-room", description: "Sofas, coffee tables, and living room furniture", image_url: "/categories/center-table.jpeg", product_count: "4", is_active: true, sort_order: 1 },
  { id: 2, name: "Bed Room", slug: "bed-room", description: "Luxury beds, wardrobes, and bedroom sets", image_url: "/categories/bed.jpeg", product_count: "3", is_active: true, sort_order: 2 },
  { id: 3, name: "Office", slug: "office", description: "Executive desks, workstations, and office chairs", image_url: "/categories/office-table.jpeg", product_count: "4", is_active: true, sort_order: 3 },
  { id: 4, name: "Dining & Kitchen", slug: "dining", description: "Dining tables, chairs, and tea trolleys", image_url: "/categories/dining-table.jpeg", product_count: "3", is_active: true, sort_order: 4 },
  { id: 5, name: "Chairs & Stools", slug: "chairs-stools", description: "Ergonomic chairs, lounge chairs, and bar stools", image_url: "/categories/office-chair.webp", product_count: "3", is_active: true, sort_order: 5 },
  { id: 6, name: "Home Decor", slug: "home-decor", description: "Accent tables, decor pieces, and shelving", image_url: "/categories/office-decor.jpeg", product_count: "2", is_active: true, sort_order: 6 },
]

const MOCK_ROOM_TYPES = [
  { id: 1, name: "Living Room", slug: "living-room", is_active: true },
  { id: 2, name: "Bed Room", slug: "bed-room", is_active: true },
  { id: 3, name: "Office", slug: "office", is_active: true },
  { id: 4, name: "Home Decor", slug: "home-decor", is_active: true },
  { id: 5, name: "Chairs & Stools", slug: "chairs-stools", is_active: true },
]

const nowIso = new Date().toISOString()

const MOCK_PRODUCTS = [
  {
    id: 1,
    slug: "modern-l-shaped-sectional-sofa",
    name: "Modern L-Shaped Sectional Sofa",
    price: 145000,
    compare_price: 168000,
    description: "Crafted with solid hardwood framing and breathable performance upholstery for contemporary Pakistani living rooms.",
    short_description: "Plush 5-seater L-shaped sectional sofa with solid wood frame.",
    sku: "REV-SOF-001",
    status: "active",
    stock_quantity: 12,
    images: JSON.stringify(["/products/sofa.webp", "/shop/products/living-room.jpg"]),
    tags: JSON.stringify(["sofa", "living room", "modern"]),
    material: "Solid Sheesham & Linen Fabric",
    color: "Warm Beige",
    brand: "Revive Furniture",
    average_rating: 4.8,
    review_count: 34,
    is_featured: true,
    is_trending: true,
    is_best_seller: true,
    is_hot_selling: true,
    is_deal_of_day: true,
    is_latest: true,
    room_type_id: 1,
    room_type_name: "Living Room",
    room_type_slug: "living-room",
    category_id: 1,
    category_name: "Living Room",
    category_slug: "living-room",
    categories: [{ id: 1, name: "Living Room", slug: "living-room" }],
    created_at: nowIso,
    updated_at: nowIso,
  },
  {
    id: 2,
    slug: "executive-walnut-office-desk",
    name: "Executive Walnut Office Desk",
    price: 89000,
    compare_price: 105000,
    description: "Spacious executive office desk with integrated cable management, soft-close drawers, and matte walnut finish.",
    short_description: "Executive workspace desk in rich walnut veneer and steel.",
    sku: "REV-OFF-002",
    status: "active",
    stock_quantity: 9,
    images: JSON.stringify(["/products/executive-office-desk.webp", "/categories/office-table.jpeg"]),
    tags: JSON.stringify(["desk", "office", "executive"]),
    material: "Walnut Veneer & Powder-Coated Steel",
    color: "Dark Walnut",
    brand: "Revive Furniture",
    average_rating: 4.9,
    review_count: 21,
    is_featured: true,
    is_trending: true,
    is_best_seller: true,
    is_hot_selling: false,
    is_deal_of_day: true,
    is_latest: true,
    room_type_id: 3,
    room_type_name: "Office",
    room_type_slug: "office",
    category_id: 3,
    category_name: "Office",
    category_slug: "office",
    categories: [{ id: 3, name: "Office", slug: "office" }],
    created_at: nowIso,
    updated_at: nowIso,
  },
  {
    id: 3,
    slug: "luxury-king-bedroom-set",
    name: "Luxury King Bedroom Set",
    price: 215000,
    compare_price: 245000,
    description: "Complete master bedroom suite featuring an upholstered headboard king bed and matching side tables.",
    short_description: "King size upholstered bed frame with twin nightstands.",
    sku: "REV-BED-003",
    status: "active",
    stock_quantity: 6,
    images: JSON.stringify(["/products/luxury-bedroom-set.webp", "/shop/products/bed-1.jpg"]),
    tags: JSON.stringify(["bed", "bedroom", "luxury"]),
    material: "Seasoned Kikar Wood & Velvet",
    color: "Champagne Grey",
    brand: "Revive Furniture",
    average_rating: 4.9,
    review_count: 19,
    is_featured: true,
    is_trending: false,
    is_best_seller: true,
    is_hot_selling: true,
    is_deal_of_day: true,
    is_latest: true,
    room_type_id: 2,
    room_type_name: "Bed Room",
    room_type_slug: "bed-room",
    category_id: 2,
    category_name: "Bed Room",
    category_slug: "bed-room",
    categories: [{ id: 2, name: "Bed Room", slug: "bed-room" }],
    created_at: nowIso,
    updated_at: nowIso,
  },
  {
    id: 4,
    slug: "ergonomic-mesh-office-chair",
    name: "Ergonomic Mesh Office Chair",
    price: 38500,
    compare_price: 45000,
    description: "High-back ergonomic task chair with adjustable lumbar support, breathable mesh, and synchro-tilt mechanism.",
    short_description: "Breathable high-back ergonomic chair for long workdays.",
    sku: "REV-CHR-004",
    status: "active",
    stock_quantity: 25,
    images: JSON.stringify(["/products/chair.webp", "/categories/office-chair.webp"]),
    tags: JSON.stringify(["chair", "office", "ergonomic"]),
    material: "Breathable Mesh & Aluminum Base",
    color: "Charcoal Black",
    brand: "Revive Furniture",
    average_rating: 4.7,
    review_count: 42,
    is_featured: true,
    is_trending: true,
    is_best_seller: true,
    is_hot_selling: true,
    is_deal_of_day: true,
    is_latest: true,
    room_type_id: 5,
    room_type_name: "Chairs & Stools",
    room_type_slug: "chairs-stools",
    category_id: 5,
    category_name: "Chairs & Stools",
    category_slug: "chairs-stools",
    categories: [{ id: 5, name: "Chairs & Stools", slug: "chairs-stools" }, { id: 3, name: "Office", slug: "office" }],
    created_at: nowIso,
    updated_at: nowIso,
  },
  {
    id: 5,
    slug: "solid-wood-6-seater-dining-set",
    name: "Solid Wood 6-Seater Dining Set",
    price: 132000,
    compare_price: 155000,
    description: "Hand-finished Sheesham wood dining table paired with six cushioned dining chairs for family gatherings.",
    short_description: "6-seater Sheesham dining table with upholstered chairs.",
    sku: "REV-DIN-005",
    status: "active",
    stock_quantity: 8,
    images: JSON.stringify(["/products/din.webp", "/shop/products/dining-table-1.jpg"]),
    tags: JSON.stringify(["dining", "table", "wooden"]),
    material: "Solid Sheesham Wood",
    color: "Natural Honey Oak",
    brand: "Revive Furniture",
    average_rating: 4.8,
    review_count: 27,
    is_featured: true,
    is_trending: true,
    is_best_seller: true,
    is_hot_selling: false,
    is_deal_of_day: true,
    is_latest: true,
    room_type_id: 1,
    room_type_name: "Living Room",
    room_type_slug: "living-room",
    category_id: 4,
    category_name: "Dining & Kitchen",
    category_slug: "dining",
    categories: [{ id: 4, name: "Dining & Kitchen", slug: "dining" }],
    created_at: nowIso,
    updated_at: nowIso,
  },
  {
    id: 6,
    slug: "modern-sliding-door-wardrobe",
    name: "Modern Sliding Door Wardrobe",
    price: 118000,
    compare_price: 138000,
    description: "Floor-to-ceiling wardrobe with smooth sliding doors, hanging rails, and built-in organizer drawers.",
    short_description: "Spacious contemporary wardrobe with matte laminate finish.",
    sku: "REV-WAR-006",
    status: "active",
    stock_quantity: 5,
    images: JSON.stringify(["/products/war.webp", "/shop/products/wardrobe-1.jpg"]),
    tags: JSON.stringify(["wardrobe", "bedroom", "storage"]),
    material: "Engineered Wood & Matte Laminate",
    color: "Ash Grey & Oak",
    brand: "Revive Furniture",
    average_rating: 4.6,
    review_count: 14,
    is_featured: false,
    is_trending: true,
    is_best_seller: true,
    is_hot_selling: true,
    is_deal_of_day: true,
    is_latest: true,
    room_type_id: 2,
    room_type_name: "Bed Room",
    room_type_slug: "bed-room",
    category_id: 2,
    category_name: "Bed Room",
    category_slug: "bed-room",
    categories: [{ id: 2, name: "Bed Room", slug: "bed-room" }],
    created_at: nowIso,
    updated_at: nowIso,
  },
  {
    id: 7,
    slug: "minimalist-accent-dining-chair",
    name: "Minimalist Accent Dining Chair",
    price: 24500,
    compare_price: 29000,
    description: "Sculpted wooden accent chair with curved backrest and stain-resistant woven seat cushion.",
    short_description: "Versatile wooden accent chair for dining or study.",
    sku: "REV-CHR-007",
    status: "active",
    stock_quantity: 18,
    images: JSON.stringify(["/products/modern-dining-chair.webp", "/categories/center-table.jpeg"]),
    tags: JSON.stringify(["chair", "dining", "accent"]),
    material: "Ash Wood & Boucle Fabric",
    color: "Cream & Natural Wood",
    brand: "Revive Furniture",
    average_rating: 4.7,
    review_count: 16,
    is_featured: true,
    is_trending: true,
    is_best_seller: false,
    is_hot_selling: true,
    is_deal_of_day: true,
    is_latest: true,
    room_type_id: 5,
    room_type_name: "Chairs & Stools",
    room_type_slug: "chairs-stools",
    category_id: 5,
    category_name: "Chairs & Stools",
    category_slug: "chairs-stools",
    categories: [{ id: 5, name: "Chairs & Stools", slug: "chairs-stools" }],
    created_at: nowIso,
    updated_at: nowIso,
  },
  {
    id: 8,
    slug: "marble-top-center-coffee-table",
    name: "Marble-Top Center Coffee Table",
    price: 49500,
    compare_price: 58000,
    description: "Round travertine-inspired coffee table anchored by a solid fluted wood pedestal base.",
    short_description: "Elegant center coffee table for modern living spaces.",
    sku: "REV-TBL-008",
    status: "active",
    stock_quantity: 10,
    images: JSON.stringify(["/shop/products/coffee-table-1.jpg", "/categories/center-table.jpeg"]),
    tags: JSON.stringify(["coffee table", "living room", "decor"]),
    material: "Composite Stone & Solid Oak",
    color: "Ivory & Walnut",
    brand: "Revive Furniture",
    average_rating: 4.8,
    review_count: 11,
    is_featured: true,
    is_trending: true,
    is_best_seller: true,
    is_hot_selling: false,
    is_deal_of_day: true,
    is_latest: true,
    room_type_id: 4,
    room_type_name: "Home Decor",
    room_type_slug: "home-decor",
    category_id: 6,
    category_name: "Home Decor",
    category_slug: "home-decor",
    categories: [{ id: 6, name: "Home Decor", slug: "home-decor" }, { id: 1, name: "Living Room", slug: "living-room" }],
    created_at: nowIso,
    updated_at: nowIso,
  },
]

const MOCK_BLOG_POSTS = [
  {
    id: 1,
    title: "Choosing Solid Wood Furniture for Pakistani Homes",
    slug: "choosing-solid-wood-furniture",
    excerpt: "Compare Sheesham, Kikar, and walnut veneers to pick durable furniture built for local climate and daily living.",
    content: "<p>Investing in solid wood furniture brings warmth, longevity, and timeless craft into every room. Look for kiln-dried timber, mortise-and-tenon joinery, and low-sheen protective finishes.</p>",
    featured_image: "/showcase/modern-living-interior.avif",
    author_name: "Revive Editorial",
    category: "Buying Guides",
    status: "published",
    is_featured: true,
    views: 142,
    tags: ["wood", "sheesham", "buying guide"],
    published_at: nowIso,
    created_at: nowIso,
  },
  {
    id: 2,
    title: "Ergonomic Office Setups That Boost Focus",
    slug: "ergonomic-office-setups-boost-focus",
    excerpt: "How desk height, lumbar support, and clean cable routing transform home and corporate workspaces.",
    content: "<p>An ergonomic desk and supportive mesh chair reduce strain across long workdays while keeping your studio clutter-free.</p>",
    featured_image: "/showcase/modern-office-interior.png",
    author_name: "Revive Editorial",
    category: "Design Tips",
    status: "published",
    is_featured: true,
    views: 98,
    tags: ["office", "ergonomics", "workspace"],
    published_at: nowIso,
    created_at: nowIso,
  },
  {
    id: 3,
    title: "Warm Minimalist Bedroom Ideas for 2026",
    slug: "warm-minimalist-bedroom-ideas",
    excerpt: "Pair upholstered headboards with soft neutral linens and warm oak tones for a restful sanctuary.",
    content: "<p>Layer tactile upholstery, warm timber nightstands, and soft ambient lighting to create a calm, uncluttered bedroom retreat.</p>",
    featured_image: "/showcase/modern-bedroom.avif",
    author_name: "Revive Editorial",
    category: "Interior Trends",
    status: "published",
    is_featured: false,
    views: 76,
    tags: ["bedroom", "minimalist", "decor"],
    published_at: nowIso,
    created_at: nowIso,
  },
]

let warnedMock = false

function runMockQuery(queryText: string): any[] {
  if (!warnedMock) {
    warnedMock = true
    console.warn("[AI Studio] DATABASE_URL is not set — using in-memory mock database.")
  }

  const q = queryText.replace(/\s+/g, " ").trim()
  const qLower = q.toLowerCase()

  if (qLower.includes("count(")) {
    let countVal = 0
    if (qLower.includes("from products")) countVal = MOCK_PRODUCTS.length
    else if (qLower.includes("from categories")) countVal = MOCK_CATEGORIES.length
    else if (qLower.includes("from blog_posts")) countVal = MOCK_BLOG_POSTS.length
    return [
      {
        count: String(countVal),
        total: String(countVal),
        unviewed_count: "0",
        total_orders: "0",
        total_revenue: "0",
        total_customers: "0",
        total_products: String(MOCK_PRODUCTS.length),
      },
    ]
  }

  if (qLower.includes("sum(") && qLower.includes("from orders")) {
    return [{ total_revenue: "0", total_orders: "0", paid_amount: "0", pending_amount: "0", unpaid_amount: "0" }]
  }

  if (/^(insert|update|delete|create|alter|drop|truncate)\b/i.test(q)) {
    return []
  }

  if (qLower.includes("from products")) {
    const slugMatch = q.match(/p\.slug\s*=\s*'([^']+)'/i) || q.match(/slug\s*=\s*'([^']+)'/i)
    if (slugMatch) {
      return MOCK_PRODUCTS.filter((p) => p.slug === slugMatch[1])
    }
    const idMatch = q.match(/p\.id\s*=\s*'?(\d+)'?/i)
    if (idMatch) {
      return MOCK_PRODUCTS.filter((p) => String(p.id) === idMatch[1])
    }
    let filtered = [...MOCK_PRODUCTS]
    if (qLower.includes("is_trending = true")) filtered = filtered.filter((p) => p.is_trending)
    if (qLower.includes("is_deal_of_day = true")) filtered = filtered.filter((p) => p.is_deal_of_day)
    if (qLower.includes("is_best_seller = true")) filtered = filtered.filter((p) => p.is_best_seller)
    if (qLower.includes("is_featured = true")) filtered = filtered.filter((p) => p.is_featured)
    if (qLower.includes("is_latest = true")) filtered = filtered.filter((p) => p.is_latest)
    return filtered
  }

  if (qLower.includes("from categories")) {
    return [...MOCK_CATEGORIES]
  }

  if (qLower.includes("from room_type")) {
    return [...MOCK_ROOM_TYPES]
  }

  if (qLower.includes("from blog_posts")) {
    const slugMatch = q.match(/slug\s*=\s*'([^']+)'/i)
    if (slugMatch) {
      return MOCK_BLOG_POSTS.filter((b) => b.slug === slugMatch[1])
    }
    return [...MOCK_BLOG_POSTS]
  }

  return []
}

function buildSqlText(strings: TemplateStringsArray, values: any[]): string {
  let out = ""
  for (let i = 0; i < strings.length; i++) {
    out += strings[i]
    if (i < values.length) {
      const val = values[i]
      if (val && typeof val === "object" && UNSAFE_SQL in val) {
        out += val[UNSAFE_SQL]
      } else if (typeof val === "string") {
        out += `'${val.replace(/'/g, "''")}'`
      } else if (val === null || val === undefined) {
        out += "NULL"
      } else {
        out += String(val)
      }
    }
  }
  return out
}

function createMockSql(): any {
  const mockSql: any = async (strings: TemplateStringsArray, ...values: any[]) => {
    const queryText = buildSqlText(strings, values)
    return runMockQuery(queryText)
  }

  mockSql.query = async (queryText: string, _params?: any[]) => {
    return runMockQuery(queryText)
  }

  mockSql.unsafe = (queryText: string) => {
    const promise = Promise.resolve().then(() => runMockQuery(queryText)) as any
    promise[UNSAFE_SQL] = queryText
    return promise
  }

  mockSql.begin = async (fn: (txSql: any) => Promise<any>) => {
    return fn(mockSql)
  }

  return mockSql
}

export const sql: any = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : createMockSql()

export async function testConnection() {
  if (!process.env.DATABASE_URL) {
    return false
  }
  try {
    const result = await sql`SELECT NOW() as current_time`
    console.log("Database connected successfully:", result[0]?.current_time)
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

export function handleDbError(error: any) {
  console.error("Database error:", error)
  if (error?.code === "23505") {
    return "Duplicate entry found"
  } else if (error?.code === "23503") {
    return "Referenced record not found"
  } else if (error?.code === "42P01") {
    return "Table does not exist"
  } else {
    return "Database operation failed"
  }
}
