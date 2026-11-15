interface ApiResponse<T = any> {
  data?: T
  error?: string
  success?: boolean
}

class ApiClient {
  private baseUrl = "/api"

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || "Request failed", success: false }
      }

      return { data: data.data || data, success: true }
    } catch (error: any) {
      console.error("API request failed:", error)
      return { error: error.message || "Network error", success: false }
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async logout() {
    return this.request("/auth/logout", { method: "POST" })
  }

  async getMe() {
    return this.request("/auth/me")
  }

  // Product methods
  async getProducts(
    params: {
      page?: number
      limit?: number
      category?: string
      search?: string
      status?: string
    } = {},
  ) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, value.toString())
    })

    return this.request(`/admin/products?${searchParams}`)
  }

  async getProduct(id: string) {
    return this.request(`/admin/products/${id}`)
  }

  async createProduct(productData: any) {
    return this.request("/admin/products", {
      method: "POST",
      body: JSON.stringify(productData),
    })
  }

  async updateProduct(id: string, productData: any) {
    return this.request(`/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    })
  }

  async deleteProduct(id: string) {
    return this.request(`/admin/products/${id}`, {
      method: "DELETE",
    })
  }

  // Category methods
  async getCategories() {
    console.log("API Client: Fetching categories...")
    const response = await this.request("/admin/categories")
    console.log("API Client: Categories response:", response)
    return response
  }

  async createCategory(categoryData: any) {
    return this.request("/admin/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    })
  }

  async updateCategory(id: string, categoryData: any) {
    return this.request(`/admin/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    })
  }

  async deleteCategory(id: string) {
    return this.request(`/admin/categories/${id}`, {
      method: "DELETE",
    })
  }

  async bulkAssignProductsToCategory(categoryId: string, productIds: string[]) {
    return this.request(`/admin/categories/${categoryId}/bulk-assign`, {
      method: "POST",
      body: JSON.stringify({ productIds }),
    })
  }

  async getProductsByCategory(categoryId: string) {
    return this.request(`/admin/categories/${categoryId}/products`)
  }

  // Upload methods
  async uploadImage(file: File, folder = "products"): Promise<{ url: string; public_id: string }> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", folder)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      return data
    } catch (error: any) {
      console.error("Upload failed:", error)
      throw error
    }
  }

  async deleteImage(publicId: string) {
    return this.request("/upload", {
      method: "DELETE",
      body: JSON.stringify({ public_id: publicId }),
    })
  }

  // Public product methods (for frontend)
  async getPublicProducts(
    params: {
      page?: number
      limit?: number
      category?: string
      search?: string
      featured?: boolean
      trending?: boolean
      best_seller?: boolean
      room_type?: string
    } = {},
  ) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.append(key, value.toString())
    })

    return this.request(`/products?${searchParams}`)
  }

  async getPublicProduct(id: string) {
    return this.request(`/products/${id}`)
  }

  async getPublicCategories() {
    return this.request("/categories")
  }
}

export const apiClient = new ApiClient()
