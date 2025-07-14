import Link from "next/link"
import { ShoppingBag, ArrowRight } from "lucide-react"

export default function ProjectCTA() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Header */}
          <h2 className="text-4xl font-bold text-gray-900 mb-6 font-urbanist">Inspired by this project?</h2>
          <p className="text-lg text-gray-600 mb-12 leading-relaxed">
            Discover similar furniture pieces and design elements from our curated collection to bring this aesthetic to
            your own space.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* Primary Button */}
            <Link href="/shop">
              <button className="group relative inline-flex items-center justify-center px-8 py-4 h-14 min-w-[280px] text-lg font-semibold text-white bg-gradient-to-r from-[#C53D39] to-[#F1BA69] rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 whitespace-nowrap">
                <span className="relative z-10 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 mr-3 flex-shrink-0" />
                  Shop Similar Furniture
                  <ArrowRight className="w-5 h-5 ml-3 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#F1BA69] to-[#C53D39] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>

            {/* Secondary Button */}
            <Link href="/portfolio">
              <button className="group relative inline-flex items-center justify-center px-8 py-4 h-14 min-w-[240px] text-lg font-semibold text-gray-900 bg-white border-2 border-gray-300 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap">
                <span className="relative z-10 flex items-center justify-center group-hover:text-white transition-colors duration-300">
                  Explore More Projects
                  <ArrowRight className="w-5 h-5 ml-3 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
