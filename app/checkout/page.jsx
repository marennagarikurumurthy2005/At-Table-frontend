"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, AlertCircle, Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { useCart } from "@/lib/cart-context"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const [formData, setFormData] = useState({
    customer_name: "",
    table_number: "",
    phone_number: "",
    email: "",
    special_instructions: "",
    payment_method: "cod",
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = "Name is required"
    }

    if (!formData.table_number || formData.table_number < 1) {
      newErrors.table_number = "Valid table number is required"
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required"
    } else if (!/^\d{10}$/.test(formData.phone_number.replace(/\D/g, ""))) {
      newErrors.phone_number = "Phone number must be 10 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm() || cart.length === 0) {
      return
    }

    setLoading(true)
    setApiError(null)

    try {
      const orderData = {
        customer_name: formData.customer_name,
        table_number: Number.parseInt(formData.table_number),
        phone_number: formData.phone_number,
        email: formData.email || undefined,
        payment_method: formData.payment_method,
        special_instructions: formData.special_instructions,
        items: cart.map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
        })),
      }

      const response = await apiClient.createOrder(orderData)
      setOrderId(response.order_id)
      clearCart()

      if (formData.payment_method === "online") {
        setLoading(false)
        router.push(`/payment?orderId=${response.order_id}&amount=${response.total_amount}`)
      } else {
        setSubmitted(true)
        setLoading(false)
      }
    } catch (err) {
      console.error("[v0] Error creating order:", err)
      setApiError(err.message || "Failed to create order. Please try again.")
      setLoading(false)
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = Math.round(cartTotal * 0.05)
  const deliveryFee = cartTotal > 200 ? 0 : 30
  const finalTotal = cartTotal + tax + deliveryFee

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-6">Your order has been placed successfully.</p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Order ID</p>
              <p className="text-lg font-bold text-orange-500">{orderId}</p>
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-sm text-muted-foreground mb-1">Name: {formData.customer_name}</p>
              <p className="text-sm text-muted-foreground mb-1">Table: {formData.table_number}</p>
              <p className="text-sm text-muted-foreground mb-1">Phone: {formData.phone_number}</p>
              <p className="text-sm text-muted-foreground">Payment: Cash on Delivery</p>
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-sm font-semibold text-foreground">Total: ₹{finalTotal}</p>
            </div>
          </div>

          <Link
            href={`/track/${orderId}`}
            className="w-full block bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition mb-3"
          >
            Track Order
          </Link>
          <Link
            href="/menu"
            className="w-full block border-2 border-orange-500 text-orange-500 py-3 rounded-lg font-semibold hover:bg-orange-50 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/menu" className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </Link>
          <h1 className="text-xl font-bold text-foreground">Checkout</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-foreground mb-6">Delivery Details</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Your Name *</label>
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
                        errors.customer_name ? "border-red-500" : "border-border"
                      }`}
                      placeholder="Enter your name"
                    />
                    {errors.customer_name && <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Table Number *</label>
                      <input
                        type="number"
                        name="table_number"
                        value={formData.table_number}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
                          errors.table_number ? "border-red-500" : "border-border"
                        }`}
                        placeholder="e.g., 5"
                      />
                      {errors.table_number && <p className="text-red-500 text-sm mt-1">{errors.table_number}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition ${
                          errors.phone_number ? "border-red-500" : "border-border"
                        }`}
                        placeholder="10-digit number"
                      />
                      {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Email (Optional)</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Special Instructions</label>
                    <textarea
                      name="special_instructions"
                      value={formData.special_instructions}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                      placeholder="e.g., Extra spicy, no onions, etc."
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { value: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives" },
                    { value: "online", label: "Online Payment", desc: "Pay now with card/UPI" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
                        formData.payment_method === option.value
                          ? "border-orange-500 bg-orange-50"
                          : "border-border hover:border-orange-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={option.value}
                        checked={formData.payment_method === option.value}
                        onChange={handleChange}
                        className="w-4 h-4 mt-1"
                      />
                      <div className="ml-3">
                        <p className="font-semibold text-foreground">{option.label}</p>
                        <p className="text-sm text-muted-foreground">{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {apiError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{apiError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || cart.length === 0}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </form>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-xl border border-border p-6 sticky top-24">
              <h2 className="text-lg font-bold text-foreground mb-6">Order Summary</h2>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">Your cart is empty</p>
                  <Link href="/menu" className="text-orange-500 hover:underline font-semibold">
                    Add items to cart
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-start text-sm">
                        <div>
                          <p className="font-semibold text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-foreground">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (5%)</span>
                      <span className="text-foreground">₹{tax}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Delivery Fee {deliveryFee === 0 && <span className="text-green-600">(Free)</span>}
                      </span>
                      <span className="text-foreground">₹{deliveryFee}</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="text-2xl font-bold text-orange-500">₹{finalTotal}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
