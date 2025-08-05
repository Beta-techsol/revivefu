"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, Download, FileText, CheckCircle, AlertCircle, X, Plus, Loader2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AdvancedCSVParser, ProductDataNormalizer, type ParsedCSVRow } from "@/lib/csv-parser"

interface ProcessedProduct {
  name: string
  description: string
  short_description: string
  price: number
  regular_price: number
  sale_price?: number
  category: string
  categories: string[]
  stock_quantity: number
  in_stock: boolean
  images: string[]
  sku: string
  weight?: number
  featured: boolean
  status: string
  tags: string[]
  assignedFlags?: string[]
  processingStatus?: "success" | "error" | "skipped"
  error?: string
  createdCategory?: boolean
}

interface UploadResult {
  totalProcessed: number
  successful: number
  failed: number
  skipped: number
  categoriesCreated: string[]
  results: ProcessedProduct[]
}

export default function AdminUploadPage() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [csvData, setCsvData] = useState<ProcessedProduct[]>([])
  const [rawCsvData, setRawCsvData] = useState<ParsedCSVRow[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [uploadResults, setUploadResults] = useState<UploadResult | null>(null)
  const [currentStep, setCurrentStep] = useState<string>("")
  const [showRawData, setShowRawData] = useState(false)

  const sampleCSV = `ID,Type,SKU,Name,Published,Is featured?,Visibility in catalog,Short description,Description,Date sale price starts,Date sale price ends,Tax status,Tax class,In stock?,Stock,Low stock amount,Backorders allowed?,Sold individually?,Weight (kg),Length (cm),Width (cm),Height (cm),Allow customer reviews?,Purchase note,Sale price,Regular price,Categories,Tags,Shipping class,Images,Download limit,Download expiry days,Parent,Grouped products,Upsells,Cross-sells,External URL,Button text,Position
1,simple,SOF-001,Modern Sectional Sofa,1,1,visible,Premium sectional sofa,Comfortable 3-seat sectional sofa with premium fabric upholstery,,,taxable,,1,15,,,0,45.5,200,90,85,1,,119999,129999,"Living Room, Sofas",,,"https://example.com/sofa1.jpg, https://example.com/sofa2.jpg",,,,,,,,0
2,simple,CHR-001,Ergonomic Office Chair,1,0,visible,Ergonomic office chair,Adjustable office chair with lumbar support and breathable mesh,,,taxable,,1,8,,,0,12.3,65,65,120,1,,54999,59999,"Office, Chairs",,,"https://example.com/chair1.jpg",,,,,,,,0`

  const downloadSampleCSV = () => {
    const blob = new Blob([sampleCSV], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "woocommerce-sample-products.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const assignIntelligentFlags = (product: ProcessedProduct): string[] => {
    const flags: string[] = []
    const name = product.name.toLowerCase()
    const price = product.price
    const stock = product.stock_quantity

    // Check if already featured
    if (product.featured) {
      flags.push("Featured")
    }

    // High stock or premium keywords
    if (stock > 20 || name.includes("premium") || name.includes("luxury") || name.includes("professional")) {
      flags.push("Best Seller")
    }

    // Gaming, modern, or trending keywords
    if (name.includes("gaming") || name.includes("modern") || name.includes("smart") || name.includes("rgb")) {
      flags.push("Trending")
    }

    // High-value items
    if (price > 100000) {
      flags.push("Featured")
    }

    // Sale items or hot deals
    if (product.sale_price && product.sale_price < product.regular_price) {
      flags.push("Hot Deal")
    }

    // Default to Latest if no other flags
    if (flags.length === 0) {
      flags.push("Latest")
    }

    return [...new Set(flags)] // Remove duplicates
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

  const validateProduct = (product: ProcessedProduct): { isValid: boolean; error?: string } => {
    if (!product.name || product.name.trim() === "") {
      return { isValid: false, error: "Product name is required" }
    }
    if (!product.price || product.price <= 0) {
      return { isValid: false, error: "Valid price is required" }
    }
    if (!product.category || product.category.trim() === "") {
      return { isValid: false, error: "Category is required" }
    }
    return { isValid: true }
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
        console.log("Starting CSV parsing...")

        // Use advanced CSV parser
        const parser = new AdvancedCSVParser()
        const normalizer = new ProductDataNormalizer()

        const rawData = parser.parse(text)
        setRawCsvData(rawData)

        console.log("Raw parsed data sample:", rawData.slice(0, 3))

        // Normalize the data
        const processedData: ProcessedProduct[] = rawData
          .map((row) => {
            const normalized = normalizer.normalize(row)

            // Assign intelligent flags
            const flags = assignIntelligentFlags(normalized)

            // Handle missing images
            const images =
              normalized.images.length > 0
                ? normalized.images
                : [getStockImageUrl(normalized.category, normalized.name)]

            return {
              ...normalized,
              images,
              assignedFlags: flags,
            }
          })
          .filter((product) => product.name && product.name.trim() !== "")

        console.log("Processed data sample:", processedData.slice(0, 3))

        setCsvData(processedData)
        setShowPreview(true)

        toast({
          title: "CSV Parsed Successfully",
          description: `Found ${processedData.length} valid products to import`,
        })
      } catch (error) {
        console.error("CSV Parse Error:", error)
        toast({
          title: "Parse Error",
          description: error instanceof Error ? error.message : "Failed to parse CSV file",
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
      // Prepare products data for API
      const productsToUpload = csvData.map((product) => ({
        name: product.name,
        description: product.description || `${product.name} - High quality furniture piece`,
        short_description: product.short_description || `${product.name} - Premium quality`,
        sku: product.sku,
        price: product.price,
        compare_price: product.sale_price ? product.regular_price : null,
        category: product.category,
        stock_quantity: product.stock_quantity,
        images: product.images,
        status: product.status,
        is_featured: product.assignedFlags?.includes("Featured") || false,
        is_trending: product.assignedFlags?.includes("Trending") || false,
        is_best_seller: product.assignedFlags?.includes("Best Seller") || false,
        is_hot_selling: product.assignedFlags?.includes("Hot Deal") || false,
        is_deal_of_day: product.assignedFlags?.includes("Hot Deal") || false,
        is_latest: product.assignedFlags?.includes("Latest") || false,
        room_type: product.category.toLowerCase().replace(/\s+/g, "_"),
        material: null,
        color: null,
        brand: null,
        weight: product.weight || null,
        tags: product.assignedFlags || [],
      }))

      setCurrentStep("Uploading products to database...")
      setUploadProgress(50)

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
    setRawCsvData([])
    setShowPreview(false)
    setUploadResults(null)
    setUploadProgress(0)
    setCurrentStep("")
    setShowRawData(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-montserrat">Advanced Bulk Product Upload</h1>
        <p className="text-gray-600 font-poppins">
          Upload WooCommerce CSV exports with intelligent parsing and flag assignment
        </p>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-montserrat">Advanced CSV Processing Features</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="features">Smart Features</TabsTrigger>
              <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
              <TabsTrigger value="format">Sample Format</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 font-poppins">🧠 Intelligent Processing:</h3>
                  <ul className="text-sm text-gray-600 space-y-1 font-poppins">
                    <li>
                      • <strong>Auto-Delimiter Detection:</strong> Handles comma, semicolon, tab delimiters
                    </li>
                    <li>
                      • <strong>Quoted Field Support:</strong> Properly parses quoted fields with commas
                    </li>
                    <li>
                      • <strong>Field Mapping:</strong> Auto-maps 40+ WooCommerce field variations
                    </li>
                    <li>
                      • <strong>Data Validation:</strong> Validates and cleans all product data
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 font-poppins">🎯 Smart Assignments:</h3>
                  <ul className="text-sm text-gray-600 space-y-1 font-poppins">
                    <li>
                      • <strong>Flag Intelligence:</strong> Auto-assigns product flags based on data
                    </li>
                    <li>
                      • <strong>Category Creation:</strong> Creates missing categories automatically
                    </li>
                    <li>
                      • <strong>SKU Generation:</strong> Generates unique SKUs when missing
                    </li>
                    <li>
                      • <strong>Image Handling:</strong> Uses stock images for missing product images
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="compatibility" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 font-poppins">✅ Supported Formats:</h3>
                  <ul className="text-sm text-gray-600 space-y-1 font-poppins">
                    <li>
                      • <strong>WooCommerce Export:</strong> Direct compatibility with all versions
                    </li>
                    <li>
                      • <strong>Shopify Export:</strong> Handles Shopify CSV format
                    </li>
                    <li>
                      • <strong>Custom CSV:</strong> Any CSV with product data
                    </li>
                    <li>
                      • <strong>Excel Export:</strong> CSV exports from Excel/Google Sheets
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 font-poppins">🔧 Field Recognition:</h3>
                  <ul className="text-sm text-gray-600 space-y-1 font-poppins">
                    <li>
                      • <strong>Product Names:</strong> Name, Title, Product Name
                    </li>
                    <li>
                      • <strong>Pricing:</strong> Price, Regular Price, Sale Price
                    </li>
                    <li>
                      • <strong>Categories:</strong> Categories, Category, Product Category
                    </li>
                    <li>
                      • <strong>Stock:</strong> Stock, Stock Quantity, Inventory
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="format" className="space-y-4">
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  Download the WooCommerce-compatible sample CSV to see the exact format. Supports all standard
                  WooCommerce export fields.
                </AlertDescription>
              </Alert>
              <Button onClick={downloadSampleCSV} variant="outline" className="bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download WooCommerce Sample CSV
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
              <p className="text-gray-600 mb-4 font-poppins">Supports WooCommerce, Shopify, and custom CSV formats</p>
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
                <Button
                  onClick={() => setShowRawData(!showRawData)}
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showRawData ? "Hide" : "Show"} Raw Data
                </Button>
                <Button onClick={resetUpload} variant="outline" className="bg-transparent">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={processUpload}
                  className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Start Advanced Import
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {showRawData && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Raw CSV Data (First 3 rows):</h4>
                <div className="text-xs font-mono bg-white p-2 rounded border overflow-x-auto">
                  <pre>{JSON.stringify(rawCsvData.slice(0, 3), null, 2)}</pre>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">Name</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">SKU</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">Price</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">Category</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">Stock</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">Images</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">Flags</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(0, 10).map((product, index) => {
                    const validation = validateProduct(product)

                    return (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2 px-3 font-poppins">{product.name}</td>
                        <td className="py-2 px-3 font-poppins text-xs">{product.sku}</td>
                        <td className="py-2 px-3 font-poppins">
                          ₨{product.price.toLocaleString()}
                          {product.sale_price && (
                            <div className="text-xs text-red-600">Sale: ₨{product.sale_price.toLocaleString()}</div>
                          )}
                        </td>
                        <td className="py-2 px-3 font-poppins">{product.category}</td>
                        <td className="py-2 px-3 font-poppins">{product.stock_quantity}</td>
                        <td className="py-2 px-3">
                          <Badge
                            variant={product.images[0]?.includes("placeholder") ? "secondary" : "outline"}
                            className="text-xs"
                          >
                            {product.images[0]?.includes("placeholder") ? "Stock" : "Custom"}
                          </Badge>
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex flex-wrap gap-1">
                            {product.assignedFlags?.map((flag, i) => (
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
              Processing Advanced Upload...
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
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">SKU</th>
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
                          <td className="py-2 px-3 font-poppins text-xs">{row.sku}</td>
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
