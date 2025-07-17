"use client"

import { Phone, Mail, MapPin, Clock } from "lucide-react"

export function TopBar() {
  return (
    <div className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white py-3 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-sm md:text-base lg:text-lg font-medium font-poppins">+92 300 1234567</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-sm md:text-base lg:text-lg font-medium font-poppins">info@revivefurniture.com</span>
            </div>
          </div>

          {/* Business Hours & Location */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-sm md:text-base lg:text-lg font-medium font-poppins">Mon-Sat: 9AM-8PM</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-sm md:text-base lg:text-lg font-medium font-poppins">Lahore, Pakistan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
