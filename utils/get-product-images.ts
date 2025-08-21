export const getProductImages = (images: string | string[]): string[] => {
  if (!images) return []

  if (typeof images === "string") {
    // Try to parse JSON string
    if (images.startsWith("[") || images.startsWith("{")) {
      try {
        const parsed = JSON.parse(images)
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [images]
      } catch {
        return [images]
      }
    }
    return [images]
  }

  return Array.isArray(images) ? images.filter(Boolean) : []
}
