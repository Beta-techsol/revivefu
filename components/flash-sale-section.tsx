"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'

export function FlashSaleSection() {
  const [timeLeft, setTimeLeft] = useState({
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
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-teal-800 to-teal-900 min-h-[600px] lg:min-h-[700px]">
      <div className="relative z-10 w-full h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full min-h-[600px] lg:min-h-[700px]">
          {/* Left Content - 35% */}
          <div className="lg:col-span-4 flex flex-col justify-center px-6 lg:px-12 xl:px-16 py-12 lg:py-0">
            {/* Flash Sale Badge */}
            <div className="mb-8">
              <span className="inline-block text-yellow-400 font-bold text-sm lg:text-base tracking-wider uppercase">
                FLASH SALE!
              </span>
            </div>

            {/* Countdown Timer */}
            <div className="flex gap-3 mb-8">
              <div className="bg-white rounded-lg p-3 lg:p-4 text-center min-w-[60px] lg:min-w-[70px]">
                <div className="text-xl lg:text-2xl font-bold text-gray-900">
                  {timeLeft.days.toString().padStart(3, '0')}
                </div>
                <div className="text-xs lg:text-sm text-gray-600 font-medium">
                  Days
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 lg:p-4 text-center min-w-[60px] lg:min-w-[70px]">
                <div className="text-xl lg:text-2xl font-bold text-gray-900">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </div>
                <div className="text-xs lg:text-sm text-gray-600 font-medium">
                  Hours
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 lg:p-4 text-center min-w-[60px] lg:min-w-[70px]">
                <div className="text-xl lg:text-2xl font-bold text-gray-900">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-xs lg:text-sm text-gray-600 font-medium">
                  Mins
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 lg:p-4 text-center min-w-[60px] lg:min-w-[70px]">
                <div className="text-xl lg:text-2xl font-bold text-gray-900">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-xs lg:text-sm text-gray-600 font-medium">
                  Sec
                </div>
              </div>
            </div>

            {/* Main Heading - Split into 2 lines with smaller font */}
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-6 leading-tight">
              Luxury Comfort Upholstered<br />
              Lounge Armchair
            </h2>

            {/* Description - 15px font size */}
            <p className="text-gray-200 mb-8 leading-relaxed max-w-md" style={{ fontSize: '15px' }}>
              Experience everyday luxury with our Soft Weave sofa, crafted in premium fabric for cozy seating and timeless modern appeal—perfect for any living space.
            </p>

            {/* CTA Button */}
            <Button 
              className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition-all duration-300 w-fit group"
            >
              LEARN MORE
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Right Image Section - 65% */}
          <div className="lg:col-span-8 relative flex items-center justify-center p-6 lg:p-12">
            <div className="relative w-full h-full max-w-4xl">
              {/* Main Furniture Scene Image */}
              <div className="relative z-20 w-full h-full flex items-center justify-center">
                <img
                  src="/flash-sale-bg.avif"
                  alt="Luxury Comfort Upholstered Lounge Armchair Scene"
                  className="w-full h-auto max-w-full max-h-full object-contain"
                />
                
                {/* Animated Hotspots */}
                {/* Hotspot 1 - Chair */}
                <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-4 h-4 bg-white rounded-full animate-pulse shadow-lg cursor-pointer hover:scale-110 transition-transform">
                      <div className="w-2 h-2 bg-teal-600 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                    <div className="absolute -top-2 -left-2 w-8 h-8 border-2 border-white rounded-full animate-ping opacity-75"></div>
                  </div>
                </div>

                {/* Hotspot 2 - Plant */}
                <div className="absolute top-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-4 h-4 bg-white rounded-full animate-pulse shadow-lg cursor-pointer hover:scale-110 transition-transform">
                      <div className="w-2 h-2 bg-teal-600 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                    <div className="absolute -top-2 -left-2 w-8 h-8 border-2 border-white rounded-full animate-ping opacity-75"></div>
                  </div>
                </div>

                {/* Hotspot 3 - Lamp */}
                <div className="absolute top-1/6 right-1/6 transform translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-4 h-4 bg-white rounded-full animate-pulse shadow-lg cursor-pointer hover:scale-110 transition-transform">
                      <div className="w-2 h-2 bg-teal-600 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                    <div className="absolute -top-2 -left-2 w-8 h-8 border-2 border-white rounded-full animate-ping opacity-75"></div>
                  </div>
                </div>

                {/* Hotspot 4 - Side Table */}
                <div className="absolute bottom-1/4 right-1/3 transform translate-x-1/2 translate-y-1/2">
                  <div className="relative">
                    <div className="w-4 h-4 bg-white rounded-full animate-pulse shadow-lg cursor-pointer hover:scale-110 transition-transform">
                      <div className="w-2 h-2 bg-teal-600 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                    <div className="absolute -top-2 -left-2 w-8 h-8 border-2 border-white rounded-full animate-ping opacity-75"></div>
                  </div>
                </div>

                {/* Hotspot 5 - Decorative Item */}
                <div className="absolute bottom-1/3 left-1/4 transform -translate-x-1/2 translate-y-1/2">
                  <div className="relative">
                    <div className="w-4 h-4 bg-white rounded-full animate-pulse shadow-lg cursor-pointer hover:scale-110 transition-transform">
                      <div className="w-2 h-2 bg-teal-600 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                    <div className="absolute -top-2 -left-2 w-8 h-8 border-2 border-white rounded-full animate-ping opacity-75"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional CSS for custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-pulse-ring {
          animation: pulse-ring 2s ease-out infinite;
        }
      `}</style>
    </section>
  )
}
