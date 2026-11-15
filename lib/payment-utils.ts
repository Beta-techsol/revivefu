export const BANK_ACCOUNT_DETAILS = {
  bankName: "Bank Alfalah",
  accountTitle: "Muhammad Roman Naveed",
  iban: "PK56ALFH 5894005002144864",
  accountNumber: "58945002144864",
} as const

export const SUPPORT_CONTACT = {
  whatsappDisplay: "+92 315 4843593",
  whatsappHref: "https://wa.me/923154843593",
  phoneHref: "tel:+923154843593",
  email: "revivefurniture01@gmail.com",
} as const

export const FREE_DELIVERY_THRESHOLD = 100000
export const STANDARD_DELIVERY_CHARGE = 2000

export const PAYMENT_METHOD_CODE = "advance_50_cod_50"
export const PAYMENT_METHOD_LABEL = "50% Advance Payment + 50% Cash on Delivery"
export const PAYMENT_SHORT_LABEL = "Pay 50% on Order & Remaining 50% on Delivery"

export interface PaymentBreakdown {
  totalAmount: number
  advanceAmount: number
  remainingAmount: number
}

/**
 * Computes an exact 50/50 payment split where advanceAmount + remainingAmount === totalAmount
 * with zero rounding discrepancy.
 */
export function calculatePaymentBreakdown(rawTotal: number | string | null | undefined): PaymentBreakdown {
  const numeric = typeof rawTotal === "string" ? Number.parseFloat(rawTotal) : Number(rawTotal)
  const safeTotal = Number.isFinite(numeric) && numeric > 0 ? Math.round(numeric * 100) / 100 : 0

  if (safeTotal === 0) {
    return { totalAmount: 0, advanceAmount: 0, remainingAmount: 0 }
  }

  let advanceAmount: number
  if (Number.isInteger(safeTotal)) {
    advanceAmount = Math.round(safeTotal / 2)
  } else {
    advanceAmount = Math.round(safeTotal * 50) / 100
  }

  const remainingAmount = Math.round((safeTotal - advanceAmount) * 100) / 100

  return {
    totalAmount: safeTotal,
    advanceAmount,
    remainingAmount,
  }
}

export function calculateDeliveryCharge(subtotal: number): number {
  const safeSubtotal = Number.isFinite(subtotal) && subtotal > 0 ? subtotal : 0
  if (safeSubtotal === 0) return 0
  return safeSubtotal > FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_CHARGE
}

export function formatPKR(amount: number | string | null | undefined): string {
  const numeric = typeof amount === "string" ? Number.parseFloat(amount.replace(/[^0-9.-]/g, "")) : Number(amount)
  const safe = Number.isFinite(numeric) ? numeric : 0
  return `₨${safe.toLocaleString("en-PK", { maximumFractionDigits: 2 })}`
}

export function formatPaymentMethodLabel(method?: string | null): string {
  if (!method) return PAYMENT_METHOD_LABEL
  const normalized = method.toLowerCase().trim()
  if (
    normalized === PAYMENT_METHOD_CODE ||
    normalized === "50_advance_50_cod" ||
    normalized === "advance_50" ||
    normalized.includes("50%")
  ) {
    return PAYMENT_METHOD_LABEL
  }
  if (normalized === "cash_on_delivery" || normalized === "cod") {
    return "Cash on Delivery"
  }
  return method.replace(/_/g, " ")
}

export function formatPaymentStatusLabel(status?: string | null): string {
  const normalized = (status || "pending").toLowerCase().trim()
  switch (normalized) {
    case "paid":
      return "Paid"
    case "advance_paid":
    case "partial":
    case "partially_paid":
      return "50% Advance Paid"
    case "unpaid":
    case "pending":
    default:
      return "Pending Advance Payment"
  }
}
