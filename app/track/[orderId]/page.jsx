"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { apiClient } from "@/lib/api-client"

export default function TrackOrderPage({ params }) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [error, setError] = useState(null)
  const { orderId } = use(params)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const data = await apiClient.trackOrder(orderId)
        setOrder(data)
      } catch (err) {
        console.error("[v0] Error fetching order:", err)
        setError(err.message || "Failed to load order")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.orderId])

  // Auto-refresh order status
  useEffect(() => {
    if (!autoRefresh || !order) return

    const interval = setInterval(async () => {
      try {
        const data = await apiClient.trackOrder(orderId)
        setOrder(data)
      } catch (err) {
        console.error("[v0] Error refreshing order:", err)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [autoRefresh, order, orderId])

  const statuses = [
    { key: "pending", label: "Order Received", icon: Clock, color: "bg-gray-100 text-gray-600" },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle2, color: "bg-blue-100 text-blue-600" },
    { key: "preparing", label: "Preparing", icon: Clock, color: "bg-orange-100 text-orange-600" },
    { key: "ready", label: "Ready for Pickup", icon: CheckCircle2, color: "bg-green-100 text-green-600" },
    { key: "completed", label: "Completed", icon: CheckCircle2, color: "bg-purple-100 text-purple-600" },
  ]

  const currentStatusIndex = order ? statuses.findIndex((s) => s.key === order.status) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">{error || "Order not found"}</p>
          <Link href="/menu" className="text-orange-500 hover:underline font-semibold">
            Back to Menu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/menu" className="p-2 hover:bg-gray-100 rounded-lg transition">
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </Link>
            <h1 className="text-xl font-bold text-foreground">Track Order</h1>
          </div>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              autoRefresh
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-gray-100 text-foreground hover:bg-gray-200"
            }`}
          >
            {autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl border border-border p-8">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">Order ID</p>
                <p className="text-3xl font-bold text-orange-500">{order.order_id}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-border">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Customer Name</p>
                  <p className="font-semibold text-foreground">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Table Number</p>
                  <p className="font-semibold text-foreground">Table {order.table_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <p className="font-semibold text-foreground">{order.phone_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                  <p className="font-semibold text-foreground">
                    {order.payment_method === "cod" ? "Cash on Delivery" : "Online Payment"}
                  </p>
                </div>
              </div>

              {order.special_instructions && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Special Instructions</p>
                  <p className="text-foreground bg-gray-50 p-3 rounded-lg">{order.special_instructions}</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-border p-8">
              <h2 className="text-lg font-bold text-foreground mb-8">Order Status</h2>

              <div className="space-y-6">
                {statuses.map((status, index) => {
                  const Icon = status.icon
                  const isCompleted = index <= currentStatusIndex
                  const isCurrent = index === currentStatusIndex

                  return (
                    <div key={status.key} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                            isCompleted ? status.color : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        {index < statuses.length - 1 && (
                          <div className={`w-1 h-12 mt-2 ${isCompleted ? "bg-orange-500" : "bg-gray-200"}`} />
                        )}
                      </div>
                      <div className="pt-2">
                        <p
                          className={`font-semibold ${
                            isCurrent ? "text-orange-500" : isCompleted ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {status.label}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border p-8">
              <h2 className="text-lg font-bold text-foreground mb-6">Order Items</h2>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-foreground">{item.menu_item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-foreground">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-orange-600" />
                <h3 className="font-semibold text-orange-900">Status</h3>
              </div>
              <p className="text-2xl font-bold text-orange-600 capitalize">{order.status}</p>
              <p className="text-sm text-orange-700 mt-1">
                Last updated: {new Date(order.updated_at).toLocaleTimeString()}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Order Total</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (5%)</span>
                  <span className="text-foreground">₹{order.tax}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-foreground">₹{order.delivery_charge}</span>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-orange-500">₹{order.total_amount}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/menu"
                className="w-full block text-center bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
              >
                Place Another Order
              </Link>
              <button className="w-full px-4 py-3 border-2 border-border text-foreground rounded-lg font-semibold hover:bg-gray-50 transition">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
