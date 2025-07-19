import { Phone, MapPin, MessageCircle, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800 relative">
      {/* Enhanced Circular Design Element with Contact Options */}
      <div className="absolute -top-36 left-1/2 transform -translate-x-1/2 z-10">
        {/* Clean Pulsing Wave Effects */}
        <div className="absolute inset-0 w-72 h-72 rounded-full bg-gradient-to-r from-red-500/15 to-orange-500/15 animate-pulse"></div>
        <div className="absolute inset-3 w-66 h-66 rounded-full bg-gradient-to-r from-red-500/10 to-orange-500/10 animate-pulse delay-1000"></div>
        <div className="absolute inset-6 w-60 h-60 rounded-full bg-gradient-to-r from-red-500/5 to-orange-500/5 animate-pulse delay-2000"></div>

        {/* Outer White Border - Bottom Half Only */}
        <div className="absolute inset-0 w-72 h-72 rounded-full">
          <div className="absolute bottom-0 left-0 w-full h-1/2 rounded-b-full border-4 border-white border-t-transparent"></div>
        </div>

        {/* Main Circle with Smooth Shadow */}
        <div className="relative w-72 h-72 bg-gradient-to-br from-[#C53D39] via-red-600 to-[#F1BA69] rounded-full flex flex-col items-center justify-center transform hover:scale-105 transition-all duration-500 shadow-[0_8px_30px_rgba(197,61,57,0.3),0_4px_15px_rgba(197,61,57,0.2)] hover:shadow-[0_12px_40px_rgba(197,61,57,0.4),0_6px_20px_rgba(197,61,57,0.3)]">
          {/* Content */}
          <div className="text-white text-center space-y-4 z-10">
            <div className="text-xl font-bold mb-3" style={{ fontFamily: "Dancing Script, cursive" }}>
              Get Special Offers
            </div>

            {/* Contact Buttons */}
            <div className="space-y-3">
              <a
                href="tel:+923066203252"
                className="flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Phone className="h-4 w-4" />
                <span>Call Us</span>
              </a>

              <a
                href="https://api.whatsapp.com/send?phone=923066203252&text=How%20can%20I%20help%20you%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-green-500/80 hover:bg-green-500 backdrop-blur-sm rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Subtle Sparkle Effects */}
          <div className="absolute top-8 right-8 w-1.5 h-1.5 bg-white/80 rounded-full animate-pulse delay-300"></div>
          <div className="absolute bottom-10 left-10 w-1 h-1 bg-yellow-300/70 rounded-full animate-pulse delay-700"></div>
          <div className="absolute top-16 left-8 w-1 h-1 bg-white/60 rounded-full animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16 pt-40">
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
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium">Email:</p>
                  <a href="mailto:revivefurniture01@gmail.com" className="hover:text-gray-900 transition-colors">
                    revivefurniture01@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium">Headquarters:</p>
                  <p className="text-sm leading-relaxed">
                    33 College Road, Sector B-1 Block A-1
                    <br />
                    Phase 1 Johar Town, Lahore, Pakistan
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium">Customer Service:</p>
                  <a href="mailto:customer.care@revivefurniture.pk" className="hover:text-gray-900 transition-colors">
                    customer.care@revivefurniture.pk
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-300">
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
              <Link href="/faq" className="hover:text-gray-900 transition-colors">
                FAQs
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
