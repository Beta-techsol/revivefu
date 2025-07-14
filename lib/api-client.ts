interface ApiResponse<T = any> {
  data?: T
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

class ApiClient {
  private baseUrl = "/api"
  private token: string | null = null

  setToken(token: string) {
    this.token = token
  }

  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || "Request failed" }
      }

      return { data }
    } catch (error) {
      return { error: "Network error" }
    }
  }

  // Products
  async getProducts(params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set("page", params.page.toString())
    if (params?.limit) searchParams.set("limit", params.limit.toString())
    if (params?.category) searchParams.set("category", params.category)
    if (params?.search) searchParams.set("search", params.search)

    return this.request(`/admin/products?${searchParams}`)
  }

  async getProduct(id: string) {
    return this.request(`/admin/products/${id}`)
  }

  async createProduct(data: any) {
    return this.request("/admin/products", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateProduct(id: string, data: any) {
    return this.request(`/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteProduct(id: string) {
    return this.request(`/admin/products/${id}`, {
      method: "DELETE",
    })
  }

  // Categories
  async getCategories() {
    return this.request("/admin/categories")
  }

  async createCategory(data: any) {
    return this.request("/admin/categories", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateCategory(id: string, data: any) {
    return this.request(`/admin/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteCategory(id: string) {
    return this.request(`/admin/categories/${id}`, {
      method: "DELETE",
    })
  }

  // Orders
  async getOrders(params?: {
    page?: number
    limit?: number
    status?: string
    search?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set("page", params.page.toString())
    if (params?.limit) searchParams.set("limit", params.limit.toString())
    if (params?.status) searchParams.set("status", params.status)
    if (params?.search) searchParams.set("search", params.search)

    return this.request(`/admin/orders?${searchParams}`)
  }

  async getOrder(id: string) {
    return this.request(`/admin/orders/${id}`)
  }

  async updateOrder(id: string, data: any) {
    return this.request(`/admin/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Image upload
  async uploadImage(file: File, folder?: string) {
    const formData = new FormData()
    formData.append("file", file)
    if (folder) formData.append("folder", folder)

    return fetch("/api/upload", {
      method: "POST",
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
      body: formData,
    }).then((res) => res.json())
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    })
  }
}

export const apiClient = new ApiClient()
