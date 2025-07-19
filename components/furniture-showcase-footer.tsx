"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock, Award, Users, Truck } from "lucide-react"

export default function FurnitureShowcaseFooter() {
  const [email, setEmail] = useState("")

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle subscription logic here
    console.log("Subscribing email:", email)
    setEmail("")
  }

  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-gray-100 pb-[100px]">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[500px]">
          {/* Left Section - Newsletter */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
            <div>
              <h2
                className="text-[40px] font-bold text-gray-900 mb-4 bg-gradient-to-r from-[#C53D39] via-[#E94E37] to-[#F1BA69] bg-[length:400%_100%] bg-clip-text text-transparent animate-shimmer-smooth"
                style={{
                  fontFamily: "Dancing Script, cursive",
                  letterSpacing: "0.2em",
                }}
              >
                Subscribe Us
              </h2>
              <p className="text-lg text-gray-600 mb-8 font-poppins">
                Stay updated with our latest furniture collections, exclusive offers, and interior design tips.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-[#C53D39] focus:ring-0 font-poppins"
                  required
                />
                <Button
                  type="submit"
                  className="h-12 px-8 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg font-poppins"
                >
                  Subscribe
                </Button>
              </div>
              <p className="text-sm text-gray-500 font-poppins">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
              </p>
            </form>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#C53D39] font-montserrat">500+</div>
                <div className="text-sm text-gray-600 font-poppins">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#C53D39] font-montserrat">50+</div>
                <div className="text-sm text-gray-600 font-poppins">Furniture Sets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#C53D39] font-montserrat">5+</div>
                <div className="text-sm text-gray-600 font-poppins">Years Experience</div>
              </div>
            </div>
          </div>

          {/* Middle Section - Features */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
              <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col justify-center">
                <CardContent className="p-6 text-center">
                  <Award className="w-12 h-12 text-[#C53D39] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-montserrat">Premium Quality</h3>
                  <p className="text-gray-600 text-sm font-poppins">
                    Handcrafted furniture with attention to every detail and premium materials.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col justify-center">
                <CardContent className="p-6 text-center">
                  <Truck className="w-12 h-12 text-[#C53D39] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-montserrat">Free Delivery</h3>
                  <p className="text-gray-600 text-sm font-poppins">
                    Complimentary delivery and setup service for all orders above $500.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col justify-center">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-[#C53D39] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-montserrat">Expert Support</h3>
                  <p className="text-gray-600 text-sm font-poppins">
                    Professional interior design consultation and customer support.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col justify-center">
                <CardContent className="p-6 text-center">
                  <Clock className="w-12 h-12 text-[#C53D39] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-montserrat">Quick Service</h3>
                  <p className="text-gray-600 text-sm font-poppins">
                    Fast processing and delivery within 7-14 business days.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Section - Vertical Text */}
          <div className="lg:col-span-2 flex items-center justify-center h-full">
            <div className="flex items-center justify-center h-full">
              <div
                className="text-6xl font-bold text-gray-300 transform -rotate-90 whitespace-nowrap font-montserrat tracking-wider"
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  transform: "rotate(180deg)",
                }}
              >
                FURNITURE
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Bar */}
      <div className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-white space-y-2 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-poppins">+92 306 6203252</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span className="text-sm font-poppins">revivefurniture01@gmail.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-poppins">Johar Town, Lahore, Pakistan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
