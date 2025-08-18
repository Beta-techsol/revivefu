"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AICategorizeConfirmationDialog } from "@/components/admin/ai-categorizer-confirmation-dialog"
import {
  Bot,
  Download,
  AlertTriangle,
  CheckCircle,
  Zap,
  FileText,
  BarChart3,
  RefreshCw,
  Eye,
  Settings,
  Plus,
  Undo2,
  History,
  Database,
  Calendar,
  User,
} from "lucide-react"

interface CategorizationResult {
  productId: number
  productName: string
  currentCategory: string | null
  suggestedCategory: string
  confidence: number
  reasoning: string
  needsNewCategory: boolean
  newCategoryDescription?: string
}

interface CategorizationStats {
  totalProducts: number
  highConfidence: number
  lowConfidence: number
  needsNewCategory: number
  averageConfidence: number
}

interface BackupSession {
  id: string
  sessionType: string
  status: string
  totalProducts: number
  processedProducts: number
  startedAt: string
  completedAt: string | null
  createdByUser: string
  canRollback: boolean
}

export default function AICategorizer() {
  const [results, setResults] = useState<CategorizationResult[]>([])
  const [stats, setStats] = useState<CategorizationStats | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isDryRun, setIsDryRun] = useState(true)
  const [progress, setProgress] = useState(0)
  const [currentProduct, setCurrentProduct] = useState("")
  const [logs, setLogs] = useState<string[]>([])
  const [selectedResult, setSelectedResult] = useState<CategorizationResult | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [backupSessions, setBackupSessions] = useState<BackupSession[]>([])
  const [selectedSessionId, setSelectedSessionId] = useState("")
  const [isRollingBack, setIsRollingBack] = useState(false)

  useEffect(() => {
    loadBackupSessions()
  }, [])

  const runCategorization = async (dryRun: boolean) => {
    setIsRunning(true)
    setProgress(0)
    setResults([])
    setLogs([])
    setCurrentProduct("")

    try {
      const response = await fetch("/api/admin/ai-categorizer/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dryRun }),
      })

      if (!response.ok) {
        throw new Error("Failed to run categorization")
      }

      const data = await response.json()

      if (data.success) {
        setResults(data.results)
        calculateStats(data.results)
        setLogs(data.logs || [])
        if (!dryRun) {
          await loadBackupSessions()
        }
      } else {
        throw new Error(data.error || "Categorization failed")
      }
    } catch (error) {
      console.error("Categorization error:", error)
      setLogs((prev) => [...prev, `Error: ${error instanceof Error ? error.message : "Unknown error"}`])
    } finally {
      setIsRunning(false)
      setProgress(100)
    }
  }

  const loadBackupSessions = async () => {
    try {
      const response = await fetch("/api/admin/ai-categorizer/sessions")
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setBackupSessions(data.sessions)
        }
      }
    } catch (error) {
      console.error("Failed to load backup sessions:", error)
    }
  }

  const handleRollback = async () => {
    if (!selectedSessionId) return

    setIsRollingBack(true)
    try {
      const response = await fetch("/api/admin/ai-categorizer/rollback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId: selectedSessionId }),
      })

      const data = await response.json()
      if (data.success) {
        setLogs((prev) => [...prev, `Rollback completed successfully for session ${selectedSessionId}`])
        await loadBackupSessions()
        setSelectedSessionId("")
      } else {
        throw new Error(data.error || "Rollback failed")
      }
    } catch (error) {
      console.error("Rollback error:", error)
      setLogs((prev) => [...prev, `Rollback error: ${error instanceof Error ? error.message : "Unknown error"}`])
    } finally {
      setIsRollingBack(false)
    }
  }

  const calculateStats = (results: CategorizationResult[]) => {
    const totalProducts = results.length
    const highConfidence = results.filter((r) => r.confidence >= 80).length
    const lowConfidence = results.filter((r) => r.confidence < 50).length
    const needsNewCategory = results.filter((r) => r.needsNewCategory).length
    const averageConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / totalProducts

    setStats({
      totalProducts,
      highConfidence,
      lowConfidence,
      needsNewCategory,
      averageConfidence: Math.round(averageConfidence),
    })
  }

  const exportResults = (format: "json" | "csv") => {
    if (results.length === 0) return

    let content: string
    let filename: string
    let mimeType: string

    if (format === "csv") {
      const headers = [
        "Product ID",
        "Product Name",
        "Current Category",
        "Suggested Category",
        "Confidence",
        "Needs New Category",
        "Reasoning",
      ]

      const rows = results.map((r) => [
        r.productId,
        `"${r.productName.replace(/"/g, '""')}"`,
        r.currentCategory || "None",
        `"${r.suggestedCategory.replace(/"/g, '""')}"`,
        r.confidence,
        r.needsNewCategory,
        `"${r.reasoning.replace(/"/g, '""')}"`,
      ])

      content = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
      filename = `ai-categorization-${Date.now()}.csv`
      mimeType = "text/csv"
    } else {
      content = JSON.stringify(results, null, 2)
      filename = `ai-categorization-${Date.now()}.json`
      mimeType = "application/json"
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportBackupSessions = () => {
    if (backupSessions.length === 0) return

    const content = JSON.stringify(backupSessions, null, 2)
    const blob = new Blob([content], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ai-categorization-sessions-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 80) return <Badge className="bg-green-100 text-green-800">High</Badge>
    if (confidence >= 50) return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
    return <Badge className="bg-red-100 text-red-800">Low</Badge>
  }

  const handleApplyWithConfirmation = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirmApply = () => {
    setShowConfirmDialog(false)
    runCategorization(false)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-montserrat">AI Product Categorizer</h1>
          <p className="text-gray-600 font-poppins">Automatically categorize products using artificial intelligence</p>
        </div>
        <div className="flex items-center space-x-2">
          <Bot className="w-8 h-8 text-[#C53D39]" />
        </div>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Control Panel</span>
          </CardTitle>
          <CardDescription>
            Run AI categorization in dry-run mode to preview suggestions, or apply mode to make changes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => runCategorization(true)}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Dry Run (Preview)
                </>
              )}
            </Button>

            <Button
              onClick={handleApplyWithConfirmation}
              disabled={isRunning || results.length === 0}
              variant="destructive"
            >
              <Zap className="w-4 h-4 mr-2" />
              Apply Changes
            </Button>

            <Separator orientation="vertical" className="h-8" />

            <Button onClick={() => exportResults("csv")} disabled={results.length === 0} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>

            <Button onClick={() => exportResults("json")} disabled={results.length === 0} variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
          </div>

          {isRunning && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Processing products...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              {currentProduct && <p className="text-sm text-gray-600">Current: {currentProduct}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold">{stats.totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">High Confidence</p>
                  <p className="text-2xl font-bold">{stats.highConfidence}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Confidence</p>
                  <p className="text-2xl font-bold">{stats.lowConfidence}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">New Categories</p>
                  <p className="text-2xl font-bold">{stats.needsNewCategory}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
                  <p className="text-2xl font-bold">{stats.averageConfidence}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <Tabs defaultValue="results" className="space-y-4">
          <TabsList>
            <TabsTrigger value="results">Categorization Results</TabsTrigger>
            <TabsTrigger value="logs">Process Logs</TabsTrigger>
            <TabsTrigger value="backups">Backup & Rollback</TabsTrigger>
          </TabsList>

          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Categorization Results</CardTitle>
                <CardDescription>Review AI suggestions before applying changes</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Current Category</TableHead>
                        <TableHead>Suggested Category</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead>New Category</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((result) => (
                        <TableRow key={result.productId}>
                          <TableCell className="font-medium">{result.productName}</TableCell>
                          <TableCell>
                            {result.currentCategory ? (
                              <Badge variant="outline">{result.currentCategory}</Badge>
                            ) : (
                              <span className="text-gray-400">None</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-[#C53D39] text-white">{result.suggestedCategory}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>{result.confidence}%</span>
                              {getConfidenceBadge(result.confidence)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {result.needsNewCategory ? (
                              <Badge className="bg-purple-100 text-purple-800">Yes</Badge>
                            ) : (
                              <span className="text-gray-400">No</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedResult(result)}>
                                  <Eye className="w-4 h-4 mr-1" />
                                  Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>{result.productName}</DialogTitle>
                                  <DialogDescription>AI categorization analysis and reasoning</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Current Category</label>
                                      <p className="text-sm text-gray-600">{result.currentCategory || "None"}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Suggested Category</label>
                                      <p className="text-sm text-gray-600">{result.suggestedCategory}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Confidence</label>
                                      <div className="flex items-center space-x-2">
                                        <span className="text-sm">{result.confidence}%</span>
                                        {getConfidenceBadge(result.confidence)}
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">New Category</label>
                                      <p className="text-sm text-gray-600">{result.needsNewCategory ? "Yes" : "No"}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">AI Reasoning</label>
                                    <p className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded">
                                      {result.reasoning}
                                    </p>
                                  </div>
                                  {result.newCategoryDescription && (
                                    <div>
                                      <label className="text-sm font-medium">New Category Description</label>
                                      <p className="text-sm text-gray-600 mt-1 p-3 bg-purple-50 rounded">
                                        {result.newCategoryDescription}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Process Logs</CardTitle>
                <CardDescription>Detailed logs from the categorization process</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2 font-mono text-sm">
                    {logs.map((log, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded">
                        {log}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backups">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Backup Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="w-5 h-5" />
                    <span>Backup Sessions</span>
                  </CardTitle>
                  <CardDescription>View and manage AI categorization backup sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Button onClick={loadBackupSessions} variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                      </Button>
                      <Button
                        onClick={exportBackupSessions}
                        variant="outline"
                        size="sm"
                        disabled={backupSessions.length === 0}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Sessions
                      </Button>
                    </div>

                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {backupSessions.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No backup sessions found</p>
                            <p className="text-sm">Run AI categorization to create backups</p>
                          </div>
                        ) : (
                          backupSessions.map((session) => (
                            <div
                              key={session.id}
                              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                selectedSessionId === session.id
                                  ? "border-[#C53D39] bg-red-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => setSelectedSessionId(session.id)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    className={
                                      session.status === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : session.status === "failed"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-yellow-100 text-yellow-800"
                                    }
                                  >
                                    {session.status}
                                  </Badge>
                                  <Badge variant="outline">{session.sessionType}</Badge>
                                </div>
                                {session.canRollback && (
                                  <Badge className="bg-blue-100 text-blue-800">Rollback Available</Badge>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{new Date(session.startedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <User className="w-3 h-3" />
                                  <span>{session.createdByUser}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <BarChart3 className="w-3 h-3" />
                                  <span>{session.totalProducts} products</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>{session.processedProducts} processed</span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>

              {/* Rollback Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Undo2 className="w-5 h-5" />
                    <span>Rollback Operations</span>
                  </CardTitle>
                  <CardDescription>Restore product categories to previous state</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedSessionId ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">Selected Session</h4>
                          <div className="text-sm text-blue-800">
                            <p>Session ID: {selectedSessionId.substring(0, 8)}...</p>
                            <p>
                              Type: {backupSessions.find((s) => s.id === selectedSessionId)?.sessionType || "Unknown"}
                            </p>
                            <p>
                              Products: {backupSessions.find((s) => s.id === selectedSessionId)?.totalProducts || 0}
                            </p>
                          </div>
                        </div>

                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Warning:</strong> Rollback will restore all product categories to their state before
                            this AI categorization session. This action cannot be undone.
                          </AlertDescription>
                        </Alert>

                        <div className="space-y-2">
                          <Label htmlFor="rollback-confirmation">Type "ROLLBACK" to confirm this action:</Label>
                          <Input
                            id="rollback-confirmation"
                            placeholder="Type ROLLBACK to confirm"
                            onChange={(e) => {
                              // Simple confirmation check
                              const confirmButton = document.getElementById("confirm-rollback") as HTMLButtonElement
                              if (confirmButton) {
                                confirmButton.disabled = e.target.value !== "ROLLBACK" || isRollingBack
                              }
                            }}
                          />
                        </div>

                        <Button
                          id="confirm-rollback"
                          onClick={handleRollback}
                          disabled={true} // Initially disabled, enabled by input
                          variant="destructive"
                          className="w-full"
                        >
                          {isRollingBack ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Rolling Back...
                            </>
                          ) : (
                            <>
                              <Undo2 className="w-4 h-4 mr-2" />
                              Rollback to This Session
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Select a backup session to rollback</p>
                        <p className="text-sm">Choose a session from the list on the left</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Safety Notice */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Safety Notice:</strong> Always run in dry-run mode first to review suggestions. The apply mode will
          make permanent changes to your product categories. Make sure to backup your data before applying changes.
        </AlertDescription>
      </Alert>

      <AICategorizeConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmApply}
        isLoading={isRunning}
        stats={stats}
      />
    </div>
  )
}
