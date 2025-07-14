export default function AwardsSection() {
  const partners = [
    {
      name: "Litum Consult",
      logo: "/awards/partner-1.png",
      description: "Strategic Business Consulting Partner",
    },
    {
      name: "Survation",
      logo: "/awards/partner-2.png",
      description: "Market Research & Analytics Partner",
    },
    {
      name: "Conestoga",
      logo: "/awards/partner-3.png",
      description: "Quality Assurance & Standards Partner",
    },
    {
      name: "G+S Solutions",
      logo: "/awards/partner-4.png",
      description: "Technology & Innovation Partner",
    },
    {
      name: "ISRC",
      logo: "/awards/partner-5.png",
      description: "Industry Standards & Certification",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-[#C53D39]"></div>
            <div className="mx-4 w-8 h-8 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-[#F1BA69]"></div>
          </div>

          <h2 className="text-4xl font-bold font-['Montserrat'] text-gray-900 mb-4">Awards & Recognition</h2>

          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Industry leaders and influencers recognize Revive Furniture as one of the most trust worthy retail companies
            in the Pakistan, ranking high for both customer and employee satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="group flex flex-col items-center p-6 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-lg"
            >
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  className="h-16 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                />
              </div>

              <div className="text-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{partner.name}</h3>
                <p className="text-xs text-gray-600">{partner.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Recognition */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-[#C53D39]/10 to-[#F1BA69]/10 rounded-full px-8 py-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-700 font-semibold">Rated 4.8/5 by over 10,000+ satisfied customers</span>
          </div>
        </div>
      </div>
    </section>
  )
}
