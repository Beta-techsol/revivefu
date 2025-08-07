"use client"

import { useState, useEffect } from "react"
import { Star } from 'lucide-react'
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    name: "Jennifer",
    location: "New York, USA",
    rating: 5,
    title: "Perfect Quality and Customer Service!",
    review: "Minicom truly exceeded my expectations in every way! I was looking for a modern yet cozy sofa for my living room, and I found the perfect one here. The fabric is soft, the cushioning is just right, and the quality is excellent. Plus, the delivery was super fast, and the assembly was effortless. I've received so many compliments from friends and family. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Ahmed Hassan",
    location: "Lahore, Pakistan",
    rating: 5,
    title: "Outstanding Furniture Quality!",
    review: "I recently purchased a dining set from Minicom and I'm absolutely thrilled with my purchase. The craftsmanship is exceptional, and the wood finish is beautiful. The customer service team was very helpful throughout the process, and the delivery was prompt. The furniture looks even better in person than in the photos. Worth every penny!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Fatima Ali",
    location: "Islamabad, Pakistan",
    rating: 5,
    title: "Exceptional Service and Design!",
    review: "Minicom has transformed my home office completely! The ergonomic chair I bought is incredibly comfortable for long working hours, and the desk is both functional and stylish. The team was professional from start to finish, and they even helped me choose the right pieces for my space. I couldn't be happier with my experience!",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
  }
]

export function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const handleDotClick = (index: number) => {
    setCurrentTestimonial(index)
  }

  return (
    <section className="w-full bg-gray-100 overflow-visible relative py-8 lg:py-12">
      <div className="flex h-[400px] lg:h-[450px] relative">
        {/* Left Side - Image with 45% radius and overflow */}
        <div className="w-[45%] relative">
          <div className="absolute inset-0 bg-gray-100 rounded-l-[200px] lg:rounded-l-[300px] overflow-visible">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Image container that allows overflow */}
              <div className="relative w-full h-[150%] -mt-[10%]">
                <Image
                  src="/testimonials/furniture-setup.avif"
                  alt="Modern teal armchair with plants and decor"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Testimonials */}
        <div className="w-[55%] flex items-center px-6 lg:px-12">
          <div className="w-full max-w-2xl">
            {/* Stars */}
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>

            {/* Title */}
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 leading-tight">
              {testimonials[currentTestimonial].title}
            </h3>

            {/* Review Text - 14px */}
            <p className="text-gray-600 leading-relaxed mb-6" style={{ fontSize: '14px' }}>
              {testimonials[currentTestimonial].review}
            </p>

            {/* Customer Info and Pagination - Inline */}
            <div className="flex items-center justify-between">
              {/* Customer Info */}
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={testimonials[currentTestimonial].avatar || "/placeholder.svg"}
                    alt={testimonials[currentTestimonial].name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {testimonials[currentTestimonial].name} - 
                    <span className="font-normal text-gray-400 ml-1">
                      {testimonials[currentTestimonial].location}
                    </span>
                  </p>
                </div>
              </div>

              {/* Navigation Dots */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? "bg-gray-900"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
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
