"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Lock, Check, AlertCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { apiClient } from "@/lib/api-client"

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const amount = searchParams.get("amount")

  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  })
  const [upiData, setUpiData] = useState({
    upiId: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleCardChange = (e) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
    } else if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d{0,2})/, "$1/$2")
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3)
    }

    setCardData((prev) => ({ ...prev, [name]: formattedValue }))
    setError("")
  }

  const handleUpiChange = (e) => {
    setUpiData({ upiId: e.target.value })
    setError("")
  }

  const validateCardPayment = () => {
    if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, "").length !== 16) {
      setError("Please enter a valid 16-digit card number")
      return false
    }
    if (!cardData.cardHolder.trim()) {
      setError("Please enter cardholder name")
      return false
    }
    if (!cardData.expiryDate || cardData.expiryDate.length !== 5) {
      setError("Please enter valid expiry date (MM/YY)")
      return false
    }
    if (!cardData.cvv || cardData.cvv.length !== 3) {
      setError("Please enter valid CVV")
      return false
    }
    return true
  }

  const validateUpiPayment = () => {
    if (!upiData.upiId.trim() || !upiData.upiId.includes("@")) {
      setError("Please enter a valid UPI ID")
      return false
    }
    return true
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    setError("")

    if (paymentMethod === "card" && !validateCardPayment()) {
      return
    }
    if (paymentMethod === "upi" && !validateUpiPayment()) {
      return
    }

    setLoading(true)

    try {
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

      const paymentData = {
        order_id: orderId,
        transaction_id: transactionId,
        payment_method: paymentMethod === "card" ? "card" : "upi",
        amount: Number.parseFloat(amount),
      }

      await apiClient.processPayment(paymentData)

      setSuccess(true)

      // Redirect to order tracking after 2 seconds
      setTimeout(() => {
        router.push(`/track/${orderId}`)
      }, 2000)
    } catch (err) {
      console.error("[v0] Payment error:", err)
      setError(err.message || "Payment processing failed. Please try again.")
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">Your payment has been processed successfully.</p>
          <p className="text-sm text-muted-foreground mb-6">Redirecting to order tracking...</p>
          <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/checkout" className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </Link>
          <h1 className="text-xl font-bold text-foreground">Payment</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl border border-border p-8 mb-8">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Order ID</p>
              <p className="text-lg font-bold text-foreground">{orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Amount to Pay</p>
              <p className="text-3xl font-bold text-orange-500">₹{amount}</p>
            </div>
          </div>

          <form onSubmit={handlePayment} className="space-y-6">
            {/* Payment Method Selection */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4">Select Payment Method</h2>
              <div className="space-y-3">
                {[
                  { value: "card", label: "Credit/Debit Card", icon: "💳" },
                  { value: "upi", label: "UPI", icon: "📱" },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                      paymentMethod === method.value
                        ? "border-orange-500 bg-orange-50"
                        : "border-border hover:border-orange-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 text-lg">{method.icon}</span>
                    <span className="ml-2 font-semibold text-foreground">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Card Payment Form */}
            {paymentMethod === "card" && (
              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="font-semibold text-foreground">Card Details</h3>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.cardNumber}
                    onChange={handleCardChange}
                    maxLength="19"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardHolder"
                    placeholder="John Doe"
                    value={cardData.cardHolder}
                    onChange={handleCardChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={cardData.expiryDate}
                      onChange={handleCardChange}
                      maxLength="5"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      placeholder="123"
                      value={cardData.cvv}
                      onChange={handleCardChange}
                      maxLength="3"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* UPI Payment Form */}
            {paymentMethod === "upi" && (
              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="font-semibold text-foreground">UPI Details</h3>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiData.upiId}
                    onChange={handleUpiChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    You will be redirected to your UPI app to complete the payment.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Security Notice */}
            <div className="bg-gray-50 border border-border rounded-lg p-4 flex items-start gap-3">
              <Lock className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Your payment information is secure and encrypted. We never store your card details.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Pay ₹{amount}
                </>
              )}
            </button>

            <p className="text-xs text-muted-foreground text-center">
              By clicking "Pay", you agree to our payment terms and conditions.
            </p>
          </form>
        </div>

        <div className="text-center">
          <Link href="/checkout" className="text-orange-500 hover:underline font-semibold">
            Back to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}
