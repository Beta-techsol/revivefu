"use client"

import { Truck, RotateCcw, Shield, Headphones } from "lucide-react"

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "Free Delivery on all Orders above 100,000 pkr in Lahore",
  },
  {
    icon: RotateCcw,
    title: "7 Days Return",
    description: "If goods have problems",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure payment",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated support",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] rounded-full flex items-center justify-center mb-4">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
