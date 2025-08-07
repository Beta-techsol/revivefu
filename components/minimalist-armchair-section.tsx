"use client"

import Image from "next/image"
import Link from "next/link"

export function MinimalistArmchairSection() {
  return (
    <section className="w-full bg-white py-[2%] md:py-[2%] relative overflow-hidden">
      <div className="container mx-auto px-[5%]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
            {/* Subtitle with Dancing Script */}
            <p className="text-orange-500 font-dancing-script text-2xl md:text-3xl font-medium">Premium Collection</p>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Modern Comfort
              <br />
              <span className="text-gray-700">Redefined</span>
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-md">
              Experience the perfect blend of contemporary design and unmatched comfort with our carefully curated
              armchair collection.
            </p>

            {/* Shop Now Button */}
            <div className="pt-4">
              <Link
                href="/shop"
                className="inline-block bg-gray-900 text-white px-8 py-4 font-semibold text-lg hover:bg-gray-800 transition-colors duration-300"
                style={{ borderRadius: "7px" }}
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative order-1 lg:order-2">
            <div className="relative h-[500px] md:h-[500px] lg:h-[500px] w-full">
             <Image
  src="/showcase/armchair.avif"
  alt="Modern Premium Armchair"
  className="h-full w-auto object-contain"
  priority
/>


            </div>
          </div>
        </div>

        {/* 50% OFF Circle - Positioned to span both columns */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 bg-red-500 rounded-full flex items-center justify-center shadow-lg transform -rotate-[20deg]">
            <div className="text-center">
              <span className="text-white font-dancing-script text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                50%
                <br />
                OFF
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
