"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import Image from "next/image"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function FlashSaleSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 370,
    hours: 12,
    minutes: 11,
    seconds: 9
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev
        
        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        } else if (days > 0) {
          days--
          hours = 23
          minutes = 59
          seconds = 59
        }
        
        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-900"
        style={{
          backgroundImage: `url('/flash-sale-bg.avif')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 w-full px-[3%] py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[500px]">
          
          {/* Left Content */}
          <div className="space-y-8 lg:space-y-10">
            {/* Flash Sale Badge */}
            <div className="inline-block">
              <span className="text-yellow-400 font-bold text-sm lg:text-base tracking-wider uppercase">
                FLASH SALE!
              </span>
            </div>

            {/* Countdown Timer */}
            <div className="flex gap-3 lg:gap-4">
              <div className="bg-white rounded-lg p-3 lg:p-4 text-center min-w-[60px] lg:min-w-[70px]">
                <div className="text-xl lg:text-2xl font-bold text-gray-900">
                  {timeLeft.days.toString().padStart(3, '0')}
                </div>
                <div className="text-xs lg:text-sm text-gray-600 mt-1">Days</div>
              </div>
              <div className="bg-white rounded-lg p-3 lg:p-4 text-center min-w-[60px] lg:min-w-[70px]">
                <div className="text-xl lg:text-2xl font-bold text-gray-900">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </div>
                <div className="text-xs lg:text-sm text-gray-600 mt-1">Hours</div>
              </div>
              <div className="bg-white rounded-lg p-3 lg:p-4 text-center min-w-[60px] lg:min-w-[70px]">
                <div className="text-xl lg:text-2xl font-bold text-gray-900">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-xs lg:text-sm text-gray-600 mt-1">Mins</div>
              </div>
              <div className="bg-white rounded-lg p-3 lg:p-4 text-center min-w-[60px] lg:min-w-[70px]">
                <div className="text-xl lg:text-2xl font-bold text-gray-900">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-xs lg:text-sm text-gray-600 mt-1">Sec</div>
              </div>
            </div>

            {/* Main Heading */}
            <div>
              <h2 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                Luxury Comfort Upholstered
                <br />
                Lounge Armchair
              </h2>
            </div>

            {/* Description */}
            <div className="max-w-md">
              <p className="text-white/90 text-base lg:text-lg leading-relaxed">
                Experience everyday luxury with our Soft Weave sofa, crafted in premium fabric for cozy seating and timeless modern appeal—perfect for any living space.
              </p>
            </div>

            {/* CTA Button */}
            <div>
              <Button 
                className="bg-white text-gray-900 hover:bg-gray-100 px-6 lg:px-8 py-3 lg:py-4 text-sm lg:text-base font-semibold rounded-none transition-all duration-300 group"
              >
                LEARN MORE
                <ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Right Content - Product Showcase */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main Product Image */}
              <div className="relative z-10">
                <Image
                  src="/showcase/armchair.avif"
                  alt="Luxury Comfort Upholstered Lounge Armchair"
                  width={500}
                  height={500}
                  className="w-full max-w-[400px] lg:max-w-[500px] h-auto object-contain"
                  priority
                />
                
                {/* Discount Badge */}
                <div className="absolute top-8 lg:top-12 right-8 lg:right-12 z-20">
                  <div className="relative">
                    <div className="w-20 h-20 lg:w-24 lg:h-24 bg-yellow-400 rounded-full flex flex-col items-center justify-center transform rotate-12 shadow-lg">
                      <span className="text-xs lg:text-sm font-bold text-gray-900 leading-none">Hurry Up!</span>
                      <span className="text-xl lg:text-2xl font-black text-gray-900 leading-none">50%</span>
                      <span className="text-xs lg:text-sm font-bold text-gray-900 leading-none">OFF</span>
                      <span className="text-[10px] lg:text-xs text-gray-700 leading-none mt-1">For All Items</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 lg:right-20 z-0">
                {/* Plant */}
                <div className="w-32 h-40 lg:w-40 lg:h-48 opacity-80">
                  <div className="w-full h-full bg-gradient-to-b from-green-400 to-green-600 rounded-full blur-sm"></div>
                </div>
              </div>

              {/* Side Table */}
              <div className="absolute bottom-0 right-0 lg:right-16 z-5">
                <div className="w-24 h-32 lg:w-32 lg:h-40 bg-gradient-to-b from-amber-200 to-amber-400 rounded-lg opacity-60"></div>
              </div>

              {/* Floor Lamp */}
              <div className="absolute top-4 right-4 lg:right-8 z-5">
                <div className="w-2 h-32 lg:h-40 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
                <div className="w-8 h-4 lg:w-10 lg:h-5 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full -mt-2 -ml-3 lg:-ml-4"></div>
              </div>

              {/* Basket */}
              <div className="absolute bottom-8 right-8 lg:right-12 z-5">
                <div className="w-16 h-20 lg:w-20 lg:h-24 bg-gradient-to-b from-amber-700 to-amber-900 rounded-lg opacity-70"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Right Decorative Element */}
      <div className="absolute bottom-8 right-8 z-10">
        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <div className="w-6 h-6 lg:w-8 lg:h-8 border-2 border-white/60 rounded-full"></div>
        </div>
      </div>
    </section>
  )
}
