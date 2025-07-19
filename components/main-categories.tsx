"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function MainCategories() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our extensive collection of premium furniture designed to transform your space
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto">
          {/* Living Room - Main Featured Card */}
          <Card className="md:col-span-6 group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative h-[300px] md:h-[400px] overflow-hidden">
              <Image
                src="/shop/products/sofa-1.jpg"
                alt="Living Room Furniture"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">Living Room</h3>
                <p className="text-gray-200 mb-4 text-sm md:text-base">
                  Comfortable sofas, elegant coffee tables, and stylish entertainment units
                </p>
                <Button
                  asChild
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                >
                  <Link href="/shop?category=living-room" className="flex items-center gap-2">
                    Shop Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </div>
          </Card>

          {/* Bedroom */}
          <Card className="md:col-span-3 group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative h-[250px] md:h-[190px] overflow-hidden">
              <Image
                src="/shop/products/bed-1.jpg"
                alt="Bedroom Furniture"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <CardContent className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg md:text-xl font-bold mb-1">Bedroom</h3>
                <p className="text-gray-200 mb-3 text-xs md:text-sm">Beds, wardrobes & more</p>
                <Button
                  asChild
                  size="sm"
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all duration-300 text-xs"
                >
                  <Link href="/shop?category=bedroom">
                    Explore
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </div>
          </Card>

          {/* Dining Room */}
          <Card className="md:col-span-3 group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative h-[250px] md:h-[190px] overflow-hidden">
              <Image
                src="/shop/products/dining-table-1.jpg"
                alt="Dining Room Furniture"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <CardContent className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg md:text-xl font-bold mb-1">Dining Room</h3>
                <p className="text-gray-200 mb-3 text-xs md:text-sm">Tables, chairs & sets</p>
                <Button
                  asChild
                  size="sm"
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all duration-300 text-xs"
                >
                  <Link href="/shop?category=dining-room">
                    Explore
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </div>
          </Card>

          {/* Kitchen */}
          <Card className="md:col-span-3 sm:col-span-6 group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative h-[250px] md:h-[190px] overflow-hidden">
              <Image
                src="/shop/products/chair-1.jpg"
                alt="Kitchen Furniture"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <CardContent className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg md:text-xl font-bold mb-1">Kitchen</h3>
                <p className="text-gray-200 mb-3 text-xs md:text-sm">Cabinets & storage</p>
                <Button
                  asChild
                  size="sm"
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all duration-300 text-xs"
                >
                  <Link href="/shop?category=kitchen">
                    Explore
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </div>
          </Card>

          {/* Office */}
          <Card className="md:col-span-3 sm:col-span-6 group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative h-[250px] md:h-[190px] overflow-hidden">
              <Image
                src="/products/executive-office-desk.webp"
                alt="Office Furniture"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <CardContent className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg md:text-xl font-bold mb-1">Office</h3>
                <p className="text-gray-200 mb-3 text-xs md:text-sm">Desks, chairs & storage</p>
                <Button
                  asChild
                  size="sm"
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all duration-300 text-xs"
                >
                  <Link href="/shop?category=office">
                    Explore
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </div>
          </Card>

          {/* Storage Solutions */}
          <Card className="md:col-span-6 group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative h-[250px] md:h-[190px] overflow-hidden">
              <Image
                src="/shop/products/wardrobe-1.jpg"
                alt="Storage Solutions"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <CardContent className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-xl md:text-2xl font-bold mb-2">Storage Solutions</h3>
                <p className="text-gray-200 mb-3 text-sm">
                  Wardrobes, cabinets, and organizational furniture for every room
                </p>
                <Button
                  asChild
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                >
                  <Link href="/shop?category=storage" className="flex items-center gap-2">
                    Shop Storage
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-12">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-[#C53D39] to-[#E85A4F] hover:from-[#B12E2A] hover:to-[#D74B3F] text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Link href="/shop" className="flex items-center gap-2">
              View All Categories
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
