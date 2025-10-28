export function Footer() {
  return (
    <footer className="bg-foreground text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">At Table</h3>
            <p className="text-gray-300 text-sm">Smart canteen ordering system for seamless dining experience.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/menu" className="hover:text-white transition">
                  Menu
                </a>
              </li>
              <li>
                <a href="/admin" className="hover:text-white transition">
                  Admin
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white transition">
                  Home
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-sm text-gray-300">Email: support@attable.com</p>
            <p className="text-sm text-gray-300">Phone: +91 9876543210</p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-300">
          <p>&copy; 2025 At Table. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
