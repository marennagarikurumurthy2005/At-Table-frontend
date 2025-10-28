"use client"
import Link from "next/link"
import { ShoppingCart, Zap, Users } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
      
      <main className="min-h-screen bg-gradient-to-br from-background to-slate-50">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold text-foreground mb-6 leading-tight">
                Order Food. <span className="text-orange-500">Instantly.</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Skip the queues. Order from your table, track your food in real-time, and enjoy your meal without the
                wait.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/menu"
                  className="px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
                >
                  Start Ordering
                </Link>
                <Link
                  href="/menu"
                  className="px-8 py-3 border-2 border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-50 transition"
                >
                  Browse Menu
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl h-96 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="w-24 h-24 text-orange-500 mx-auto mb-4" />
                <p className="text-muted-foreground">Food ordering interface</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-20 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-center text-foreground mb-12">Why Choose At Table?</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: "Lightning Fast", desc: "Order in seconds, not minutes" },
                { icon: ShoppingCart, title: "Easy Ordering", desc: "Browse menu, add items, checkout" },
                { icon: Users, title: "Real-time Updates", desc: "Track your order status live" },
              ].map((feature, i) => (
                <div key={i} className="p-6 border border-border rounded-xl hover:shadow-lg transition">
                  <feature.icon className="w-8 h-8 text-orange-500 mb-4" />
                  <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to Order?</h3>
            <p className="text-orange-100 mb-8">Start ordering your favorite food right now!</p>
            <Link
              href="/menu"
              className="inline-block px-8 py-3 bg-white text-orange-500 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Order Now
            </Link>
          </div>
        </section>
      </main>
      {/* <Footer /> */}
    </>
  )
}
