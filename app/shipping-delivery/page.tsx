import { Truck, Clock, MapPin, Shield, Phone, Mail } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function ShippingDeliveryPage() {
  const deliveryPartners = [
    { name: "TCS", coverage: "Nationwide" },
    { name: "Leopards", coverage: "Major Cities" },
    { name: "M&P Express", coverage: "Karachi, Lahore, Islamabad" },
    { name: "Call Courier", coverage: "All Pakistan" },
  ]

  const deliveryZones = [
    { zone: "Karachi", time: "1-2 Business Days", charge: "Free above Rs. 15,000" },
    { zone: "Lahore", time: "2-3 Business Days", charge: "Free above Rs. 15,000" },
    { zone: "Islamabad/Rawalpindi", time: "2-3 Business Days", charge: "Free above Rs. 15,000" },
    { zone: "Faisalabad", time: "3-4 Business Days", charge: "Rs. 500" },
    { zone: "Multan", time: "3-4 Business Days", charge: "Rs. 500" },
    { zone: "Peshawar", time: "4-5 Business Days", charge: "Rs. 700" },
    { zone: "Quetta", time: "5-7 Business Days", charge: "Rs. 1,000" },
    { zone: "Other Cities", time: "5-10 Business Days", charge: "Rs. 800-1,500" },
  ]

  return (
    <div className="min-h-screen">
      {/* Static Hero Section */}
      <div className="relative bg-gray-900 h-64 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('/contact/furniture-showcase-1.jpg')",
          }}
        />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shipping & Delivery</h1>
          <p className="text-lg opacity-90">Home / Shipping & Delivery</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Overview Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Fast & Reliable Delivery Across Pakistan
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We partner with Pakistan's most trusted courier services to ensure your furniture reaches you safely and on
            time. Enjoy free delivery on orders above Rs. 15,000 in major cities.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-gradient-to-r from-red-600 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Delivery</h3>
            <p className="text-gray-600">On orders above Rs. 15,000 in major cities</p>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-r from-red-600 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Processing</h3>
            <p className="text-gray-600">Orders processed within 24 hours</p>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-r from-red-600 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Packaging</h3>
            <p className="text-gray-600">Professional packaging to prevent damage</p>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-r from-red-600 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nationwide Coverage</h3>
            <p className="text-gray-600">Delivery to all major cities in Pakistan</p>
          </div>
        </div>

        {/* Delivery Zones */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Delivery Times & Charges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deliveryZones.map((zone, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{zone.zone}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-red-600" />
                      <span>{zone.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Truck className="w-4 h-4 mr-2 text-red-600" />
                      <span>{zone.charge}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Delivery Partners */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Delivery Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {deliveryPartners.map((partner, index) => (
              <div key={index} className="text-center">
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="h-16 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-gray-800">{partner.name}</span>
                  </div>
                  <p className="text-sm text-gray-600">{partner.coverage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How Our Shipping Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Confirmation</h3>
              <p className="text-gray-600">We confirm your order and payment within 2 hours</p>
            </div>
            <div className="text-center">
              <div className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Preparation</h3>
              <p className="text-gray-600">Your furniture is carefully packed and prepared for shipping</p>
            </div>
            <div className="text-center">
              <div className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dispatch</h3>
              <p className="text-gray-600">Item is dispatched with tracking information sent to you</p>
            </div>
            <div className="text-center">
              <div className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery</h3>
              <p className="text-gray-600">Your furniture arrives safely at your doorstep</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Need Help with Your Delivery?</h2>
          <p className="text-lg mb-6">
            Our customer support team is here to assist you with any shipping questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              <span>+92 300 1234567</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              <span>support@revivefurniture.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
