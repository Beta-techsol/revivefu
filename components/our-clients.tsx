"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const clients = [
  {
    name: "Meezan Bank",
    logo: "/clients/meezan-bank.webp",
    description: "Leading Islamic Bank",
  },
  {
    name: "Community World Service Asia",
    logo: "/clients/community-world-service.webp",
    description: "Non-profit Organization",
  },
  {
    name: "Eastern Scientific",
    logo: "/clients/eastern-scientific.jpeg",
    description: "Scientific Equipment",
  },
  {
    name: "Lambda Logics",
    logo: "/clients/lambda-logics.webp",
    description: "Technology Solutions",
  },
  {
    name: "Ingenious Zone",
    logo: "/clients/ingenious-zone.webp",
    description: "Creative Agency",
  },
  {
    name: "Forrun Office",
    logo: "/clients/forrun-office.webp",
    description: "Office Solutions",
  },
  {
    name: "Cowo Coworking",
    logo: "/clients/cowo-logo.webp",
    description: "Coworking Space",
  },
  {
    name: "Construction Company",
    logo: "/clients/construction-logo.gif",
    description: "Construction Services",
  },
]

export function OurClients() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Trusted Clients</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're proud to have worked with some of the most respected organizations and businesses
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {clients.map((client, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-gray-50 hover:bg-white border-gray-200"
            >
              <CardContent className="p-4 md:p-6 flex flex-col items-center text-center h-full">
                <div className="relative w-16 h-16 md:w-20 md:h-20 mb-3 md:mb-4 flex-shrink-0">
                  <Image
                    src={client.logo || "/placeholder.svg"}
                    alt={client.name}
                    fill
                    className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1 md:mb-2 line-clamp-2 flex-grow">
                  {client.name}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 line-clamp-2">{client.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 md:mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-[#C53D39] mb-1 md:mb-2">50+</div>
              <div className="text-sm md:text-base text-gray-600">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-[#C53D39] mb-1 md:mb-2">200+</div>
              <div className="text-sm md:text-base text-gray-600">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-[#C53D39] mb-1 md:mb-2">5+</div>
              <div className="text-sm md:text-base text-gray-600">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-[#C53D39] mb-1 md:mb-2">100%</div>
              <div className="text-sm md:text-base text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
