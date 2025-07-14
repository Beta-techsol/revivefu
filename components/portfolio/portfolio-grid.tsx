"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

const portfolioItems = [
  {
    id: 1,
    slug: "cowo-coworking-space",
    image: "/portfolio/cowo-1.jpg",
    title: "Cowo Coworking Space",
    category: "Commercial",
    description: "Modern glass-walled conference room with premium seating",
    year: "2023",
  },
  {
    id: 2,
    slug: "meezan-bank-corporate-office",
    image: "/portfolio/meezan-bank-1.jpg",
    title: "Meezan Bank Corporate Office",
    category: "Corporate",
    description: "Comprehensive banking headquarters with modern workspaces",
    year: "2023",
  },
  {
    id: 3,
    slug: "cwsa-murree-office",
    image: "/portfolio/cwsa-murree-1.jpg",
    title: "CWSA Murree Office",
    category: "Outdoor",
    description: "Artistic outdoor dining with custom mosaic tables",
    year: "2023",
  },
  {
    id: 4,
    slug: "forrun-office-lahore",
    image: "/portfolio/forrun-office-3.jpg",
    title: "Forrun Office Lahore",
    category: "Corporate",
    description: "Minimalist workspace with ergonomic solutions",
    year: "2023",
  },
  {
    id: 5,
    slug: "fig-solutions-dha",
    image: "/portfolio/fig-solutions-1.jpg",
    title: "Fig Solutions DHA",
    category: "Corporate",
    description: "Executive conference room with premium seating",
    year: "2022",
  },
  {
    id: 6,
    slug: "meezan-bank-corporate-office",
    image: "/portfolio/meezan-bank-5.jpg",
    title: "Meezan Bank Conference Rooms",
    category: "Corporate",
    description: "Glass-walled meeting spaces with geometric design elements",
    year: "2023",
  },
]

const categories = ["All", "Commercial", "Corporate", "Outdoor"]

export default function PortfolioGrid() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  const filteredItems =
    activeCategory === "All" ? portfolioItems : portfolioItems.filter((item) => item.category === activeCategory)

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
        .dancing-script {
          font-family: 'Dancing Script', cursive;
        }
      `}</style>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-urbanist">Our Portfolio</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our premium furniture solutions across various commercial and corporate spaces
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center mb-12">
            <div className="flex flex-wrap gap-4 bg-white rounded-full p-2 shadow-lg">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    activeCategory === category
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg"
                      : "text-gray-600 hover:text-amber-500 hover:bg-amber-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <Link key={item.id} href={`/portfolio/${item.slug}`}>
                <div
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className={`object-cover transition-all duration-700 ${
                        hoveredItem === item.id ? "scale-110" : "scale-100"
                      }`}
                    />

                    {/* Overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500 ${
                        hoveredItem === item.id ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="absolute bottom-4 left-4 right-4 text-white transform transition-all duration-500">
                        <div
                          className={`transition-all duration-500 ${
                            hoveredItem === item.id ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                          }`}
                        >
                          <span className="inline-block px-3 py-1 bg-amber-500 text-xs font-semibold rounded-full mb-2">
                            {item.category}
                          </span>
                          <p className="text-sm text-gray-200">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 font-urbanist">{item.title}</h3>
                      <span className="text-sm text-amber-500 font-semibold">{item.year}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </div>

                  {/* Hover Border Effect */}
                  <div
                    className={`absolute inset-0 border-2 border-amber-500 rounded-2xl transition-opacity duration-300 ${
                      hoveredItem === item.id ? "opacity-100" : "opacity-0"
                    }`}
                  ></div>
                </div>
              </Link>
            ))}
          </div>

          {/* Call to Action with Background Image */}
          <div className="mt-16 relative rounded-2xl overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image src="/portfolio/cta-background.jpg" alt="Transform Your Space" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Content - Left Side */}
            <div className="relative z-10 flex items-center min-h-[400px]">
              <div className="w-1/2 p-12 text-white">
                <h3 className="text-4xl font-bold mb-6 font-urbanist leading-tight">
                  Ready to{" "}
                  <span
                    className="dancing-script text-5xl bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent"
                    style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 700 }}
                  >
                    Transform
                  </span>{" "}
                  Your Space?
                </h3>
                <p className="text-xl mb-8 opacity-90 leading-relaxed">
                  Let's create something amazing together. Contact us for a custom furniture solution that perfectly
                  fits your vision and space.
                </p>

                {/* Button with product-showcase.tsx exact styling */}
                <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25">
                  <span className="relative z-10 flex items-center gap-2 font-urbanist">
                    Start Your Project
                    <svg
                      className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
