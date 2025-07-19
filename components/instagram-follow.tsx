"use client"

import { Button } from "@/components/ui/button"
import { Instagram, Heart, Users, Camera } from "lucide-react"
import Link from "next/link"

export function InstagramFollow() {
  return (
    <section className="relative py-12 md:py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/4 -right-8 w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute -bottom-6 left-1/4 w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-indigo-400 to-pink-500 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-2 h-2 md:w-4 md:h-4 bg-purple-400 rounded-full opacity-40 animate-ping"></div>
        <div className="absolute bottom-1/4 right-1/4 w-3 h-3 md:w-6 md:h-6 bg-pink-400 rounded-full opacity-30 animate-ping"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Content */}
          <div className="mb-8 md:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-4 md:mb-6 shadow-lg">
              <Instagram className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>

            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              Follow Us on{" "}
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Instagram
              </span>
            </h2>

            <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
              Get inspired by our latest furniture designs, behind-the-scenes content, and customer transformations
            </p>

            {/* Instagram Button */}
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-6 md:px-8 py-3 md:py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 min-w-[280px] md:min-w-[450px] h-12 md:h-[90px] text-sm md:text-xl"
            >
              <Link
                href="https://www.instagram.com/revivefurniturepk/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 md:gap-4"
              >
                <Instagram className="w-8 h-8 md:w-[65px] md:h-[65px]" />
                <span className="md:hidden">Follow us</span>
                <span className="hidden md:inline">Follow us for updates</span>
              </Link>
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-12">
            <div className="text-center p-4 md:p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
              <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-2 md:mb-3">
                <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">1K+</div>
              <div className="text-sm md:text-base text-gray-600">Likes</div>
            </div>

            <div className="text-center p-4 md:p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
              <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-2 md:mb-3">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">500+</div>
              <div className="text-sm md:text-base text-gray-600">Followers</div>
            </div>

            <div className="text-center p-4 md:p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg sm:col-span-1 col-span-1 mx-auto sm:mx-0">
              <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-2 md:mb-3">
                <Camera className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">100+</div>
              <div className="text-sm md:text-base text-gray-600">Posts</div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 md:mt-12 text-center">
            <p className="text-sm md:text-base text-gray-500 mb-2 md:mb-4">Join our community and stay updated with:</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600">
              <span className="flex items-center gap-1 md:gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                Latest Designs
              </span>
              <span className="flex items-center gap-1 md:gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Customer Stories
              </span>
              <span className="flex items-center gap-1 md:gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                Behind the Scenes
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
