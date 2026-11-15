"use client"

import { useState } from "react"
import { Check, Copy, Landmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BANK_ACCOUNT_DETAILS } from "@/lib/payment-utils"

type CopyFieldKey = "bankName" | "accountTitle" | "iban" | "accountNumber" | "all"

interface BankAccountDetailsProps {
  className?: string
  title?: string
}

async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Fallback below
  }

  try {
    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.setAttribute("readonly", "")
    textarea.style.position = "fixed"
    textarea.style.left = "-9999px"
    textarea.style.top = "-9999px"
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    const ok = document.execCommand("copy")
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}

export function BankAccountDetails({
  className = "",
  title = "Bank Account Details",
}: BankAccountDetailsProps) {
  const [copiedField, setCopiedField] = useState<CopyFieldKey | null>(null)

  const handleCopy = async (key: CopyFieldKey, value: string) => {
    const ok = await copyTextToClipboard(value)
    if (ok) {
      setCopiedField(key)
      setTimeout(() => {
        setCopiedField((prev) => (prev === key ? null : prev))
      }, 2500)
    }
  }

  const allDetailsText = [
    `Bank: ${BANK_ACCOUNT_DETAILS.bankName}`,
    `Account Title: ${BANK_ACCOUNT_DETAILS.accountTitle}`,
    `IBAN: ${BANK_ACCOUNT_DETAILS.iban}`,
    `Account Number: ${BANK_ACCOUNT_DETAILS.accountNumber}`,
  ].join("\n")

  const fields: {
    key: Exclude<CopyFieldKey, "all">
    label: string
    value: string
    buttonLabel: string
    mono?: boolean
  }[] = [
    {
      key: "bankName",
      label: "Bank",
      value: BANK_ACCOUNT_DETAILS.bankName,
      buttonLabel: "Copy Bank Name",
    },
    {
      key: "accountTitle",
      label: "Account Title",
      value: BANK_ACCOUNT_DETAILS.accountTitle,
      buttonLabel: "Copy Account Title",
    },
    {
      key: "iban",
      label: "IBAN",
      value: BANK_ACCOUNT_DETAILS.iban,
      buttonLabel: "Copy IBAN",
      mono: true,
    },
    {
      key: "accountNumber",
      label: "Account Number",
      value: BANK_ACCOUNT_DETAILS.accountNumber,
      buttonLabel: "Copy Account Number",
      mono: true,
    },
  ]

  return (
    <div className={`rounded-xl border border-orange-200 bg-white p-4 sm:p-5 shadow-sm ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 mb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
            <Landmark className="w-4 h-4 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-base">{title}</h3>
        </div>
        {copiedField !== null && (
          <span
            role="status"
            aria-live="polite"
            className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-md self-start sm:self-auto"
          >
            <Check className="w-3.5 h-3.5" />
            Copied to clipboard!
          </span>
        )}
      </div>

      <div className="space-y-3">
        {fields.map((field) => {
          const isCopied = copiedField === field.key
          return (
            <div
              key={field.key}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg bg-gray-50 border border-gray-200"
            >
              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{field.label}</p>
                <p
                  className={`text-sm sm:text-base font-semibold text-gray-900 break-all mt-0.5 ${
                    field.mono ? "font-mono" : ""
                  }`}
                >
                  {field.value}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleCopy(field.key, field.value)}
                className="shrink-0 w-full sm:w-auto justify-center gap-1.5 border-gray-300 bg-white hover:bg-orange-50 hover:border-orange-300 text-gray-800"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-green-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{field.buttonLabel}</span>
                  </>
                )}
              </Button>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleCopy("all", allDetailsText)}
          className="w-full justify-center gap-2 border-orange-300 bg-orange-50 hover:bg-orange-100 text-orange-900 font-medium"
        >
          {copiedField === "all" ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-700">Copied to clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy All Account Details</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
