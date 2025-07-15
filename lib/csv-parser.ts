// Advanced CSV parser that can handle complex WooCommerce formats
export interface ParsedCSVRow {
  [key: string]: string
}

export class AdvancedCSVParser {
  private detectDelimiter(text: string): string {
    const sample = text.split("\n")[0] // Use first line to detect delimiter
    const delimiters = [",", ";", "\t", "|"]
    let maxCount = 0
    let bestDelimiter = ","

    for (const delimiter of delimiters) {
      const count = (sample.match(new RegExp(`\\${delimiter}`, "g")) || []).length
      if (count > maxCount) {
        maxCount = count
        bestDelimiter = delimiter
      }
    }

    return bestDelimiter
  }

  private parseCSVLine(line: string, delimiter: string): string[] {
    const result: string[] = []
    let current = ""
    let inQuotes = false
    let quoteChar = ""

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const nextChar = line[i + 1]

      if (!inQuotes) {
        if (char === '"' || char === "'") {
          inQuotes = true
          quoteChar = char
        } else if (char === delimiter) {
          result.push(current.trim())
          current = ""
        } else {
          current += char
        }
      } else {
        if (char === quoteChar) {
          if (nextChar === quoteChar) {
            // Escaped quote
            current += char
            i++ // Skip next character
          } else {
            // End of quoted section
            inQuotes = false
            quoteChar = ""
          }
        } else {
          current += char
        }
      }
    }

    result.push(current.trim())
    return result
  }

  private normalizeHeaders(headers: string[]): string[] {
    return headers.map((header) => {
      // Remove quotes and clean up
      const cleaned = header.replace(/^["']|["']$/g, "").trim()

      // Handle common WooCommerce field variations
      const fieldMappings: { [key: string]: string } = {
        ID: "id",
        Type: "type",
        SKU: "sku",
        Name: "name",
        Published: "published",
        "Is featured?": "featured",
        "Visibility in catalog": "visibility",
        "Short description": "short_description",
        Description: "description",
        "Date sale price starts": "sale_start_date",
        "Date sale price ends": "sale_end_date",
        "Tax status": "tax_status",
        "Tax class": "tax_class",
        "In stock?": "in_stock",
        Stock: "stock_quantity",
        "Low stock amount": "low_stock_amount",
        "Backorders allowed?": "backorders",
        "Sold individually?": "sold_individually",
        "Weight (kg)": "weight",
        "Length (cm)": "length",
        "Width (cm)": "width",
        "Height (cm)": "height",
        "Allow customer reviews?": "reviews_allowed",
        "Purchase note": "purchase_note",
        "Sale price": "sale_price",
        "Regular price": "regular_price",
        Categories: "categories",
        Tags: "tags",
        "Shipping class": "shipping_class",
        Images: "images",
        "Download limit": "download_limit",
        "Download expiry days": "download_expiry",
        Parent: "parent",
        "Grouped products": "grouped_products",
        Upsells: "upsells",
        "Cross-sells": "cross_sells",
        "External URL": "external_url",
        "Button text": "button_text",
        Position: "position",
        "Attribute 1 name": "attribute_1_name",
        "Attribute 1 value(s)": "attribute_1_values",
        "Attribute 1 visible": "attribute_1_visible",
        "Attribute 1 global": "attribute_1_global",
        "Meta: _wpcom_is_markdown": "meta_wpcom_is_markdown",
      }

      return (
        fieldMappings[cleaned] ||
        cleaned
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^a-z0-9_]/g, "")
      )
    })
  }

  public parse(csvText: string): ParsedCSVRow[] {
    if (!csvText || csvText.trim().length === 0) {
      throw new Error("CSV text is empty")
    }

    // Detect delimiter
    const delimiter = this.detectDelimiter(csvText)
    console.log("Detected delimiter:", delimiter)

    // Split into lines
    const lines = csvText.split("\n").filter((line) => line.trim().length > 0)

    if (lines.length < 2) {
      throw new Error("CSV must have at least a header row and one data row")
    }

    // Parse header
    const rawHeaders = this.parseCSVLine(lines[0], delimiter)
    const headers = this.normalizeHeaders(rawHeaders)

    console.log("Raw headers:", rawHeaders.slice(0, 10))
    console.log("Normalized headers:", headers.slice(0, 10))

    // Parse data rows
    const results: ParsedCSVRow[] = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line.length === 0) continue

      try {
        const values = this.parseCSVLine(line, delimiter)
        const row: ParsedCSVRow = {}

        headers.forEach((header, index) => {
          row[header] = values[index] || ""
        })

        // Only add rows that have meaningful data
        if (row.name || row.id || row.sku) {
          results.push(row)
        }
      } catch (error) {
        console.warn(`Error parsing line ${i + 1}:`, error)
        continue
      }
    }

    console.log(`Parsed ${results.length} valid rows from ${lines.length - 1} total rows`)
    return results
  }
}

// Product data normalizer for WooCommerce data
export class ProductDataNormalizer {
  public normalize(csvRow: ParsedCSVRow): any {
    // Extract main category from categories string
    const categoriesString = csvRow.categories || csvRow.category || ""
    const categories = categoriesString
      .split(",")
      .map((cat) => cat.trim())
      .filter((cat) => cat.length > 0)
    const mainCategory = categories[0] || "Uncategorized"

    // Handle price fields
    const regularPrice = this.parsePrice(csvRow.regular_price || csvRow.price || "0")
    const salePrice = this.parsePrice(csvRow.sale_price || "")
    const finalPrice = salePrice > 0 ? salePrice : regularPrice

    // Handle stock
    const stockQuantity = this.parseNumber(csvRow.stock_quantity || csvRow.stock || "0")
    const inStock = csvRow.in_stock === "1" || csvRow.in_stock?.toLowerCase() === "yes" || stockQuantity > 0

    // Handle images
    const imagesString = csvRow.images || csvRow.image || ""
    const images = imagesString
      .split(",")
      .map((img) => img.trim())
      .filter((img) => img.length > 0)

    // Generate SKU if missing
    const sku = csvRow.sku || this.generateSKU(csvRow.name || "", mainCategory)

    return {
      name: csvRow.name || csvRow.title || "",
      description: csvRow.description || csvRow.long_description || "",
      short_description: csvRow.short_description || csvRow.excerpt || "",
      sku,
      price: finalPrice,
      regular_price: regularPrice,
      sale_price: salePrice > 0 ? salePrice : null,
      category: mainCategory,
      categories: categories,
      stock_quantity: stockQuantity,
      in_stock: inStock,
      images,
      weight: this.parseNumber(csvRow.weight || ""),
      length: this.parseNumber(csvRow.length || ""),
      width: this.parseNumber(csvRow.width || ""),
      height: this.parseNumber(csvRow.height || ""),
      featured: csvRow.featured === "1" || csvRow.featured?.toLowerCase() === "yes",
      visibility: csvRow.visibility || "visible",
      status: csvRow.published === "1" || csvRow.published?.toLowerCase() === "yes" ? "active" : "draft",
      tags: csvRow.tags ? csvRow.tags.split(",").map((tag) => tag.trim()) : [],
      meta: {
        tax_status: csvRow.tax_status || "taxable",
        tax_class: csvRow.tax_class || "",
        shipping_class: csvRow.shipping_class || "",
        reviews_allowed: csvRow.reviews_allowed !== "0",
        purchase_note: csvRow.purchase_note || "",
      },
    }
  }

  private parsePrice(priceString: string): number {
    if (!priceString) return 0
    // Remove currency symbols and parse
    const cleaned = priceString.replace(/[^\d.-]/g, "")
    const parsed = Number.parseFloat(cleaned)
    return isNaN(parsed) ? 0 : parsed
  }

  private parseNumber(numberString: string): number {
    if (!numberString) return 0
    const parsed = Number.parseFloat(numberString)
    return isNaN(parsed) ? 0 : parsed
  }

  private generateSKU(name: string, category: string): string {
    const namePrefix = name
      .substring(0, 3)
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
    const categoryPrefix = category
      .substring(0, 3)
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
    const timestamp = Date.now().toString().slice(-6)
    return `${categoryPrefix}${namePrefix}-${timestamp}`
  }
}
