import { HeroSlider } from "@/components/common/hero-slider"
import { Truck, Clock, MapPin, Shield, Phone, Mail } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function ShippingDeliveryPage() {
  const heroImages = [
    "/contact/furniture-showcase-1.jpg",
    "/contact/furniture-showcase-2.jpg",
    "/contact/furniture-showcase-3.jpg",
  ]

  const deliveryPartners = [
    { name: "TCS", logo: "/delivery/tcs-logo.png", coverage: "Nationwide" },
    { name: "Leopards", logo: "/delivery/leopards-logo.png", coverage: "Major Cities" },
    { name: "M&P Express", logo: "/delivery/mp-logo.png", coverage: "Karachi, Lahore, Islamabad" },
    { name: "Call Courier", logo: "/delivery/call-courier-logo.png", coverage: "All Pakistan" },
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
      {/* Hero Slider */}
      <HeroSlider images={heroImages} title="Shipping & Delivery" breadcrumb={[{ label: "Shipping & Delivery" }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Overview Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-montserrat mb-6">
            Fast & Reliable Delivery Across Pakistan
          </h2>
          <p className="text-lg text-gray-600 font-poppins max-w-3xl mx-auto">
            We partner with Pakistan's most trusted courier services to ensure your furniture reaches you safely and on
            time. Enjoy free delivery on orders above Rs. 15,000 in major cities.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 font-montserrat mb-2">Free Delivery</h3>
            <p className="text-gray-600 font-poppins">On orders above Rs. 15,000 in major cities</p>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 font-montserrat mb-2">Quick Processing</h3>
            <p className="text-gray-600 font-poppins">Orders processed within 24 hours</p>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 font-montserrat mb-2">Secure Packaging</h3>
            <p className="text-gray-600 font-poppins">Professional packaging to prevent damage</p>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 font-montserrat mb-2">Nationwide Coverage</h3>
            <p className="text-gray-600 font-poppins">Delivery to all major cities in Pakistan</p>
          </div>
        </div>

        {/* Delivery Zones */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 font-montserrat mb-8 text-center">
            Delivery Times & Charges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deliveryZones.map((zone, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 font-montserrat mb-2">{zone.zone}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600 font-poppins">
                      <Clock className="w-4 h-4 mr-2 text-[#C53D39]" />
                      <span>{zone.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600 font-poppins">
                      <Truck className="w-4 h-4 mr-2 text-[#C53D39]" />
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
          <h2 className="text-3xl font-bold text-gray-900 font-montserrat mb-8 text-center">Our Delivery Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {deliveryPartners.map((partner, index) => (
              <div key={index} className="text-center">
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="h-16 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-gray-800 font-montserrat">{partner.name}</span>
                  </div>
                  <p className="text-sm text-gray-600 font-poppins">{partner.coverage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 font-montserrat mb-8 text-center">How Our Shipping Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-[#C53D39] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold font-montserrat">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 font-montserrat mb-2">Order Confirmation</h3>
              <p className="text-gray-600 font-poppins">We confirm your order and payment within 2 hours</p>
            </div>
            <div className="text-center">
              <div className="bg-[#C53D39] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold font-montserrat">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 font-montserrat mb-2">Preparation</h3>
              <p className="text-gray-600 font-poppins">Your furniture is carefully packed and prepared for shipping</p>
            </div>
            <div className="text-center">
              <div className="bg-[#C53D39] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold font-montserrat">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 font-montserrat mb-2">Dispatch</h3>
              <p className="text-gray-600 font-poppins">Item is dispatched with tracking information sent to you</p>
            </div>
            <div className="text-center">
              <div className="bg-[#C53D39] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold font-montserrat">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 font-montserrat mb-2">Delivery</h3>
              <p className="text-gray-600 font-poppins">Your furniture arrives safely at your doorstep</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold font-montserrat mb-4">Need Help with Your Delivery?</h2>
          <p className="text-lg font-poppins mb-6">
            Our customer support team is here to assist you with any shipping questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              <span className="font-poppins">+92 300 1234567</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              <span className="font-poppins">support@revivefurniture.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
