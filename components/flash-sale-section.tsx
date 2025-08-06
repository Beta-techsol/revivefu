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
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url('/flash-sale-bg.avif')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
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

            {/* Main Heading */}
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              Luxury Comfort Upholstered Lounge Armchair
            </h2>

            {/* Description */}
            <p className="text-gray-200 text-base lg:text-lg mb-8 leading-relaxed max-w-md">
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
              {/* Main Chair Image */}
              <div className="relative z-20">
                <img
                  src="/placeholder.svg?height=500&width=600"
                  alt="Luxury Comfort Upholstered Lounge Armchair"
                  className="w-full h-auto max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto"
                />
                
                {/* 50% OFF Badge */}
                <div className="absolute top-8 left-8 lg:top-12 lg:left-12 z-30">
                  <div className="bg-yellow-400 rounded-full w-20 h-20 lg:w-24 lg:h-24 flex flex-col items-center justify-center transform rotate-12 shadow-lg">
                    <span className="text-xs lg:text-sm font-bold text-gray-900">Hurry Up!</span>
                    <span className="text-lg lg:text-xl font-black text-gray-900">50%</span>
                    <span className="text-xs lg:text-sm font-bold text-gray-900">OFF</span>
                    <span className="text-xs font-medium text-gray-700">For All Items</span>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10">
                {/* Plant in Basket */}
                <div className="relative">
                  <img
                    src="/placeholder.svg?height=300&width=200"
                    alt="Decorative Plant"
                    className="w-32 lg:w-48 h-auto"
                  />
                  {/* Animated Hotspot for Plant */}
                  <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 bg-white rounded-full animate-pulse shadow-lg">
                      <div className="w-2 h-2 bg-teal-600 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12 z-10">
                {/* Side Table */}
                <div className="relative">
                  <img
                    src="/placeholder.svg?height=200&width=150"
                    alt="Wooden Side Table"
                    className="w-24 lg:w-32 h-auto"
                  />
                  {/* Animated Hotspot for Table */}
                  <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 bg-white rounded-full animate-pulse shadow-lg">
                      <div className="w-2 h-2 bg-teal-600 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute top-8 right-16 lg:top-12 lg:right-24 z-10">
                {/* Floor Lamp */}
                <div className="relative">
                  <img
                    src="/placeholder.svg?height=400&width=100"
                    alt="Gold Floor Lamp"
                    className="w-16 lg:w-20 h-auto"
                  />
                  {/* Animated Hotspot for Lamp */}
                  <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 bg-white rounded-full animate-pulse shadow-lg">
                      <div className="w-2 h-2 bg-teal-600 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-16 left-8 lg:bottom-20 lg:left-12 z-10">
                {/* Decorative Vase */}
                <div className="relative">
                  <img
                    src="/placeholder.svg?height=150&width=80"
                    alt="Decorative Vase"
                    className="w-12 lg:w-16 h-auto"
                  />
                  {/* Animated Hotspot for Vase */}
                  <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 bg-white rounded-full animate-pulse shadow-lg">
                      <div className="w-2 h-2 bg-teal-600 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Animation for Main Chair */}
              <div className="absolute inset-0 z-0">
                <div className="w-full h-full animate-pulse opacity-20">
                  <div className="w-64 h-64 lg:w-80 lg:h-80 bg-white rounded-full blur-3xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
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
