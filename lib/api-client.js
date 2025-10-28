const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

class APIClient {
  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`
    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `API Error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("[v0] API Error:", error)
      throw error
    }
  }

  // Menu Items
  async getMenuItems(category = null) {
    let endpoint = "/menu-items/"
    if (category) {
      endpoint += `?category=${category}`
    }
    return this.request(endpoint)
  }

  async getMenuItemsByCategory() {
    return this.request("/menu-items/by_category/")
  }

  async getAvailableMenuItems() {
    return this.request("/menu-items/available/")
  }

  async createMenuItem(data) {
    return this.request("/menu-items/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateMenuItem(id, data) {
    return this.request(`/menu-items/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async deleteMenuItem(id) {
    return this.request(`/menu-items/${id}/`, {
      method: "DELETE",
    })
  }

  // Orders
  async createOrder(data) {
    return this.request("/orders/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getOrder(orderId) {
    return this.request(`/orders/${orderId}/`)
  }

  async trackOrder(orderId) {
    return this.request(`/orders/${orderId}/track/`)
  }

  async updateOrderStatus(orderId, status) {
    return this.request(`/orders/${orderId}/update_status/`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
  }

  async getOrdersByTable(tableNumber) {
    return this.request(`/orders/by_table/?table_number=${tableNumber}`)
  }

  // Payments
  async processPayment(data) {
    return this.request("/payments/process_payment/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getPaymentByOrder(orderId) {
    return this.request(`/payments/by_order/?order_id=${orderId}`)
  }

  // Admin
  async getAdminDashboard() {
    return this.request("/admin/dashboard/")
  }

  async getAdminOrders(status = null, date = null) {
    let endpoint = "/admin/orders/"
    const params = new URLSearchParams()
    if (status) params.append("status", status)
    if (date) params.append("date", date)
    if (params.toString()) {
      endpoint += `?${params.toString()}`
    }
    return this.request(endpoint)
  }

  async getAdminMenuStats() {
    return this.request("/admin/menu-stats/")
  }
}

export const apiClient = new APIClient()
