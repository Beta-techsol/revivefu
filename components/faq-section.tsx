"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Info } from 'lucide-react'
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "What materials are used in your furniture?",
    answer: "We use premium materials including solid hardwood, high-grade steel, genuine leather, and eco-friendly fabrics. All our furniture meets international quality standards and comes with detailed material specifications."
  },
  {
    question: "How long does delivery take?",
    answer: "Standard delivery takes 5-7 business days for in-stock items. Custom orders may take 2-4 weeks. We offer express delivery options and will provide tracking information once your order ships."
  },
  {
    question: "Do you offer assembly services?",
    answer: "Yes, we provide professional assembly services for an additional fee. Our certified technicians will assemble your furniture at your location and ensure everything is properly set up."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for unused items in original packaging. Custom orders are non-returnable unless there's a manufacturing defect. Return shipping costs may apply."
  },
  // ✅ Added FAQ 1
  {
    question: "Can I customize the color or fabric?",
    answer: "Absolutely! We offer a range of customization options including fabric, color, and finish. Reach out to our design team to start personalizing your furniture."
  },
  // ✅ Added FAQ 2
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to over 30 countries. International shipping rates and delivery timelines vary by location. Please check our shipping page for more details."
  }
]

const hotspots = [
  {
    id: 1,
    x: "25%",
    y: "30%",
    title: "Premium Leather",
    description: "Genuine Italian leather with natural grain texture"
  },
  {
    id: 2,
    x: "70%",
    y: "45%",
    title: "Solid Wood Frame",
    description: "Sustainably sourced hardwood construction"
  },
  {
    id: 3,
    x: "45%",
    y: "65%",
    title: "Steel Reinforcement",
    description: "High-grade steel support for durability"
  },
  {
    id: 4,
    x: "80%",
    y: "25%",
    title: "Ergonomic Design",
    description: "Scientifically designed for optimal comfort"
  }
]

export function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex flex-col lg:flex-row h-[610px]">{/* ✅ Updated height */}
        {/* Left FAQ Section - 35% */}
        <div className="w-full lg:w-[35%] flex items-center">
          <div className="w-full pl-[8%] pr-4 py-8">
            {/* ✅ Heading */}
            <h2 className="text-[25px] font-semibold text-gray-800 mb-2">FAQs</h2>

            {/* Subtitle */}
            <h3 
              className="text-xl lg:text-2xl mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent"
              style={{ fontFamily: 'Dancing Script, cursive' }}
            >
              Questions & Answers
            </h3>

            {/* FAQ Items */}
            <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 rounded-lg"
                  >
                    <span className="font-medium text-gray-900 pr-3 text-sm">
                      {faq.question}
                    </span>
                    {openFaq === index ? (
                      <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      openFaq === index ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="px-4 pb-3">
                      <p className="text-gray-600 leading-relaxed text-xs">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Image Section - 65% */}
        <div className="w-full lg:w-[65%] relative overflow-hidden">
          <div className="relative h-full w-full">
            <img
              src="/faqs.avif"
              alt="Premium furniture showcase"
              className="w-full h-full object-cover"
            />
            
            {/* Interactive Hotspots */}
            {hotspots.map((hotspot) => (
              <div
                key={hotspot.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: hotspot.x, top: hotspot.y }}
                onMouseEnter={() => setActiveHotspot(hotspot.id)}
                onMouseLeave={() => setActiveHotspot(null)}
                onClick={() => setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)}
              >
                {/* Hotspot Dot */}
                <div className="relative">
                  <div className="w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow-lg animate-pulse group-hover:animate-none group-hover:scale-125 transition-all duration-300">
                    <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
                  </div>
                  
                  {/* Tooltip */}
                  {activeHotspot === hotspot.id && (
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-3 min-w-[200px] z-10 border">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{hotspot.title}</h4>
                          <p className="text-gray-600 text-xs mt-1">{hotspot.description}</p>
                        </div>
                      </div>
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
