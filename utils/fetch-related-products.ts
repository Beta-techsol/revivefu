export const fetchRelatedProducts = async (categoryId?: string): Promise<any[]> => {
  try {
    const response = await fetch("/api/products?limit=10")
    const data = await response.json()

    if (data.success && data.products) {
      // Filter related products by same category
      const related = data.products.filter((p: any) => (categoryId ? p.category_id === categoryId : true)).slice(0, 8)

      return related
    }
    return []
  } catch (error) {
    console.error("Error fetching related products:", error)
    return []
  }
}
