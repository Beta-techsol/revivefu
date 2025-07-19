"use client"

import { Phone, MapPin, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800 relative overflow-hidden">
      {/* Animated Wave Effects - Around the circle */}
      <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 z-10">
        <div className="relative">
          {/* Outer wave rings positioned around the circle */}
          <div
            className="absolute -inset-8 w-80 h-80 rounded-full border-2 border-red-300 opacity-20 animate-ping"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="absolute -inset-4 w-72 h-72 rounded-full border-2 border-orange-300 opacity-30 animate-ping"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute inset-0 w-64 h-64 rounded-full border-2 border-red-400 opacity-40 animate-ping"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
      </div>

      {/* Large Circular Element with Website Branding Gradient */}
      <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex flex-col items-center justify-center shadow-2xl z-50 border-4 border-white">
        <div className="text-center mb-4">
          <div className="text-sm font-bold text-white mb-1">Get Special Offers</div>
          <div className="text-xs text-white/90 px-4">Join thousands of furniture lovers and get exclusive deals!</div>
        </div>

        {/* Contact Buttons */}
        <div className="flex flex-col space-y-3 w-full px-8">
          <a
            href="https://api.whatsapp.com/send?phone=923066203252&text=How%20can%20I%20help%20you%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <MessageCircle className="h-4 w-4" />
            <span>WhatsApp</span>
          </a>

          <a
            href="tel:+923066203252"
            className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-red-500 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg border-2 border-white"
          >
            <Phone className="h-4 w-4" />
            <span>Call Us</span>
          </a>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16 pt-36">
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
      <div className="border-t border-gray-300">
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
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%, 100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 4s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .absolute.-top-32 {
            top: -80px;
          }
          
          .w-64.h-64 {
            width: 200px;
            height: 200px;
          }
          
          .w-80.h-80 {
            width: 240px;
            height: 240px;
          }
          
          .w-72.h-72 {
            width: 220px;
            height: 220px;
          }
          
          .pt-36 {
            padding-top: 6rem;
          }
        }
        
        @media (max-width: 640px) {
          .absolute.-top-32 {
            top: -60px;
          }
          
          .w-64.h-64 {
            width: 160px;
            height: 160px;
          }
          
          .w-80.h-80 {
            width: 200px;
            height: 200px;
          }
          
          .w-72.h-72 {
            width: 180px;
            height: 180px;
          }
          
          .pt-36 {
            padding-top: 4rem;
          }
          
          .px-8 {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
    </footer>
  )
}
