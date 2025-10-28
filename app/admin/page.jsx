"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BarChart3, Package, ShoppingCart, DollarSign, Plus, Trash2, Eye, EyeOff, AlertCircle } from "lucide-react"
import { apiClient } from "@/lib/api-client"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [menuItems, setMenuItems] = useState([])
  const [orders, setOrders] = useState([])
  const [dashboardStats, setDashboardStats] = useState(null)
  const [showAddItem, setShowAddItem] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "breakfast",
    is_available: true,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [statsData, menuData, ordersData] = await Promise.all([
          apiClient.getAdminDashboard(),
          apiClient.getMenuItems(),
          apiClient.getAdminOrders(),
        ])

        setDashboardStats(statsData)
        setMenuItems(Array.isArray(menuData) ? menuData : []) // ✅ ensure array
        setOrders(Array.isArray(ordersData) ? ordersData : [])
      } catch (err) {
        console.error("[v0] Error fetching admin data:", err)
        setError(err.message || "Failed to load admin data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.description) {
      alert("Please fill in all required fields")
      return
    }

    // try {
    //   const itemData = {
    //     name: newItem.name,
    //     description: newItem.description,
    //     price: Number.parseFloat(newItem.price),
    //     category: newItem.category,
    //     is_available: newItem.is_available,
    //     image_url: "",
    //   }

    //   const createdItem = await apiClient.createMenuItem(itemData)
    //   setMenuItems([...menuItems, createdItem])
    //   setNewItem({ name: "", description: "", price: "", category: "breakfast" , is_available: true })
    //   setShowAddItem(false)
    // } catch (err) {
    //   console.error("[v0] Error adding item:", err)
    //   alert("Failed to add item: " + err.message)
    // }
//     
try {
  const itemData = {
    name: newItem.name,
    description: newItem.description,
    price: Number.parseFloat(newItem.price),
    category: newItem.category,
    is_available: newItem.is_available,
    image_url: newItem.image_url, // ← use image URL directly
  };

  const createdItem = await apiClient.createMenuItem(itemData);
  setMenuItems([...menuItems, createdItem]);
  setNewItem({
    name: "",
    description: "",
    price: "",
    category: "breakfast",
    is_available: true,
    image_url: "",
  });
  setShowAddItem(false);
} catch (err) {
  console.error("[v0] Error adding item:", err);
  alert("Failed to add item: " + err.message);
}

  }

  const handleDeleteItem = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return

    try {
      await apiClient.deleteMenuItem(id)
      setMenuItems(menuItems.filter((item) => item.id !== id))
    } catch (err) {
      console.error("[v0] Error deleting item:", err)
      alert("Failed to delete item: " + err.message)
    }
  }

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      const updatedItem = await apiClient.updateMenuItem(id, { is_available: !currentStatus })
      setMenuItems(menuItems.map((item) => (item.id === id ? updatedItem : item)))
    } catch (err) {
      console.error("[v0] Error updating item:", err)
      alert("Failed to update item: " + err.message)
    }
  }

  // const handleUpdateOrderStatus = async (orderId, newStatus) => {
  //   try {
  //     const updatedOrder = await apiClient.updateOrderStatus(orderId, newStatus)
  //     setOrders(orders.map((order) => (order.id === orderId ? updatedOrder : order)))
  //   } catch (err) {
  //     console.error("[v0] Error updating order:", err)
  //     alert("Failed to update order: " + err.message)
  //   }
  // }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
  try {
    const updatedOrder = await apiClient.updateOrderStatus(orderId, newStatus)

    // ✅ update local state correctly using order_id
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.order_id === orderId ? { ...order, status: newStatus } : order
      )
    )

    // ✅ re-fetch dashboard stats so they update live
    const refreshedStats = await apiClient.getAdminDashboard()
    setDashboardStats(refreshedStats)
  } catch (err) {
    console.error("[v0] Error updating order:", err)
    alert("Failed to update order: " + err.message)
  }
}

  const categories = [
    { id: "breakfast", name: "Breakfast" },
    { id: "lunch", name: "Lunch" },
    { id: "snacks", name: "Snacks" },
    { id: "beverages", name: "Beverages" },
    { id: "desserts", name: "Desserts" },
  ]

  const stats = [
    {
      label: "Total Orders",
      value: dashboardStats?.total_orders || 0,
      icon: ShoppingCart,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Revenue",
      value: `₹${dashboardStats?.total_revenue || 0}`,
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Pending Orders",
      value: dashboardStats?.pending_orders || 0,
      icon: Package,
      color: "bg-orange-100 text-orange-600",
    },
    {
      label: "Completed",
      value: dashboardStats?.completed_orders || 0,
      icon: BarChart3,
      color: "bg-purple-100 text-purple-600",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-foreground font-semibold mb-2">Failed to Load Dashboard</p>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link href="/" className="text-orange-500 hover:underline font-semibold">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <Link href="/" className="text-orange-500 hover:underline font-semibold">
            Back to Home
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="bg-white rounded-xl border border-border p-6">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="flex border-b border-border overflow-x-auto">
            {["overview", "menu", "orders", "payments"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 font-semibold transition whitespace-nowrap ${
                  activeTab === tab
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                <h3 className="font-semibold text-foreground mb-6">Recent Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Order ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Customer</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Table</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 10).map((order) => (
                        <tr key={order.id} className="border-b border-border hover:bg-gray-50">
                          <td className="py-3 px-4 text-foreground font-semibold">{order.order_id}</td>
                          <td className="py-3 px-4 text-foreground">{order.customer_name}</td>
                          <td className="py-3 px-4 text-foreground">{order.table_number}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                order.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "ready"
                                    ? "bg-blue-100 text-blue-700"
                                    : order.status === "preparing"
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-foreground font-semibold">₹{order.total_amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Menu Tab */}
            {activeTab === "menu" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-foreground">Menu Items</h3>
                  <button
                    onClick={() => setShowAddItem(!showAddItem)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>

                {showAddItem && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-border">
                    <h4 className="font-semibold text-foreground mb-4">Add New Menu Item</h4>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Item name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <input
                            type="text"
                            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter image URL"
                            value={newItem.image_url}
                            onChange={(e) =>
                              setNewItem({ ...newItem, image_url: e.target.value })
                            }
                          />
                      <textarea
                        placeholder="Description"
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 md:col-span-2"
                        rows="2"
                      />
                      <select
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        

                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <label className="flex items-center gap-2 px-4 py-2">
                        <input
                          type="checkbox"
                          checked={newItem.is_available}
                          onChange={(e) => setNewItem({ ...newItem, is_available: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span className="text-foreground">Available</span>
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddItem}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                      >
                        Add Item
                      </button>
                      <button
                        onClick={() => setShowAddItem(false)}
                        className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-gray-100 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Item Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Category</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Price</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuItems.map((item) => (
                        <tr key={item.id} className="border-b border-border hover:bg-gray-50">
                          <td className="py-3 px-4 text-foreground font-semibold">{item.name}</td>
                          <td className="py-3 px-4 text-foreground capitalize">{item.category}</td>
                          <td className="py-3 px-4 text-foreground">₹{item.price}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                item.is_available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}
                            >
                              {item.is_available ? "Available" : "Unavailable"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleToggleAvailability(item.id, item.is_available)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                                title={item.is_available ? "Mark unavailable" : "Mark available"}
                              >
                                {item.is_available ? (
                                  <Eye className="w-4 h-4 text-green-600" />
                                ) : (
                                  <EyeOff className="w-4 h-4 text-gray-400" />
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <h3 className="font-semibold text-foreground mb-6">Order Management</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Order ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Customer</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Table</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-border hover:bg-gray-50">
                          <td className="py-3 px-4 text-foreground font-semibold">{order.order_id}</td>
                          <td className="py-3 px-4 text-foreground">{order.customer_name}</td>
                          <td className="py-3 px-4 text-foreground">{order.table_number}</td>
                          <td className="py-3 px-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.order_id, e.target.value)}
                              

                              className={`px-3 py-1 rounded-full text-xs font-semibold border-0 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                                order.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "ready"
                                    ? "bg-blue-100 text-blue-700"
                                    : order.status === "preparing"
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="preparing">Preparing</option>
                              <option value="ready">Ready</option>
                              <option value="completed">Completed</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-foreground font-semibold">₹{order.total_amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === "payments" && (
              <div>
                <h3 className="font-semibold text-foreground mb-6">Payment Tracking</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                    <p className="text-sm text-green-700 mb-2">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-600">₹{dashboardStats?.total_revenue || 0}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
                    <p className="text-sm text-blue-700 mb-2">Today Revenue</p>
                    <p className="text-3xl font-bold text-blue-600">₹{dashboardStats?.today_revenue || 0}</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-6 border border-orange-200">
                    <p className="text-sm text-orange-700 mb-2">Week Revenue</p>
                    <p className="text-3xl font-bold text-orange-600">₹{dashboardStats?.week_revenue || 0}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
