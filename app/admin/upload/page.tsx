"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Download, FileText, CheckCircle, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

interface CSVRow {
  name: string
  sku: string
  description: string
  price: string
  category: string
  imageUrl: string
  stock: string
  status?: "success" | "error"
  error?: string
}

export default function AdminUploadPage() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [csvData, setCsvData] = useState<CSVRow[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [uploadResults, setUploadResults] = useState<CSVRow[]>([])

  const sampleCSV = `name,sku,description,price,category,imageUrl,stock
Modern Sectional Sofa,SOF-001,Comfortable 3-seat sectional sofa,1299.99,Living Room,/shop/products/sofa-1.jpg,15
Ergonomic Office Chair,CHR-001,Adjustable office chair with lumbar support,599.99,Office,/shop/products/chair-1.jpg,8
Dining Table Set,TBL-001,6-person dining table with chairs,899.99,Dining Room,/shop/products/dining-table-1.jpg,12`

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
    const headers = lines[0].split(",").map((h) => h.trim())

    return lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim())
      const row: any = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ""
      })
      return row as CSVRow
    })
  }

  const validateRow = (row: CSVRow): { isValid: boolean; error?: string } => {
    if (!row.name) return { isValid: false, error: "Name is required" }
    if (!row.sku) return { isValid: false, error: "SKU is required" }
    if (!row.price || isNaN(Number.parseFloat(row.price))) return { isValid: false, error: "Valid price is required" }
    if (!row.category) return { isValid: false, error: "Category is required" }
    if (!row.stock || isNaN(Number.parseInt(row.stock)))
      return { isValid: false, error: "Valid stock number is required" }
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
        const parsed = parseCSV(text)
        setCsvData(parsed)
        setShowPreview(true)
        toast({
          title: "CSV Parsed Successfully",
          description: `Found ${parsed.length} products to import`,
          variant: "success",
        })
      } catch (error) {
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

    const results: CSVRow[] = []

    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i]
      const validation = validateRow(row)

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (validation.isValid) {
        results.push({ ...row, status: "success" })
      } else {
        results.push({ ...row, status: "error", error: validation.error })
      }

      setUploadProgress(((i + 1) / csvData.length) * 100)
    }

    setUploadResults(results)
    setIsUploading(false)

    const successCount = results.filter((r) => r.status === "success").length
    const errorCount = results.filter((r) => r.status === "error").length

    toast({
      title: "Upload Complete",
      description: `${successCount} products imported successfully, ${errorCount} failed`,
      variant: successCount > 0 ? "success" : "destructive",
    })
  }

  const resetUpload = () => {
    setCsvData([])
    setShowPreview(false)
    setUploadResults([])
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-montserrat">Bulk Product Upload</h1>
        <p className="text-gray-600 font-poppins">Upload multiple products using CSV file</p>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-montserrat">Upload Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 font-poppins">Required CSV Format:</h3>
                <ul className="text-sm text-gray-600 space-y-1 font-poppins">
                  <li>
                    • <strong>name</strong> - Product name
                  </li>
                  <li>
                    • <strong>sku</strong> - Unique product SKU
                  </li>
                  <li>
                    • <strong>description</strong> - Product description
                  </li>
                  <li>
                    • <strong>price</strong> - Product price (numeric)
                  </li>
                  <li>
                    • <strong>category</strong> - Product category
                  </li>
                  <li>
                    • <strong>imageUrl</strong> - Product image URL
                  </li>
                  <li>
                    • <strong>stock</strong> - Stock quantity (numeric)
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 font-poppins">Important Notes:</h3>
                <ul className="text-sm text-gray-600 space-y-1 font-poppins">
                  <li>• First row must contain column headers</li>
                  <li>• All required fields must be filled</li>
                  <li>• Price and stock must be valid numbers</li>
                  <li>• SKU must be unique for each product</li>
                  <li>• Maximum file size: 5MB</li>
                </ul>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={downloadSampleCSV} variant="outline" className="bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download Sample CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      {!showPreview && (
        <Card>
          <CardHeader>
            <CardTitle className="font-montserrat">Upload CSV File</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#C53D39] transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-poppins">Upload your CSV file</h3>
              <p className="text-gray-600 mb-4 font-poppins">Drag and drop your file here, or click to browse</p>
              <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      {showPreview && !isUploading && uploadResults.length === 0 && (
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
                  Import Products
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
                    <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">SKU</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">Price</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">Category</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">Stock</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(0, 10).map((row, index) => {
                    const validation = validateRow(row)
                    return (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2 px-3 font-poppins">{row.name}</td>
                        <td className="py-2 px-3 font-poppins">{row.sku}</td>
                        <td className="py-2 px-3 font-poppins">${row.price}</td>
                        <td className="py-2 px-3 font-poppins">{row.category}</td>
                        <td className="py-2 px-3 font-poppins">{row.stock}</td>
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
            <CardTitle className="font-montserrat">Processing Upload...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-600 text-center font-poppins">
                Processing {Math.round(uploadProgress)}% complete
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Results */}
      {uploadResults.length > 0 && (
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
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800 font-poppins">
                      {uploadResults.filter((r) => r.status === "success").length} Successful
                    </span>
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-800 font-poppins">
                      {uploadResults.filter((r) => r.status === "error").length} Failed
                    </span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">Name</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">SKU</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">Status</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-700 font-poppins">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadResults.map((row, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2 px-3 font-poppins">{row.name}</td>
                        <td className="py-2 px-3 font-poppins">{row.sku}</td>
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
                          {row.status === "success" ? "Product imported successfully" : row.error}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
