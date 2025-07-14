import { Package, Users, Award, Truck } from "lucide-react"

export default function WelcomeSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Welcome Text */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-['Montserrat'] text-gray-900 mb-8">Welcome to Revive Furniture</h2>

          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Revive Furniture is the best online furniture store in Pakistan based in Lahore, where you could get all
              sorts of furniture, from home decor to office decor. We have an aim to deliver a wide range of
              high-quality and reliable furniture to our customers.
            </p>

            <p className="text-gray-600 leading-relaxed">
              Within our market, millions of people around the Pakistan connect, both online and offline, to buy
              Furniture. We also offer a wide range of Interior Services and tools that help creative entrepreneurs
              start, manage and scale their businesses. Our mission is to reimagine commerce in ways that build a more
              fulfilling and lasting environment, and we're committed to provide the best services to our clients.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">1K+</div>
            <div className="text-gray-600">Products for sale</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">1.8M</div>
            <div className="text-gray-600">Buyers Active on ReviveFurniture</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">15+</div>
            <div className="text-gray-600">Years of Excellence</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
            <div className="text-gray-600">Cities Served</div>
          </div>
        </div>
      </div>
    </section>
  )
}
