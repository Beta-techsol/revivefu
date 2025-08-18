"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, Database, Clock } from "lucide-react"

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading: boolean
  stats: {
    totalProducts: number
    highConfidence: number
    lowConfidence: number
    needsNewCategory: number
  } | null
}

export function AICategorizeConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  stats,
}: ConfirmationDialogProps) {
  const [confirmations, setConfirmations] = useState({
    understand: false,
    backup: false,
    responsibility: false,
  })

  const allConfirmed = Object.values(confirmations).every(Boolean)

  const handleConfirmationChange = (key: keyof typeof confirmations, checked: boolean) => {
    setConfirmations((prev) => ({ ...prev, [key]: checked }))
  }

  const handleConfirm = () => {
    if (allConfirmed) {
      onConfirm()
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setConfirmations({ understand: false, backup: false, responsibility: false })
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span>Confirm AI Categorization Application</span>
          </DialogTitle>
          <DialogDescription>
            You are about to apply AI-generated category suggestions to your products. This action will modify your
            database.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Stats Summary */}
          {stats && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Total Products</p>
                  <p className="text-lg font-bold">{stats.totalProducts}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">High Confidence</p>
                  <p className="text-lg font-bold text-green-600">{stats.highConfidence}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Low Confidence</p>
                  <p className="text-lg font-bold text-yellow-600">{stats.lowConfidence}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">New Categories</p>
                  <p className="text-lg font-bold text-purple-600">{stats.needsNewCategory}</p>
                </div>
              </div>
            </div>
          )}

          {/* Safety Warnings */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important Safety Information:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• This action will permanently modify product categories in your database</li>
                <li>• An automatic backup will be created before applying changes</li>
                <li>• You can rollback changes using the backup if needed</li>
                <li>• Low confidence suggestions may require manual review</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Confirmation Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="understand"
                checked={confirmations.understand}
                onCheckedChange={(checked) => handleConfirmationChange("understand", checked as boolean)}
                disabled={isLoading}
              />
              <label htmlFor="understand" className="text-sm leading-relaxed">
                I understand that this action will modify product categories in the database and cannot be undone
                without using the rollback feature.
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="backup"
                checked={confirmations.backup}
                onCheckedChange={(checked) => handleConfirmationChange("backup", checked as boolean)}
                disabled={isLoading}
              />
              <label htmlFor="backup" className="text-sm leading-relaxed">
                I acknowledge that an automatic backup will be created and I know how to use the rollback feature if
                needed.
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="responsibility"
                checked={confirmations.responsibility}
                onCheckedChange={(checked) => handleConfirmationChange("responsibility", checked as boolean)}
                disabled={isLoading}
              />
              <label htmlFor="responsibility" className="text-sm leading-relaxed">
                I take full responsibility for applying these AI-generated changes and have reviewed the suggestions in
                dry-run mode.
              </label>
            </div>
          </div>

          {/* Additional Safety Badge */}
          <div className="flex items-center justify-center space-x-2 p-3 bg-blue-50 rounded-lg">
            <Shield className="w-5 h-5 text-blue-600" />
            <Badge className="bg-blue-100 text-blue-800">Safety Features Active</Badge>
            <span className="text-sm text-blue-700">Automatic backup • Rollback capability • Audit logging</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!allConfirmed || isLoading} className="bg-red-600 hover:bg-red-700">
            {isLoading ? "Applying Changes..." : "Apply AI Categorization"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
