"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, Download, FileText, CheckCircle, AlertCircle, X, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CSVRow {
  name: string
  description: string
  short_description?: string
  price: string
  regular_price?: string
  sale_price?: string
  category: string
  categories?: string
  stock: string
  stock_quantity?: string
  manage_stock?: string
  in_stock?: string
  sku?: string
  images?: string
  image_url?: string
  weight?: string
  length?: string
  width?: string
  height?: string
  status?: "success" | "error" | "skipped"
  error?: string
  assignedFlags?: string[]
  createdCategory?: boolean
  [key: string]: any // For dynamic WooCommerce fields
}

interface UploadResult {
  totalProcessed: number
  successful: number
  failed: number
  skipped: number
  categoriesCreated: string[]
  results: CSVRow[]
}

export default function AdminUploadPage() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [csvData, setCsvData] = useState<CSVRow[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [uploadResults, setUploadResults] = useState<UploadResult | null>(null)
  const [currentStep, setCurrentStep] = useState<string>("")

  const sampleCSV = `name,description,short_description,price,regular_price,category,categories,stock_quantity,manage_stock,in_stock,sku,images,weight
Modern Sectional Sofa,Comfortable 3-seat sectional sofa with premium fabric upholstery,Premium sectional sofa,129999,129999,Living Room,"Living Room, Sofas",15,yes,1,SOF-001,/shop/products/sofa-1.jpg,45.5
Ergonomic Office Chair,Adjustable office chair with lumbar support and breathable mesh,Ergonomic office chair,59999,59999,Office,"Office, Chairs",8,yes,1,CHR-001,/shop/products/chair-1.jpg,12.3
Dining Table Set,6-person dining table with matching chairs in solid wood,Solid wood dining set,89999,89999,Dining Room,"Dining Room, Tables",12,yes,1,TBL-001,/shop/products/dining-table-1.jpg,85.0
Gaming Chair Pro,High-back gaming chair with RGB lighting and premium padding,Gaming chair with RGB,45999,45999,Gaming,"Gaming, Chairs",20,yes,1,GAM-001,,18.7
Coffee Table Modern,Minimalist coffee table with hidden storage compartment,Modern coffee table,25999,25999,Living Room,"Living Room, Tables",25,yes,1,COF-001,/shop/products/coffee-table-1.jpg,22.1`

  const downloadSampleCSV = () => {
    const blob = new Blob([sampleCSV], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sample-products.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const parseCSV = (text: string): CSVRow[] => {
    const lines = text.trim().split("\n")
    if (lines.length < 2) return []

    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
    console.log("CSV Headers:", headers)

    return lines
      .slice(1)
      .map((line, index) => {
        // Handle CSV with quoted fields that may contain commas
        const values = []
        let current = ""
        let inQuotes = false

        for (let i = 0; i < line.length; i++) {
          const char = line[i]
          if (char === '"') {
            inQuotes = !inQuotes
          } else if (char === "," && !inQuotes) {
            values.push(current.trim())
            current = ""
          } else {
            current += char
          }
        }
        values.push(current.trim()) // Add the last value

        const row: any = {}
        headers.forEach((header, index) => {
          const value = values[index] || ""
          row[header] = value.replace(/^"|"$/g, "") // Remove surrounding quotes
        })

        // Map WooCommerce fields to our format
        return {
          name: row.Name || row.name || row.Title || row.title || "",
          description: row.Description || row.description || row["Long description"] || "",
          short_description: row["Short description"] || row.short_description || row.excerpt || "",
          price: row.Price || row.price || row["Regular price"] || row.regular_price || "0",
          regular_price: row["Regular price"] || row.regular_price || row.Price || row.price || "0",
          sale_price: row["Sale price"] || row.sale_price || "",
          category: row.Categories || row.categories || row.Category || row.category || "Uncategorized",
          categories: row.Categories || row.categories || row.Category || row.category || "",
          stock: row["Stock quantity"] || row.stock_quantity || row.Stock || row.stock || "0",
          stock_quantity: row["Stock quantity"] || row.stock_quantity || row.Stock || row.stock || "0",
          manage_stock: row["Manage stock?"] || row.manage_stock || "yes",
          in_stock: row["In stock?"] || row.in_stock || "1",
          sku: row.SKU || row.sku || "",
          images: row.Images || row.images || row.Image || row.image || "",
          image_url: row.Images || row.images || row.Image || row.image || "",
          weight: row.Weight || row.weight || "",
          length: row.Length || row.length || "",
          width: row.Width || row.width || "",
          height: row.Height || row.height || "",
          ...row, // Include all other fields
        } as CSVRow
      })
      .filter((row) => row.name) // Filter out rows without names
  }

  const validateRow = (row: CSVRow): { isValid: boolean; error?: string } => {
    if (!row.name || row.name.trim() === "") return { isValid: false, error: "Product name is required" }
    if (!row.price || isNaN(Number.parseFloat(row.price))) return { isValid: false, error: "Valid price is required" }
    if (!row.category || row.category.trim() === "") return { isValid: false, error: "Category is required" }

    const stockQty = row.stock_quantity || row.stock || "0"
    if (isNaN(Number.parseInt(stockQty))) return { isValid: false, error: "Valid stock quantity is required" }

    return { isValid: true }
  }

  const assignIntelligentFlags = (row: CSVRow): string[] => {
    const flags: string[] = []
    const name = row.name.toLowerCase()
    const category = row.category.toLowerCase()
    const price = Number.parseFloat(row.price)
    const stock = Number.parseInt(row.stock_quantity || row.stock || "0")

    // Intelligent flag assignment based on product data
    if (stock > 20 || name.includes("premium") || name.includes("luxury") || name.includes("professional")) {
      flags.push("Best Seller")
    }

    if (name.includes("gaming") || name.includes("modern") || name.includes("smart") || name.includes("rgb")) {
      flags.push("Trending")
    }

    if (price > 100000) {
      flags.push("Featured")
    }

    if (
      name.includes("sale") ||
      name.includes("deal") ||
      (row.sale_price && Number.parseFloat(row.sale_price) < price)
    ) {
      flags.push("Hot Deal")
    }

    // Default to Latest if no other flags
    if (flags.length === 0) {
      flags.push("Latest")
    }

    return flags
  }

  const getStockImageUrl = (category: string, name: string): string => {
    const categoryLower = category.toLowerCase()
    const nameLower = name.toLowerCase()

    if (categoryLower.includes("sofa") || categoryLower.includes("living")) {
      return "/shop/products/sofa-1.jpg"
    } else if (categoryLower.includes("chair") || categoryLower.includes("office")) {
      return "/shop/products/chair-1.jpg"
    } else if (categoryLower.includes("dining") || categoryLower.includes("table")) {
      return "/shop/products/dining-table-1.jpg"
    } else if (categoryLower.includes("bed") || categoryLower.includes("bedroom")) {
      return "/shop/products/bed-1.jpg"
    } else if (nameLower.includes("coffee") || nameLower.includes("coffee table")) {
      return "/shop/products/coffee-table-1.jpg"
    } else if (categoryLower.includes("storage") || nameLower.includes("wardrobe")) {
      return "/shop/products/wardrobe-1.jpg"
    }

    return "/placeholder.jpg"
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      try {
        const parsed = parseCSV(text)
        console.log("Parsed CSV data:", parsed.slice(0, 3)) // Log first 3 rows
        setCsvData(parsed)
        setShowPreview(true)
        toast({
          title: "CSV Parsed Successfully",
          description: `Found ${parsed.length} products to import`,
        })
      } catch (error) {
        console.error("CSV Parse Error:", error)
        toast({
          title: "Parse Error",
          description: "Failed to parse CSV file. Please check the format.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  const processUpload = async () => {
    setIsUploading(true)
    setUploadProgress(0)
    setCurrentStep("Preparing products for upload...")

    try {
      // Prepare products data
      const productsToUpload = csvData.map((row) => {
        const flags = assignIntelligentFlags(row)
        const imageUrl = row.images || row.image_url || getStockImageUrl(row.category, row.name)

        // Extract main category from categories string
        const mainCategory =
          row.category.split(",")[0].trim() || row.categories?.split(",")[0].trim() || "Uncategorized"

        return {
          name: row.name,
          description: row.description || row.short_description || `${row.name} - High quality furniture piece`,
          short_description:
            row.short_description || row.description?.substring(0, 200) || `${row.name} - Premium quality`,
          sku:
            row.sku ||
            `${mainCategory.toUpperCase().replace(/\s+/g, "")}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          price: Number.parseFloat(row.price),
          compare_price: row.sale_price ? Number.parseFloat(row.regular_price || row.price) : null,
          category: mainCategory,
          stock_quantity: Number.parseInt(row.stock_quantity || row.stock || "0"),
          images: imageUrl ? [imageUrl] : ["/placeholder.jpg"],
          status: "active",
          is_featured: flags.includes("Featured"),
          is_trending: flags.includes("Trending"),
          is_best_seller: flags.includes("Best Seller"),
          is_hot_selling: flags.includes("Hot Deal"),
          is_deal_of_day: flags.includes("Hot Deal"),
          is_latest: flags.includes("Latest"),
          room_type: mainCategory.toLowerCase().replace(/\s+/g, "_"),
          material: row.material || null,
          color: row.color || null,
          brand: row.brand || null,
          weight: row.weight ? Number.parseFloat(row.weight) : null,
          tags: flags,
        }
      })

      setCurrentStep("Uploading products to database...")

      // Call the bulk upload API
      const response = await fetch("/api/admin/products/bulk-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: productsToUpload }),
      })

      const result = await response.json()

      if (result.success) {
        setUploadResults(result.data)
        setCurrentStep("Upload completed successfully!")
        toast({
          title: "Upload Complete",
          description: `${result.data.successful} products imported successfully, ${result.data.failed} failed`,
        })
      } else {
        throw new Error(result.error || "Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload products",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(100)
    }
  }

  const resetUpload = () => {
    setCsvData([])
    setShowPreview(false)
    setUploadResults(null)
    setUploadProgress(0)
    setCurrentStep("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-montserrat">Intelligent Bulk Product Upload</h1>
        <p className="text-gray-600 font-poppins">
          Upload multiple products using CSV with intelligent flag assignment
        </p>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-montserrat">Upload Instructions & Features</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="instructions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
              <TabsTrigger value="intelligent">Intelligent Features</TabsTrigger>
              <TabsTrigger value="format">CSV Format</TabsTrigger>
            </TabsList>

            <TabsContent value="instructions" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 font-poppins">Supported CSV Formats:</h3>
                  <ul className="text-sm text-gray-600 space-y-1 font-poppins">
                    <li>
                      • <strong>WooCommerce Export</strong> - Direct compatibility
                    </li>
                    <li>
                      • <strong>Custom Format</strong> - Using our sample template
                    </li>
                    <li>
                      • <strong>Mixed Headers</strong> - Automatically mapped
                    </li>
                    <li>
                      • <strong>Quoted Fields</strong> - Handles commas in descriptions
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 font-poppins">Key Features:</h3>
                  <ul className="text-sm text-gray-600 space-y-1 font-poppins">
                    <li>
                      • <strong>Auto SKU Generation</strong> - If not provided
                    </li>
                    <li>
                      • <strong>Category Creation</strong> - Creates missing categories
                    </li>
                    <li>
                      • <strong>Image Handling</strong> - Stock images for missing ones
                    </li>
                    <li>
                      • <strong>Error Recovery</strong> - Continues on individual failures
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="intelligent" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 font-poppins">🤖 Intelligent Flag Assignment:</h3>
                  <ul className="text-sm text-gray-600 space-y-1 font-poppins">
                    <li>
                      • <strong>Best Seller:</strong> High stock &gt;20 or premium keywords
                    </li>
                    <li>
                      • <strong>Trending:</strong> Gaming, modern, smart, RGB products
                    </li>
                    <li>
                      • <strong>Featured:</strong> High-value items &gt;₨100,000
                    </li>
                    <li>
                      • <strong>Hot Deal:</strong> Sale items or products with sale prices
                    </li>
                    <li>
                      • <strong>Latest:</strong> Default for unmatched products
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 font-poppins">🔧 WooCommerce Compatibility:</h3>
                  <ul className="text-sm text-gray-600 space-y-1 font-poppins">
                    <li>
                      • <strong>Field Mapping:</strong> Auto-maps WooCommerce fields
                    </li>
                    <li>
                      • <strong>Price Handling:</strong> Regular/Sale price support
                    </li>
                    <li>
                      • <strong>Stock Management:</strong> Handles stock status
                    </li>
                    <li>
                      • <strong>Category Parsing:</strong> Supports comma-separated categories
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="format" className="space-y-4">
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  Download the sample CSV file to see the exact format. Supports both WooCommerce exports and custom
                  formats.
                </AlertDescription>
              </Alert>
              <Button onClick={downloadSampleCSV} variant="outline" className="bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download Sample CSV
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* File Upload */}
      {!showPreview && !uploadResults && (
        <Card>
          <CardHeader>
            <CardTitle className="font-montserrat">Upload CSV File</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#C53D39] transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">Upload your CSV file</h3>
              <p className="text-gray-600 mb-4 font-poppins">Supports WooCommerce exports and custom formats</p>
              <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                Choose CSV File
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      {showPreview && !isUploading && !uploadResults && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-montserrat">Preview ({csvData.length} products)</CardTitle>
              <div className="space-x-2">
                <Button onClick={resetUpload} variant="outline" className="bg-transparent">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={processUpload}
                  className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Start Intelligent Import
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">Name</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">Price</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">Category</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">Stock</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">Image</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">Predicted Flags</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(0, 10).map((row, index) => {
                    const validation = validateRow(row)
                    const predictedFlags = assignIntelligentFlags(row)
                    const imageUrl = row.images || row.image_url || getStockImageUrl(row.category, row.name)

                    return (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2 px-3 font-poppins">{row.name}</td>
                        <td className="py-2 px-3 font-poppins">
                          ₨{Number.parseFloat(row.price || "0").toLocaleString()}
                        </td>
                        <td className="py-2 px-3 font-poppins">{row.category.split(",")[0].trim()}</td>
                        <td className="py-2 px-3 font-poppins">{row.stock_quantity || row.stock}</td>
                        <td className="py-2 px-3">
                          {!(row.images || row.image_url) ? (
                            <Badge variant="secondary" className="text-xs">
                              Stock Image
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Custom
                            </Badge>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex flex-wrap gap-1">
                            {predictedFlags.map((flag, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {flag}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          {validation.isValid ? (
                            <span className="text-green-600 text-xs">✓ Valid</span>
                          ) : (
                            <span className="text-red-600 text-xs">✗ {validation.error}</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {csvData.length > 10 && (
                <p className="text-sm text-gray-500 mt-2 font-poppins">
                  Showing first 10 rows. {csvData.length - 10} more rows will be processed.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <Card>
          <CardHeader>
            <CardTitle className="font-montserrat flex items-center">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing Intelligent Upload...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={uploadProgress} className="w-full" />
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600 font-poppins">{Math.round(uploadProgress)}% complete</p>
                <p className="text-xs text-gray-500 font-poppins">{currentStep}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Results */}
      {uploadResults && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-montserrat">Upload Results</CardTitle>
              <Button onClick={resetUpload} variant="outline" className="bg-transparent">
                Upload Another File
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-blue-800">{uploadResults.totalProcessed}</p>
                      <p className="text-sm text-blue-600 font-poppins">Total Processed</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-800">{uploadResults.successful}</p>
                      <p className="text-sm text-green-600 font-poppins">Successful</p>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-2xl font-bold text-red-800">{uploadResults.failed}</p>
                      <p className="text-sm text-red-600 font-poppins">Failed</p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Plus className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold text-purple-800">{uploadResults.categoriesCreated.length}</p>
                      <p className="text-sm text-purple-600 font-poppins">Categories Created</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories Created */}
              {uploadResults.categoriesCreated.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 font-poppins">New Categories Created:</h3>
                  <div className="flex flex-wrap gap-2">
                    {uploadResults.categoriesCreated.map((category, index) => (
                      <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Results */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 font-poppins">Detailed Results:</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">Product</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">Category</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">Assigned Flags</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">Status</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadResults.results.slice(0, 20).map((row, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-2 px-3 font-poppins">{row.name}</td>
                          <td className="py-2 px-3 font-poppins">
                            {row.category}
                            {row.createdCategory && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                New
                              </Badge>
                            )}
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex flex-wrap gap-1">
                              {row.assignedFlags?.map((flag, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {flag}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="py-2 px-3">
                            {row.status === "success" ? (
                              <span className="flex items-center space-x-1 text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-xs">Success</span>
                              </span>
                            ) : (
                              <span className="flex items-center space-x-1 text-red-600">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-xs">Error</span>
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-xs text-gray-600 font-poppins">
                            {row.status === "success"
                              ? `Product imported with ${row.assignedFlags?.length || 0} flags`
                              : row.error}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {uploadResults.results.length > 20 && (
                    <p className="text-sm text-gray-500 mt-2 font-poppins">
                      Showing first 20 results. Total: {uploadResults.results.length} products processed.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
