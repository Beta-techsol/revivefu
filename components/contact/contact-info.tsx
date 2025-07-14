import { Phone, Mail, MapPin, Clock, Briefcase, HeadphonesIcon } from "lucide-react"

export function ContactInfo() {
  return (
    <div className="bg-gray-50 p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Contact Us</h2>

      <div className="space-y-8">
        {/* Call to Us */}
        <div>
          <div className="flex items-center mb-3">
            <Phone className="w-5 h-5 text-[#C53D39] mr-3" />
            <h3 className="text-lg font-semibold text-gray-800">Call to Us:</h3>
          </div>
          <p className="text-gray-600 mb-2">We're available 24/7, 7 days a week.</p>
          <a
            href="tel:+923066203252"
            className="text-[#C53D39] hover:text-[#B12E2A] font-medium transition-colors duration-200"
          >
            +92 306 620 3252
          </a>
        </div>

        {/* Write to Us */}
        <div>
          <div className="flex items-center mb-3">
            <Mail className="w-5 h-5 text-[#C53D39] mr-3" />
            <h3 className="text-lg font-semibold text-gray-800">Write to Us:</h3>
          </div>
          <p className="text-gray-600 mb-2">Fill out our form and we will contact you within 24 hours.</p>
          <a
            href="mailto:revivefurniture01@gmail.com"
            className="text-[#C53D39] hover:text-[#B12E2A] font-medium transition-colors duration-200 block"
          >
            revivefurniture01@gmail.com
          </a>
        </div>

        {/* Headquarters */}
        <div>
          <div className="flex items-center mb-3">
            <MapPin className="w-5 h-5 text-[#C53D39] mr-3" />
            <h3 className="text-lg font-semibold text-gray-800">Headquarters:</h3>
          </div>
          <p className="text-gray-600">
            33 College Road, Sector B-1 Block A-1
            <br />
            Phase 1 Johar Town, Lahore, Pakistan
          </p>
        </div>

        {/* Opening Hours */}
        <div>
          <div className="flex items-center mb-3">
            <Clock className="w-5 h-5 text-[#C53D39] mr-3" />
            <h3 className="text-lg font-semibold text-gray-800">Opening Hours:</h3>
          </div>
          <div className="text-gray-600 space-y-1">
            <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
            <p>Saturday: 10:00 AM - 6:00 PM</p>
            <p>Sunday: 12:00 PM - 5:00 PM</p>
          </div>
        </div>

        {/* Work With Us */}
        <div>
          <div className="flex items-center mb-3">
            <Briefcase className="w-5 h-5 text-[#C53D39] mr-3" />
            <h3 className="text-lg font-semibold text-gray-800">Work With Us:</h3>
          </div>
          <p className="text-gray-600 mb-2">Send your CV to our email:</p>
          <a
            href="mailto:career@revivefurniture.pk"
            className="text-[#C53D39] hover:text-[#B12E2A] font-medium transition-colors duration-200"
          >
            career@revivefurniture.pk
          </a>
        </div>

        {/* Customer Service */}
        <div>
          <div className="flex items-center mb-3">
            <HeadphonesIcon className="w-5 h-5 text-[#C53D39] mr-3" />
            <h3 className="text-lg font-semibold text-gray-800">Customer Service:</h3>
          </div>
          <div className="space-y-2">
            <a
              href="mailto:customer.care@revivefurniture.pk"
              className="text-[#C53D39] hover:text-[#B12E2A] font-medium transition-colors duration-200 block"
            >
              customer.care@revivefurniture.pk
            </a>
            <a
              href="tel:+923154843593"
              className="text-[#C53D39] hover:text-[#B12E2A] font-medium transition-colors duration-200 block"
            >
              +92 315 484 3593
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
