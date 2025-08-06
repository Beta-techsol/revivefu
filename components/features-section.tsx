"use client"

import { Leaf, Hammer, Recycle, LightbulbIcon } from "lucide-react"

const features = [
  {
    icon: Leaf,
    title: "Eco-Friendly Materials",
    description: "We craft our furniture using responsibly sourced, environmentally friendly materials.",
  },
  {
    icon: Hammer,
    title: "Effortless Assembly",
    description: "Thoughtfully designed for quick setup, requiring minimal effort and no extra tools.",
  },
  {
    icon: Recycle,
    title: "Giving Back to Nature",
    description: "Every purchase contributes to reforestation efforts, helping restore green spaces.",
  },
  {
    icon: LightbulbIcon,
    title: "Sustainable Production",
    description: "Dedicated to reducing waste and promoting eco-conscious manufacturing practices.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-[2%] bg-gray-50">
      <div className="w-full px-[3%]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-5 shadow-sm">
                  <IconComponent className="w-7 h-7 text-gray-800" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-xs">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
