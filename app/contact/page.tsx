import { ContactHeroSlider } from "@/components/contact/contact-hero-slider"
import { ContactInfo } from "@/components/contact/contact-info"
import { ContactForm } from "@/components/contact/contact-form"
import { MapPin } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Slider */}
      <ContactHeroSlider />

      {/* Contact Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <ContactInfo />
          </div>

          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="relative h-96 bg-gray-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.8174849861!2d74.27847!3d31.4697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391903c1b2e1c5e7%3A0x8e5b5b5b5b5b5b5b!2s33%20College%20Rd%2C%20Sector%20B-1%20Block%20A-1%20Phase%201%20Johar%20Town%2C%20Lahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0"
        />

        {/* Single Red Marker for Revive Furniture */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative">
            {/* Red Marker */}
            <div className="w-8 h-8 bg-red-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            {/* Marker Pointer */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-red-600"></div>
          </div>
        </div>

        {/* Business Info Overlay - Only Revive Furniture */}
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-sm">
          <h3 className="font-bold text-gray-800">Revive Furniture</h3>
          <p className="text-sm text-gray-600">35-17 College Road, Sector B-1 Block A-1</p>
          <p className="text-sm text-gray-600">Phase 1 Johar Town, Lahore</p>
          <div className="flex items-center mt-2">
            <div className="flex text-yellow-400">{"★".repeat(5)}</div>
            <span className="ml-2 text-sm text-gray-600">4.8 (127 reviews)</span>
          </div>
          <p className="text-sm text-green-600 font-medium mt-1">• Open Now</p>
          <p className="text-sm text-gray-600 mt-1">📞 +92-306-620-3252</p>
        </div>
      </section>
    </div>
  )
}
