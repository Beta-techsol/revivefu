"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import Image from "next/image"

const customerReviews = [
  {
    id: 1,
    name: "Muhammad Ahmed",
    location: "Lahore, Pakistan",
    rating: 5,
    title: "Solid Craftsmanship for Our Living Room",
    review:
      "The sofa set and center table arrived well packaged in Lahore, and the woodwork and upholstery matched what we ordered. Having the 50% advance and remaining on delivery option made ordering straightforward.",
    avatar: "/testimonials/avatars/muhammad-ahmed.jpg",
  },
  {
    id: 2,
    name: "Ayesha Khan",
    location: "Islamabad, Pakistan",
    rating: 5,
    title: "Elegant Dining Set & Smooth Coordination",
    review:
      "We ordered a six-seater dining set for our home in Islamabad. The team stayed in touch throughout dispatch and delivery, and the finish fits our dining room beautifully.",
    avatar: "/testimonials/avatars/ayesha-khan.jpg",
  },
  {
    id: 3,
    name: "Ali Raza",
    location: "Karachi, Pakistan",
    rating: 5,
    title: "Comfortable Ergonomic Chair for Daily Work",
    review:
      "I ordered an executive office chair for my study in Karachi. Delivery was smooth and the lumbar support and build quality feel sturdy for long working hours.",
    avatar: "/testimonials/avatars/ali-raza.jpg",
  },
  {
    id: 4,
    name: "Fatima Ahmed",
    location: "Rawalpindi, Pakistan",
    rating: 5,
    title: "Thoughtful Finish & Helpful Support",
    review:
      "Revive Furniture helped us pick matching fabric tones for our bedroom chairs. Everything reached Rawalpindi safely and on schedule.",
    avatar: "/testimonials/avatars/fatima-ahmed.jpg",
  },
]

export function TestimonialsSection() {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % customerReviews.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [currentReviewIndex])

  const handleDotClick = (index: number) => {
    setCurrentReviewIndex(index)
  }

  const activeReview = customerReviews[currentReviewIndex]

  return (
    <section className="w-full bg-gray-100 overflow-visible relative py-8 lg:py-12 my-8 md:my-0">
      {/* Mobile Layout - Stacked */}
      <div className="block md:hidden">
        {/* Image Section - Mobile */}
        <div className="w-full px-4 mb-8">
          <div className="relative w-full h-64 flex items-center justify-center">
            <Image
              src="/testimonials/furniture-setup.avif"
              alt="Revive Furniture living room setup"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-contain"
              priority
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Customer Reviews Section - Mobile */}
        <div className="px-6">
          <div className="w-full">
            {/* Header: Customer Reviews + Stars */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <h2 className="text-xs font-bold tracking-wider uppercase text-gray-800 bg-white border border-gray-200 px-3 py-1 rounded shadow-sm">
                Customer Reviews
              </h2>
              <div className="flex items-center gap-1" aria-label={`${activeReview.rating} out of 5 stars`}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{activeReview.title}</h3>

            {/* Review Text */}
            <p className="text-gray-600 leading-relaxed mb-6" style={{ fontSize: "14px" }}>
              {activeReview.review}
            </p>

            {/* Customer Info and Pagination */}
            <div className="flex items-center justify-between gap-3">
              {/* Customer Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm bg-white flex-shrink-0">
                  {customerReviews.map((item, idx) => (
                    <Image
                      key={item.id}
                      src={item.avatar}
                      alt={`${item.name} portrait`}
                      width={48}
                      height={48}
                      sizes="48px"
                      priority
                      className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-300 ${
                        idx === currentReviewIndex ? "opacity-100" : "opacity-0 pointer-events-none"
                      }`}
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{activeReview.name}</p>
                  <p className="text-xs text-gray-500 truncate">{activeReview.location}</p>
                </div>
              </div>

              {/* Navigation Dots */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {customerReviews.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => handleDotClick(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === currentReviewIndex ? "bg-gray-900" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to review ${index + 1}: ${item.name}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Side by Side */}
      <div className="hidden md:flex h-[400px] lg:h-[450px] relative">
        {/* Left Side - Image with 45% radius and overflow */}
        <div className="w-[45%] relative">
          <div className="absolute inset-0 bg-gray-100 rounded-l-[200px] lg:rounded-l-[300px] overflow-visible">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Image container that allows overflow */}
              <div className="relative w-full h-[150%] -mt-[10%]">
                <Image
                  src="/testimonials/furniture-setup.avif"
                  alt="Revive Furniture living room setup"
                  fill
                  sizes="45vw"
                  className="object-contain"
                  priority
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Customer Reviews */}
        <div className="w-[55%] flex items-center px-6 lg:px-12">
          <div className="w-full max-w-2xl">
            {/* Header: Customer Reviews + Stars */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <h2 className="text-xs font-bold tracking-wider uppercase text-gray-800 bg-white border border-gray-200 px-3 py-1 rounded shadow-sm">
                Customer Reviews
              </h2>
              <div className="flex items-center gap-1" aria-label={`${activeReview.rating} out of 5 stars`}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 leading-tight">{activeReview.title}</h3>

            {/* Review Text - 14px */}
            <p className="text-gray-600 leading-relaxed mb-6" style={{ fontSize: "14px" }}>
              {activeReview.review}
            </p>

            {/* Customer Info and Pagination - Inline */}
            <div className="flex items-center justify-between gap-4">
              {/* Customer Info */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm bg-white flex-shrink-0">
                  {customerReviews.map((item, idx) => (
                    <Image
                      key={item.id}
                      src={item.avatar}
                      alt={`${item.name} portrait`}
                      width={48}
                      height={48}
                      sizes="48px"
                      priority
                      className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-300 ${
                        idx === currentReviewIndex ? "opacity-100" : "opacity-0 pointer-events-none"
                      }`}
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">
                    {activeReview.name}{" "}
                    <span className="font-normal text-gray-500">· {activeReview.location}</span>
                  </p>
                </div>
              </div>

              {/* Navigation Dots */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {customerReviews.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => handleDotClick(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === currentReviewIndex ? "bg-gray-900" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to review ${index + 1}: ${item.name}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

