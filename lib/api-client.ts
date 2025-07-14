class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor() {
    this.baseUrl = process.env.NODE_ENV === "production" ? "" : ""

    // Get token from localStorage if available
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}/api${endpoint}`

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Request failed" }))
      throw new Error(error.error || "Request failed")
    }

    return response.json()
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (response.ok && data.token) {
      this.setToken(data.token)
    }

    return data
  }

  async logout() {
    this.clearToken()
    return { success: true }
  }

  // Products methods
  async getProducts(params?: Record<string, string | number>) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value))
      })
    }

    const endpoint = `/admin/products${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
    return this.request(endpoint)
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

  // Categories methods
  async getCategories() {
    return this.request("/admin/categories")
  }

  async createCategory(data: any) {
    return this.request("/admin/categories", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Upload methods
  async uploadImage(file: File, folder = "products") {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", folder)

    const headers: HeadersInit = {}
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch("/api/upload", {
      method: "POST",
      headers,
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Upload failed" }))
      throw new Error(error.error || "Upload failed")
    }

    return response.json()
  }
}

export const apiClient = new ApiClient()
