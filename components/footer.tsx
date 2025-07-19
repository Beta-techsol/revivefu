"use client"

import { Phone, MapPin, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-[#d4dde6] text-gray-800 relative overflow-hidden">
      {/* Animated Wave Effects */}
      <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
        <div className="relative">
          {/* Outer wave rings */}
          <div className="absolute inset-0 w-48 h-48 rounded-full border-2 border-red-300 opacity-30 animate-ping animation-delay-0"></div>
          <div className="absolute inset-2 w-44 h-44 rounded-full border-2 border-orange-300 opacity-40 animate-ping animation-delay-1000"></div>
          <div className="absolute inset-4 w-40 h-40 rounded-full border-2 border-red-400 opacity-50 animate-ping animation-delay-2000"></div>
        </div>
      </div>

      {/* Main Circular Element - Half in footer, half out */}
      <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-gradient-to-br from-white to-pink-50 rounded-full flex flex-col items-center justify-center shadow-2xl z-20 border-4 border-white">
        <div className="text-center mb-3">
          <div className="text-xs font-semibold text-gray-700 mb-1">Get Special Offers</div>
          <div className="text-xs text-gray-600">Contact us now!</div>
        </div>

        {/* Contact Buttons */}
        <div className="flex flex-col space-y-2">
          <a
            href="https://api.whatsapp.com/send?phone=923066203252&text=How%20can%20I%20help%20you%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105"
          >
            <MessageCircle className="h-3 w-3" />
            <span>WhatsApp</span>
          </a>

          <a
            href="tel:+923066203252"
            className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105"
          >
            <Phone className="h-3 w-3" />
            <span>Call Us</span>
          </a>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16 pt-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-6 sm:col-span-2 lg:col-span-1">
            <Image src="/logo.webp" alt="Revive Furniture" width={200} height={60} className="h-12 w-auto" />
            <p className="text-gray-700 leading-relaxed text-sm">
              Transform your living space with our premium furniture collection. Quality craftsmanship meets modern
              design for the perfect home.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">f</span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">t</span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">i</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-6 text-gray-900">Quick Links</h3>
            <ul className="space-y-3 text-gray-700 text-sm">
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

          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-6 text-gray-900">Categories</h3>
            <ul className="space-y-3 text-gray-700 text-sm">
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

          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-6 text-gray-900">Contact Info</h3>
            <div className="space-y-4 text-gray-700 text-sm">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-red-500 flex-shrink-0" />
                <span>123 Furniture Street, Design City, DC 12345</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-400">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-700 text-sm text-center md:text-left">
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
            <div className="flex flex-wrap justify-center md:justify-end space-x-4 md:space-x-6 text-sm text-gray-700">
              <Link href="/privacy-policy" className="hover:text-gray-900 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-conditions" className="hover:text-gray-900 transition-colors">
                Terms of Service
              </Link>
              <Link href="/returns-refunds" className="hover:text-gray-900 transition-colors">
                Return Policy
              </Link>
              <Link href="/faq" className="hover:text-gray-900 transition-colors">
                FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animation-delay-0 {
          animation-delay: 0s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        @media (max-width: 640px) {
          .absolute.-top-20 {
            top: -60px;
          }
          
          .w-40.h-40 {
            width: 120px;
            height: 120px;
          }
          
          .w-48.h-48 {
            width: 140px;
            height: 140px;
          }
          
          .w-44.h-44 {
            width: 130px;
            height: 130px;
          }
          
          .w-40.h-40 {
            width: 120px;
            height: 120px;
          }
        }
      `}</style>
    </footer>
  )
}
