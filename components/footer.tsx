import { MapPin, Mail, Facebook, Instagram } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800 relative">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-6">
            <Image src="/logo.webp" alt="Revive Furniture" width={200} height={60} className="h-12 w-auto" />
            <p className="text-gray-700 leading-relaxed">
              Transform your living space with our premium furniture collection. Quality craftsmanship meets modern
              design for the perfect home.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/ReviveFurnituree?mibextid=ZbWKwL"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.instagram.com/revivefurniturepk/?igsh=aTZtaWM1cXZ1aWhm#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://pin.it/KRTdbZQvQ"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
              >
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12C24.007 5.367 18.641.001 12.017.001z" />
                </svg>
              </a>
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
                <Link href="/track-order" className="hover:text-gray-900 transition-colors">
                  Track Orders
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
                <Link href="/shop?search=Living%20Room" className="hover:text-gray-900 transition-colors">
                  Living Room
                </Link>
              </li>
              <li>
                <Link href="/shop?search=Bed%20Room" className="hover:text-gray-900 transition-colors">
                  Bedroom
                </Link>
              </li>
              <li>
                <Link href="/shop?search=Dining%20Room" className="hover:text-gray-900 transition-colors">
                  Dining Room
                </Link>
              </li>
              <li>
                <Link href="/shop?search=Office" className="hover:text-gray-900 transition-colors">
                  Office
                </Link>
              </li>
              <li>
                <Link href="/shop?search=Gaming%20Room" className="hover:text-gray-900 transition-colors">
                  Gaming Room
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
