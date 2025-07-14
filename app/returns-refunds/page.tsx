import { HeroSlider } from "@/components/common/hero-slider"
import { RotateCcw, Clock, CheckCircle, AlertCircle, Phone, Mail } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function ReturnsRefundsPage() {
  const breadcrumb = [{ label: "Returns & Refunds" }]

  const heroImages = [
    "/contact/furniture-showcase-1.jpg",
    "/contact/furniture-showcase-2.jpg",
    "/contact/furniture-showcase-3.jpg",
  ]

  const returnSteps = [
    {
      step: 1,
      title: "Contact Us",
      description: "Reach out within 7 days of delivery via phone or email",
      icon: Phone,
    },
    {
      step: 2,
      title: "Return Authorization",
      description: "We'll provide a return authorization number and instructions",
      icon: CheckCircle,
    },
    {
      step: 3,
      title: "Package & Ship",
      description: "Pack the item in original packaging and ship back to us",
      icon: RotateCcw,
    },
    {
      step: 4,
      title: "Inspection & Refund",
      description: "We inspect the item and process your refund within 5-7 business days",
      icon: Clock,
    },
  ]

  const eligibleConditions = [
    "Item must be in original condition with all tags and packaging",
    "No signs of wear, damage, or alteration",
    "All accessories and parts must be included",
    "Item must not have been assembled (for furniture requiring assembly)",
    "Custom or personalized items are not eligible for return",
  ]

  const nonEligibleItems = [
    "Custom-made or personalized furniture",
    "Items damaged due to misuse or normal wear",
    "Mattresses and bedding (for hygiene reasons)",
    "Items returned after 7 days of delivery",
    "Items without original packaging or tags",
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <HeroSlider images={heroImages} title="Returns & Refunds" breadcrumb={breadcrumb} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Overview Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-montserrat mb-6">
            Hassle-Free Returns & Refunds
          </h2>
          <p className="text-lg text-gray-600 font-poppins max-w-3xl mx-auto">
            We want you to be completely satisfied with your purchase. If you're not happy with your furniture, we offer
            a simple 7-day return policy with full refund guarantee.
          </p>
        </div>

        {/* Return Policy Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 font-montserrat mb-2">7-Day Window</h3>
            <p className="text-gray-600 font-poppins">Return items within 7 days of delivery for full refund</p>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 font-montserrat mb-2">Easy Process</h3>
            <p className="text-gray-600 font-poppins">Simple 4-step return process with full support</p>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 font-montserrat mb-2">Full Refund</h3>
            <p className="text-gray-600 font-poppins">100% refund for eligible returns within 5-7 business days</p>
          </div>
        </div>

        {/* Return Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 font-montserrat mb-8 text-center">How to Return Your Item</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {returnSteps.map((step, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="bg-[#C53D39] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold font-montserrat">
                    {step.step}
                  </div>
                  <step.icon className="w-8 h-8 text-[#C53D39] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 font-montserrat mb-2">{step.title}</h3>
                  <p className="text-gray-600 font-poppins text-sm">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Eligibility Conditions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900 font-montserrat">Eligible for Return</h3>
              </div>
              <ul className="space-y-3">
                {eligibleConditions.map((condition, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-poppins text-sm">{condition}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900 font-montserrat">Not Eligible for Return</h3>
              </div>
              <ul className="space-y-3">
                {nonEligibleItems.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 font-poppins text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Refund Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 font-montserrat mb-8 text-center">Refund Timeline</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold font-montserrat">1-2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 font-montserrat mb-2">Days</h3>
                <p className="text-gray-600 font-poppins">Item inspection after we receive it</p>
              </div>
              <div className="text-center">
                <div className="bg-yellow-100 text-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold font-montserrat">3-5</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 font-montserrat mb-2">Days</h3>
                <p className="text-gray-600 font-poppins">Refund processing time</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold font-montserrat">5-7</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 font-montserrat mb-2">Days</h3>
                <p className="text-gray-600 font-poppins">Money back in your account</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <Card className="mb-16 border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-orange-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900 font-montserrat">Important Notes</h3>
            </div>
            <ul className="space-y-2 text-gray-700 font-poppins">
              <li>• Return shipping costs are borne by the customer unless the item was damaged or defective</li>
              <li>• Refunds will be processed to the original payment method</li>
              <li>• For Cash on Delivery orders, refunds will be processed via bank transfer</li>
              <li>• Custom furniture orders require 50% cancellation fee if cancelled after production starts</li>
              <li>• Installation charges are non-refundable</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold font-montserrat mb-4">Need Help with Returns?</h2>
          <p className="text-lg font-poppins mb-6">
            Our customer support team is ready to assist you with your return or refund request.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              <span className="font-poppins">+92 300 1234567</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              <span className="font-poppins">returns@revivefurniture.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
