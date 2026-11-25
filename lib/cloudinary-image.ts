import type { ImageLoaderProps } from "next/image"

const CLOUDINARY_HOST = "res.cloudinary.com"
const UPLOAD_MARKER = "/image/upload/"

export function isCloudinaryUrl(src: unknown): src is string {
  if (typeof src !== "string") return false
  const trimmed = src.trim()
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) return false
  try {
    const parsed = new URL(trimmed)
    return parsed.hostname === CLOUDINARY_HOST || parsed.hostname.endsWith(`.${CLOUDINARY_HOST}`)
  } catch {
    return false
  }
}

export function getCloudinaryOptimizedUrl(src: string, width = 800, quality?: number): string {
  if (!isCloudinaryUrl(src)) return src

  try {
    const parsed = new URL(src.trim())
    const idx = parsed.pathname.indexOf(UPLOAD_MARKER)
    if (idx === -1) return src

    const safeWidth = Math.max(32, Math.min(1920, Math.round(width)))
    const qParam = quality ? `q_${Math.max(30, Math.min(95, quality))}` : "q_auto:good"
    const transform = `f_auto,${qParam},c_limit,w_${safeWidth}`

    const prefix = parsed.pathname.slice(0, idx + UPLOAD_MARKER.length)
    const rest = parsed.pathname.slice(idx + UPLOAD_MARKER.length)

    if (!rest) return src

    // Avoid duplicating our generated transformation if already applied
    const firstSlash = rest.indexOf("/")
    const firstSegment = firstSlash === -1 ? "" : rest.slice(0, firstSlash)

    // If firstSegment is a Cloudinary version (v1234) or doesn't look like a transform list, prepend transform
    if (!firstSegment || /^v\d+$/.test(firstSegment) || !firstSegment.includes("_")) {
      parsed.pathname = `${prefix}${transform}/${rest}`
      return parsed.toString()
    }

    // First segment already has upload/existing transforms (e.g. c_limit,w_1200).
    // Chain a responsive resize step before the remaining path if it doesn't already specify f_auto + w_
    if (firstSegment.startsWith("f_auto,") && firstSegment.includes(",w_")) {
      const updatedSegment = firstSegment.replace(/w_\d+/, `w_${safeWidth}`)
      parsed.pathname = `${prefix}${updatedSegment}${rest.slice(firstSlash)}`
      return parsed.toString()
    }

    parsed.pathname = `${prefix}${firstSegment}/${transform}${rest.slice(firstSlash)}`
    return parsed.toString()
  } catch {
    return src
  }
}

export function cloudinaryImageLoader({ src, width, quality }: ImageLoaderProps): string {
  return getCloudinaryOptimizedUrl(src, width, quality)
}
