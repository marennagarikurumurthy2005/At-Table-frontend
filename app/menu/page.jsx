"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Plus, Minus, Search, Filter, AlertCircle } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api-client"
import { useCart } from "@/lib/cart-context"

export default function MenuPage() {
  const { addToCart } = useCart()
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [priceFilter, setPriceFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await apiClient.getMenuItems()
        const menuItems = Array.isArray(data) ? data : data.results || data.data || []

        const categoryNames = {
          breakfast: { id: "breakfast", name: "Breakfast", icon: "🍳", description: "Start your day right" },
          lunch: { id: "lunch", name: "Lunch", icon: "🍱", description: "Main courses" },
          snacks: { id: "snacks", name: "Snacks", icon: "🍟", description: "Quick bites" },
          beverages: { id: "beverages", name: "Beverages", icon: "☕", description: "Drinks" },
          desserts: { id: "desserts", name: "Desserts", icon: "🍰", description: "Sweet treats" },
        }

        setCategories(Object.values(categoryNames))
        setItems(menuItems)
        setSelectedCategory("breakfast")
      } catch (err) {
        console.error("[v0] Error fetching menu:", err)
        setError(err.message || "Failed to load menu items")
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [])

  useEffect(() => {
    let filtered = items.filter((item) => item.category === selectedCategory)

    if (searchQuery) {
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (priceFilter !== "all") {
      if (priceFilter === "under50") filtered = filtered.filter((item) => item.price < 50)
      if (priceFilter === "50to100") filtered = filtered.filter((item) => item.price >= 50 && item.price <= 100)
      if (priceFilter === "100to200") filtered = filtered.filter((item) => item.price > 100 && item.price <= 200)
      if (priceFilter === "above200") filtered = filtered.filter((item) => item.price > 200)
    }

    setFilteredItems(filtered)
  }, [selectedCategory, searchQuery, priceFilter, items])

  const handleAddToCart = (item) => addToCart(item)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading menu items...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-foreground font-semibold mb-2">Failed to Load Menu</p>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">
            Make sure the backend server is running at {process.env.NEXT_PUBLIC_API_URL}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories & Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition ${
                        selectedCategory === cat.id
                          ? "bg-orange-500 text-white shadow-md"
                          : "bg-gray-100 text-foreground hover:bg-gray-200"
                      }`}
                    >
                      <span className="mr-2">{cat.icon}</span>
                      <span className="font-medium">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Price Range
                </h3>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All Prices" },
                    { value: "under50", label: "Under ₹50" },
                    { value: "50to100", label: "₹50 - ₹100" },
                    { value: "100to200", label: "₹100 - ₹200" },
                    { value: "above200", label: "Above ₹200" },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        value={option.value}
                        checked={priceFilter === option.value}
                        onChange={(e) => setPriceFilter(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-foreground">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Menu Items */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Items Grid */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">No items found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="relative">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 shadow-md flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm font-semibold text-foreground">{item.rating}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-foreground mb-1">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mb-3">{item.reviews_count} reviews</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-orange-500">₹{item.price}</span>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
