import { neon } from "@neondatabase/serverless"

const UNSAFE_SQL = Symbol("UNSAFE_SQL")

const MOCK_CATEGORIES = [
  { id: 1, name: "Living Room", slug: "living-room", description: "Sofas, coffee tables, and living room furniture", image_url: "/categories/center-table.jpeg", product_count: "4", is_active: true, sort_order: 1 },
  { id: 2, name: "Bed Room", slug: "bed-room", description: "Luxury beds, wardrobes, and bedroom sets", image_url: "/categories/bed.jpeg", product_count: "3", is_active: true, sort_order: 2 },
  { id: 3, name: "Office", slug: "office", description: "Executive desks, workstations, and office chairs", image_url: "/categories/office-table.jpeg", product_count: "5", is_active: true, sort_order: 3 },
  { id: 4, name: "Dining & Kitchen", slug: "dining", description: "Dining tables, chairs, and tea trolleys", image_url: "/categories/dining-table.jpeg", product_count: "3", is_active: true, sort_order: 4 },
  { id: 5, name: "Chairs & Stools", slug: "chairs-stools", description: "Ergonomic chairs, lounge chairs, and bar stools", image_url: "/categories/office-chair.webp", product_count: "4", is_active: true, sort_order: 5 },
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

const INITIAL_MOCK_PRODUCTS: any[] = [
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
  {
    id: 9,
    slug: "zenith-executive-chair",
    name: "Zenith Executive Chair",
    price: 54000,
    compare_price: 64000,
    description: "Executive leatherette high-back office chair featuring multi-angle recline lock, padded armrests, and heavy-duty chrome base.",
    short_description: "Flagship executive office chair built for all-day leadership comfort.",
    sku: "REV-CHR-009",
    status: "active",
    stock_quantity: 0,
    track_quantity: true,
    continue_selling: false,
    images: JSON.stringify(["/categories/office-chair.webp", "/products/chair.webp"]),
    tags: JSON.stringify(["executive chair", "office", "zenith"]),
    material: "Full-Grain PU Leather & Chrome Steel",
    color: "Jet Black",
    brand: "Revive Furniture",
    average_rating: 4.9,
    review_count: 28,
    is_featured: true,
    is_trending: true,
    is_best_seller: true,
    is_hot_selling: true,
    is_deal_of_day: true,
    is_latest: true,
    room_type_id: 3,
    room_type_name: "Office",
    room_type_slug: "office",
    category_id: 3,
    category_name: "Office",
    category_slug: "office",
    categories: [{ id: 3, name: "Office", slug: "office" }, { id: 5, name: "Chairs & Stools", slug: "chairs-stools" }],
    created_at: nowIso,
    updated_at: nowIso,
  },
  {
    id: 10,
    slug: "minimalist-studio-stool",
    name: "Minimalist Studio Stool",
    price: 16500,
    compare_price: null,
    description: null,
    short_description: "Compact counter and studio stool in natural ash.",
    sku: "REV-STL-010",
    status: "active",
    stock_quantity: 4,
    track_quantity: true,
    continue_selling: false,
    images: JSON.stringify(["/shop/products/chair.webp"]),
    tags: JSON.stringify([]),
    material: null,
    color: null,
    brand: null,
    average_rating: 0,
    review_count: 0,
    is_featured: false,
    is_trending: false,
    is_best_seller: false,
    is_hot_selling: false,
    is_deal_of_day: false,
    is_latest: true,
    room_type_id: null,
    room_type_name: null,
    room_type_slug: null,
    category_id: null,
    category_name: null,
    category_slug: null,
    categories: [],
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

const INITIAL_MOCK_ADMIN_USERS = [
  {
    id: "1",
    email: "admin@revivefurniture.com",
    name: "Admin User",
    role: "admin",
    password_hash: "$2b$10$qLu7RUKXE/S4HcBrrCyBb.kEiXCDC7S2kniK2pY5RdTvSwpNM3Q3y", // admin123
    is_active: true,
    last_login: null,
  },
]

interface MockDbState {
  products: any[]
  categories: any[]
  roomTypes: any[]
  blogPosts: any[]
  adminUsers: any[]
  nextProductId: number
}

const globalForMock = globalThis as unknown as { __reviveMockDb?: MockDbState }

function getMockDb(): MockDbState {
  if (!globalForMock.__reviveMockDb) {
    globalForMock.__reviveMockDb = {
      products: INITIAL_MOCK_PRODUCTS.map((p) => ({ ...p })),
      categories: MOCK_CATEGORIES.map((c) => ({ ...c })),
      roomTypes: MOCK_ROOM_TYPES.map((r) => ({ ...r })),
      blogPosts: MOCK_BLOG_POSTS.map((b) => ({ ...b })),
      adminUsers: INITIAL_MOCK_ADMIN_USERS.map((u) => ({ ...u })),
      nextProductId: 11,
    }
  }
  return globalForMock.__reviveMockDb
}

let warnedMock = false

function logMockWarning() {
  if (!warnedMock) {
    warnedMock = true
    console.warn("[AI Studio] DATABASE_URL is not set — using in-memory mock database.")
  }
}

function handleTaggedMutation(strings: TemplateStringsArray, values: any[]): any[] | null {
  const fullSql = strings.join("?").replace(/\s+/g, " ").trim()
  const lower = fullSql.toLowerCase()
  const db = getMockDb()

  // UPDATE products SET ... WHERE id = ?
  if (lower.startsWith("update products set")) {
    let whereId: any = null
    const updates: Record<string, any> = {}
    let inWhere = false

    for (let i = 0; i < values.length; i++) {
      const seg = strings[i]
      if (/\bwhere\b/i.test(seg)) {
        inWhere = true
      }
      const colMatch = seg.match(/(\w+)\s*=\s*$/i)
      if (colMatch) {
        const col = colMatch[1].toLowerCase()
        if (inWhere && col === "id") {
          whereId = values[i]
        } else if (!inWhere) {
          updates[col] = values[i]
        }
      }
    }

    if (whereId === null || whereId === undefined) return []
    const idx = db.products.findIndex((p) => String(p.id) === String(whereId))
    if (idx === -1) return []

    const existing = db.products[idx]
    const nextCategory = updates.category_id
      ? db.categories.find((c) => String(c.id) === String(updates.category_id))
      : null
    const nextRoomType = updates.room_type_id
      ? db.roomTypes.find((r) => String(r.id) === String(updates.room_type_id))
      : null

    const updated = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
      ...(updates.category_id !== undefined
        ? {
            category_name: nextCategory?.name || null,
            category_slug: nextCategory?.slug || null,
            categories: nextCategory ? [{ id: nextCategory.id, name: nextCategory.name, slug: nextCategory.slug }] : [],
          }
        : {}),
      ...(updates.room_type_id !== undefined
        ? {
            room_type_name: nextRoomType?.name || null,
            room_type_slug: nextRoomType?.slug || null,
          }
        : {}),
    }
    db.products[idx] = updated
    return [{ id: updated.id, slug: updated.slug, stock_quantity: updated.stock_quantity }]
  }

  // INSERT INTO products (...) VALUES (...)
  if (lower.startsWith("insert into products")) {
    const colListMatch = fullSql.match(/insert into products\s*\(([^)]+)\)/i)
    if (colListMatch) {
      const cols = colListMatch[1].split(",").map((c) => c.trim().toLowerCase())
      const record: Record<string, any> = {
        id: db.nextProductId++,
        average_rating: 0,
        review_count: 0,
        categories: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      cols.forEach((col, i) => {
        if (i < values.length) record[col] = values[i]
      })
      db.products.unshift(record)
      return [{ id: record.id, name: record.name, sku: record.sku, slug: record.slug }]
    }
  }

  // DELETE FROM products WHERE id = ?
  if (lower.startsWith("delete from products")) {
    const whereId = values[0]
    const idx = db.products.findIndex((p) => String(p.id) === String(whereId))
    if (idx === -1) return []
    const [removed] = db.products.splice(idx, 1)
    return [{ id: removed.id, slug: removed.slug }]
  }

  // UPDATE admin_users SET last_login = ... WHERE id = ?
  if (lower.startsWith("update admin_users")) {
    const whereId = values[values.length - 1]
    const admin = db.adminUsers.find((u) => String(u.id) === String(whereId))
    if (admin) {
      admin.last_login = new Date().toISOString()
    }
    return []
  }

  return null
}

function runMockQuery(queryText: string): any[] {
  logMockWarning()
  const db = getMockDb()

  const q = queryText.replace(/\s+/g, " ").trim()
  const qLower = q.toLowerCase()

  // Admin user authentication query
  if (qLower.includes("from admin_users")) {
    const emailMatch = q.match(/email\s*=\s*'([^']+)'/i)
    if (emailMatch) {
      return db.adminUsers.filter(
        (u) => u.email.toLowerCase() === emailMatch[1].toLowerCase() && u.is_active,
      )
    }
    return [...db.adminUsers]
  }

  if (qLower.includes("count(")) {
    let countVal = 0
    if (qLower.includes("from products")) countVal = db.products.length
    else if (qLower.includes("from categories")) countVal = db.categories.length
    else if (qLower.includes("from blog_posts")) countVal = db.blogPosts.length
    return [
      {
        count: String(countVal),
        total: String(countVal),
        unviewed_count: "0",
        total_orders: "0",
        total_revenue: "0",
        total_customers: "0",
        total_products: String(db.products.length),
      },
    ]
  }

  if (qLower.includes("sum(") && qLower.includes("from orders")) {
    return [{ total_revenue: "0", total_orders: "0", paid_amount: "0", pending_amount: "0", unpaid_amount: "0" }]
  }

  if (/^(insert|update|delete|create|alter|drop|truncate)\b/i.test(q)) {
    return []
  }

  // Category lookup (e.g., search route checking direct category match before product search)
  if (qLower.includes("from categories") && !qLower.includes("from products")) {
    const ilikeMatch = q.match(/name\s+ilike\s+'([^']+)'/i)
    if (ilikeMatch) {
      const needle = ilikeMatch[1].replace(/%/g, "").toLowerCase()
      const exact = !ilikeMatch[1].includes("%")
      return db.categories.filter((c) =>
        exact
          ? c.name.toLowerCase() === needle || c.slug.toLowerCase() === needle
          : c.name.toLowerCase().includes(needle) || c.slug.toLowerCase().includes(needle),
      )
    }
    return [...db.categories]
  }

  if (qLower.includes("from products")) {
    const slugMatch = q.match(/p\.slug\s*=\s*'([^']+)'/i) || q.match(/slug\s*=\s*'([^']+)'/i)
    if (slugMatch) {
      return db.products.filter(
        (p) => p.slug === slugMatch[1] && (!qLower.includes("p.status = 'active'") || p.status === "active"),
      )
    }

    const idMatch = q.match(/p\.id\s*=\s*'?(\d+)'?/i)
    if (idMatch) {
      return db.products.filter((p) => String(p.id) === idMatch[1])
    }

    let filtered = [...db.products]

    if (qLower.includes("p.status = 'active'")) {
      filtered = filtered.filter((p) => p.status === "active")
    }

    const catSlugMatch = q.match(/cat\.slug\s*=\s*'([^']+)'/i)
    if (catSlugMatch) {
      filtered = filtered.filter(
        (p) =>
          p.category_slug === catSlugMatch[1] ||
          (Array.isArray(p.categories) && p.categories.some((c: any) => c.slug === catSlugMatch[1])),
      )
    }

    const catIdMatch = q.match(/c\.id\s*=\s*'?(\d+)'?/i)
    if (catIdMatch) {
      filtered = filtered.filter(
        (p) =>
          String(p.category_id) === catIdMatch[1] ||
          (Array.isArray(p.categories) && p.categories.some((c: any) => String(c.id) === catIdMatch[1])),
      )
    }

    const roomSlugMatch = q.match(/rt\.slug\s*=\s*'([^']+)'/i)
    if (roomSlugMatch) {
      filtered = filtered.filter((p) => p.room_type_slug === roomSlugMatch[1])
    }

    const ilikeMatch = q.match(/ilike\s+'%([^%']+)%'/i)
    if (ilikeMatch) {
      const needle = ilikeMatch[1].toLowerCase()
      filtered = filtered.filter((p) => {
        const hay = [
          p.name,
          p.description,
          p.short_description,
          p.sku,
          p.material,
          p.color,
          p.brand,
          p.category_name,
          p.room_type_name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
        return hay.includes(needle)
      })
    }

    if (qLower.includes("is_trending = true")) filtered = filtered.filter((p) => p.is_trending)
    if (qLower.includes("is_deal_of_day = true")) filtered = filtered.filter((p) => p.is_deal_of_day)
    if (qLower.includes("is_best_seller = true")) filtered = filtered.filter((p) => p.is_best_seller)
    if (qLower.includes("is_featured = true")) filtered = filtered.filter((p) => p.is_featured)
    if (qLower.includes("is_hot_selling = true")) filtered = filtered.filter((p) => p.is_hot_selling)
    if (qLower.includes("is_latest = true")) filtered = filtered.filter((p) => p.is_latest)

    const limitMatch = q.match(/limit\s+(\d+)/i)
    if (limitMatch) {
      const limit = Number.parseInt(limitMatch[1], 10)
      if (Number.isFinite(limit) && limit > 0) {
        filtered = filtered.slice(0, limit)
      }
    }

    return filtered
  }

  if (qLower.includes("from categories")) {
    return [...db.categories]
  }

  if (qLower.includes("from room_type")) {
    return [...db.roomTypes]
  }

  if (qLower.includes("from blog_posts")) {
    const slugMatch = q.match(/slug\s*=\s*'([^']+)'/i)
    if (slugMatch) {
      return db.blogPosts.filter((b) => b.slug === slugMatch[1])
    }
    return [...db.blogPosts]
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
    logMockWarning()
    const handled = handleTaggedMutation(strings, values)
    if (handled !== null) {
      return handled
    }
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
