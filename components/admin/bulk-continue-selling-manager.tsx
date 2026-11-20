"use client"

import { useState } from "react"
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  X,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface ScanResult {
  total: number
  enabledCount: number
  disabledCount: number
  allEnabled: boolean
  disabledProductIds: string[]
  disabledSample?: Array<{ id: string; name: string; sku: string; stock_quantity: number }>
}

interface BulkContinueSellingManagerProps {
  onSuccess?: () => void
}

export function BulkContinueSellingManager({ onSuccess }: BulkContinueSellingManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [updateProgress, setUpdateProgress] = useState(0)
  const [updatedCount, setUpdatedCount] = useState(0)
  const [statusMessage, setStatusMessage] = useState("")
  const [isCompleted, setIsCompleted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { toast } = useToast()

  const handleStartScan = async () => {
    setIsOpen(true)
    setIsScanning(true)
    setErrorMessage(null)
    setScanResult(null)
    setStatusMessage("Scanning all products across the entire database...")

    try {
      const response = await fetch("/api/admin/products/continue-selling", {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to scan products")
      }

      const result: ScanResult = {
        total: data.total || 0,
        enabledCount: data.enabledCount || 0,
        disabledCount: data.disabledCount || 0,
        allEnabled: Boolean(data.allEnabled),
        disabledProductIds: data.disabledProductIds || [],
        disabledSample: data.disabledSample || [],
      }

      setScanResult(result)

      if (result.allEnabled) {
        setIsCompleted(true)
        toast({
          title: "All Products Ready",
          description: "All products already have 'Continue selling when out of stock' enabled.",
        })
      }
    } catch (error) {
      console.error("Scan error:", error)
      const err = error instanceof Error ? error.message : "Failed to scan products"
      setErrorMessage(err)
      toast({
        title: "Scan Failed",
        description: err,
        variant: "destructive",
      })
    } finally {
      setIsScanning(false)
    }
  }

  const handleBulkEnable = async () => {
    if (!scanResult || scanResult.disabledProductIds.length === 0) return

    setIsUpdating(true)
    setErrorMessage(null)
    setUpdateProgress(0)
    setUpdatedCount(0)

    const idsToUpdate = [...scanResult.disabledProductIds]
    const totalToUpdate = idsToUpdate.length
    const batchSize = 25
    let processedSoFar = 0

    try {
      // Process in batches so the admin sees a responsive, live progress bar
      for (let i = 0; i < idsToUpdate.length; i += batchSize) {
        const batchIds = idsToUpdate.slice(i, i + batchSize)
        const batchNumber = Math.floor(i / batchSize) + 1
        const totalBatches = Math.ceil(idsToUpdate.length / batchSize)

        setStatusMessage(
          `Updating batch ${batchNumber} of ${totalBatches} (${processedSoFar + batchIds.length} / ${totalToUpdate} products)...`
        )

        const response = await fetch("/api/admin/products/continue-selling", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productIds: batchIds, mode: "batch" }),
        })

        if (!response.ok) {
          throw new Error(`Batch ${batchNumber} failed with status ${response.status}`)
        }

        const data = await response.json()
        if (!data.success) {
          throw new Error(data.error || `Failed to update batch ${batchNumber}`)
        }

        processedSoFar += batchIds.length
        setUpdatedCount(processedSoFar)
        const percent = Math.min(100, Math.round((processedSoFar / totalToUpdate) * 100))
        setUpdateProgress(percent)
      }

      // Verification Step: final re-check to confirm 0 remaining disabled products
      setStatusMessage("Verifying all product settings in the database...")
      const verifyRes = await fetch("/api/admin/products/continue-selling", {
        cache: "no-store",
      })
      const verifyData = await verifyRes.json()

      if (verifyData.success && verifyData.disabledCount === 0) {
        setIsCompleted(true)
        setUpdateProgress(100)
        setScanResult((prev) =>
          prev
            ? {
                ...prev,
                enabledCount: prev.total,
                disabledCount: 0,
                allEnabled: true,
                disabledProductIds: [],
              }
            : null
        )

        toast({
          title: "Inventory Policy Updated",
          description: `All ${verifyData.total} products now have 'Continue selling when out of stock' enabled.`,
        })

        // Notify parent to refresh products list without manual reload
        if (onSuccess) {
          onSuccess()
        }
      } else {
        // Some were missed or failed verification
        const remaining = verifyData.disabledCount || 0
        setScanResult((prev) =>
          prev
            ? {
                ...prev,
                disabledCount: remaining,
                enabledCount: (prev.total || 0) - remaining,
                disabledProductIds: verifyData.disabledProductIds || [],
              }
            : null
        )
        if (remaining === 0) {
          setIsCompleted(true)
          if (onSuccess) onSuccess()
        } else {
          setErrorMessage(`${remaining} products could not be verified. You can click retry.`)
        }
      }
    } catch (error) {
      console.error("Bulk enable error:", error)
      const err = error instanceof Error ? error.message : "Failed to bulk update products"
      setErrorMessage(err)
      toast({
        title: "Update Failed",
        description: err,
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <>
      {/* 1. Primary CTA Button (Visible on /admin/products when not completed) */}
      {!isCompleted ? (
        <Button
          onClick={handleStartScan}
          disabled={isScanning}
          variant="outline"
          size="lg"
          className="border-[#C53D39] text-[#C53D39] hover:bg-[#C53D39] hover:text-white transition-all duration-200 shadow-sm font-medium font-poppins bg-white"
        >
          {isScanning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Scanning Products...
            </>
          ) : (
            <>
              <Layers className="w-4 h-4 mr-2" />
              Enable Continue Selling for All Products
            </>
          )}
        </Button>
      ) : (
        /* Success indicator tag in header when completed */
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium font-poppins shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Continue Selling: Enabled for All Products</span>
        </div>
      )}

      {/* 2. Modal Dialog for Scan Summary, Bulk Updating, and Success */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-gray-50 via-amber-50/30 to-gray-50 p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C53D39]/10 text-[#C53D39] flex items-center justify-center flex-shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-montserrat text-gray-900">
                    Bulk Inventory Policy Manager
                  </h3>
                  <p className="text-xs text-gray-500 font-poppins mt-0.5">
                    Configure &quot;Continue selling when out of stock&quot; across your entire catalog
                  </p>
                </div>
              </div>

              {!isUpdating && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Scanning in progress */}
              {isScanning && (
                <div className="py-12 text-center space-y-3">
                  <Loader2 className="w-10 h-10 text-[#C53D39] animate-spin mx-auto" />
                  <p className="text-gray-800 font-medium font-poppins text-base">{statusMessage}</p>
                  <p className="text-xs text-gray-400 font-poppins">
                    Querying product inventory settings across all pagination pages...
                  </p>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">Operation Notice</p>
                    <p className="text-xs text-red-700 mt-1">{errorMessage}</p>
                  </div>
                  <Button
                    onClick={handleStartScan}
                    variant="outline"
                    size="sm"
                    className="bg-white border-red-300 text-red-700 hover:bg-red-100 text-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                    Retry
                  </Button>
                </div>
              )}

              {/* 4. Success State (When all products are updated) */}
              {isCompleted && !isScanning && !isUpdating && (
                <div className="py-6 space-y-5 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold font-montserrat text-emerald-950">
                      All Products Now Have &quot;Continue Selling When Out of Stock&quot; Enabled!
                    </h3>
                    <p className="text-sm text-emerald-800 font-poppins max-w-lg mx-auto">
                      All {scanResult?.total || "catalog"} products have been successfully verified in the database.
                      Customers can now purchase any product on the storefront even if inventory stock is 0.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-left text-xs font-poppins text-emerald-900 space-y-2 max-w-lg mx-auto">
                    <div className="flex items-center gap-2 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Data Integrity Verified</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-emerald-800">
                      <li>Actual stock quantities are completely untouched.</li>
                      <li>Prices, images, variants, and descriptions remain intact.</li>
                      <li>Storefront Add to Cart and Buy Now buttons are active for backorders.</li>
                    </ul>
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={() => setIsOpen(false)}
                      size="lg"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium font-poppins px-8"
                    >
                      Done &bull; Return to Products
                    </Button>
                  </div>
                </div>
              )}

              {/* Scan Results Display (When scan has completed and items need update) */}
              {scanResult && !isScanning && !isCompleted && (
                <div className="space-y-6">
                  {/* Summary Metric Cards */}
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-3 font-poppins">
                      Catalog Scan Summary
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Metric 1: Total products scanned */}
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <div className="flex items-center justify-between text-gray-500 text-xs font-poppins mb-1">
                          <span>Total Scanned</span>
                          <Package className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-gray-900 font-montserrat">
                          {scanResult.total}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">All pagination pages</p>
                      </div>

                      {/* Metric 2: Already enabled */}
                      <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200">
                        <div className="flex items-center justify-between text-emerald-700 text-xs font-poppins mb-1">
                          <span>Already Enabled</span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-emerald-800 font-montserrat">
                          {scanResult.enabledCount}
                        </div>
                        <p className="text-[11px] text-emerald-600 mt-1">Preserved as-is</p>
                      </div>

                      {/* Metric 3: Disabled and needs updating */}
                      <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200">
                        <div className="flex items-center justify-between text-amber-800 text-xs font-poppins mb-1">
                          <span>Needs Updating</span>
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-amber-900 font-montserrat">
                          {scanResult.disabledCount}
                        </div>
                        <p className="text-[11px] text-amber-700 mt-1">Currently blocks 0-stock sales</p>
                      </div>
                    </div>
                  </div>

                  {/* Updating Progress Indicator */}
                  {isUpdating && (
                    <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-800 flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-[#C53D39]" />
                          {statusMessage}
                        </span>
                        <span className="font-bold text-[#C53D39] font-montserrat">{updateProgress}%</span>
                      </div>

                      {/* Live Progress Bar */}
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#C53D39] to-[#F1BA69] transition-all duration-300 rounded-full"
                          style={{ width: `${updateProgress}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 font-poppins">
                        <span>
                          Updated {updatedCount} of {scanResult.disabledCount} products
                        </span>
                        <span>Verifying changes in database...</span>
                      </div>
                    </div>
                  )}

                  {/* Guarantee Box */}
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs space-y-1.5 font-poppins">
                    <div className="flex items-center gap-2 font-semibold text-blue-950">
                      <ShieldCheck className="w-4 h-4 text-blue-700" />
                      <span>Safe Operation Guarantee</span>
                    </div>
                    <p className="text-blue-800">
                      This action updates only the product inventory policy (<strong>continue_selling = true</strong>) in the database.
                      Actual stock quantities, prices, images, and categories will not be changed.
                    </p>
                  </div>

                  {/* 3. Bulk Enable Button below scan results */}
                  {scanResult.disabledCount > 0 && !isUpdating && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
                      <div className="text-xs text-gray-500 font-poppins">
                        Ready to update <strong>{scanResult.disabledCount}</strong> remaining product(s).
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => setIsOpen(false)}
                          variant="outline"
                          size="lg"
                          className="font-poppins bg-white"
                        >
                          Cancel
                        </Button>

                        <Button
                          onClick={handleBulkEnable}
                          size="lg"
                          className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white shadow-md hover:shadow-lg font-medium font-poppins px-6"
                        >
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Enable for All Remaining Products
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
