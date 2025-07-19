import { Phone, MapPin, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-[#abb8c3] text-gray-800 relative">
      {/* Enhanced Circular Design Element with Contact Options */}
      <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 z-10">
        {/* Pulsing Wave Effects */}
        <div className="absolute inset-0 w-48 h-48 rounded-full bg-gradient-to-r from-red-500/30 to-orange-500/30 animate-ping"></div>
        <div className="absolute inset-2 w-44 h-44 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 animate-pulse delay-75"></div>
        <div className="absolute inset-4 w-40 h-40 rounded-full bg-gradient-to-r from-red-500/10 to-orange-500/10 animate-ping delay-150"></div>

        {/* Main Circle with Clean Design */}
        <div className="relative w-48 h-48 bg-gradient-to-br from-[#C53D39] via-red-600 to-[#F1BA69] rounded-full flex flex-col items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
          {/* Half Circle White Border - Bottom Half Only */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent">
            <div className="absolute bottom-0 left-0 w-full h-1/2 rounded-b-full border-4 border-white border-t-transparent"></div>
          </div>

          {/* Content */}
          <div className="text-white text-center space-y-3 z-10">
            <div className="text-sm font-bold mb-2">Get Special Offers</div>

            {/* Contact Buttons */}
            <div className="space-y-2">
              <a
                href="tel:+923066203252"
                className="flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 hover:scale-105"
              >
                <Phone className="h-3 w-3" />
                <span>Call Us</span>
              </a>

              <a
                href="https://api.whatsapp.com/send?phone=923066203252&text=How%20can%20I%20help%20you%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-green-500/80 hover:bg-green-500 backdrop-blur-sm rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 hover:scale-105"
              >
                <MessageCircle className="h-3 w-3" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Sparkle Effects */}
          <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-6 left-6 w-1 h-1 bg-yellow-300 rounded-full animate-ping delay-300"></div>
          <div className="absolute top-8 left-4 w-1.5 h-1.5 bg-white/80 rounded-full animate-pulse delay-500"></div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16 pt-28">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-6">
            <Image src="/logo.webp" alt="Revive Furniture" width={200} height={60} className="h-12 w-auto" />
            <p className="text-gray-700 leading-relaxed">
              Transform your living space with our premium furniture collection. Quality craftsmanship meets modern
              design for the perfect home.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                <span className="text-white font-bold">f</span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                <span className="text-white font-bold">t</span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                <span className="text-white font-bold">i</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6 text-gray-900">Quick Links</h3>
            <ul className="space-y-3 text-gray-700">
              <li>
                <Link href="/" className="hover:text-gray-900 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-gray-900 transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-gray-900 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gray-900 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-900 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gray-900 transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6 text-gray-900">Categories</h3>
            <ul className="space-y-3 text-gray-700">
              <li>
                <Link href="/living-room" className="hover:text-gray-900 transition-colors">
                  Living Room
                </Link>
              </li>
              <li>
                <Link href="/bedroom" className="hover:text-gray-900 transition-colors">
                  Bedroom
                </Link>
              </li>
              <li>
                <Link href="/dining-room" className="hover:text-gray-900 transition-colors">
                  Dining Room
                </Link>
              </li>
              <li>
                <Link href="/office" className="hover:text-gray-900 transition-colors">
                  Office
                </Link>
              </li>
              <li>
                <Link href="/outdoor" className="hover:text-gray-900 transition-colors">
                  Outdoor
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6 text-gray-900">Contact Info</h3>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-red-500" />
                <a href="tel:+923066203252" className="hover:text-gray-900 transition-colors">
                  Call us: (+92)-306-6203252
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-5 w-5 text-green-500" />
                <a
                  href="https://api.whatsapp.com/send?phone=923066203252&text=How%20can%20I%20help%20you%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900 transition-colors"
                >
                  WhatsApp us
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-red-500" />
                <span>123 Furniture Street, Design City, DC 12345</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-600">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-700 text-sm">
              &copy; 2013-2025 Revive Furniture. All rights reserved. Powered by{" "}
              <a
                href="https://beta-tech.solutions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-800 transition-colors font-medium"
              >
                Beta Tech Solutions
              </a>
            </p>
            <div className="flex space-x-6 text-sm text-gray-700">
              <Link href="/privacy-policy" className="hover:text-gray-900 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-conditions" className="hover:text-gray-900 transition-colors">
                Terms of Service
              </Link>
              <Link href="/returns-refunds" className="hover:text-gray-900 transition-colors">
                Return Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
