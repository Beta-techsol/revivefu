import { HeroSlider } from "@/components/common/hero-slider"
import { Scale, FileText, CreditCard, Users, AlertTriangle, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function TermsConditionsPage() {
  const heroImages = [
    "/contact/furniture-showcase-1.jpg",
    "/contact/furniture-showcase-2.jpg",
    "/contact/furniture-showcase-3.jpg",
  ]

  const sections = [
    {
      title: "Website Usage",
      icon: FileText,
      content: [
        "You must be at least 18 years old to make purchases",
        "Provide accurate and complete information when placing orders",
        "Use the website only for lawful purposes",
        "Do not attempt to gain unauthorized access to our systems",
        "Respect intellectual property rights of all content",
      ],
    },
    {
      title: "Payment Terms",
      icon: CreditCard,
      content: [
        "All prices are in Pakistani Rupees (PKR) and include applicable taxes",
        "Payment must be made at the time of order placement",
        "We accept cash on delivery, bank transfers, and digital payments",
        "Prices are subject to change without prior notice",
        "Failed payments may result in order cancellation",
      ],
    },
    {
      title: "User Obligations",
      icon: Users,
      content: [
        "Provide accurate delivery address and contact information",
        "Be available to receive delivery during agreed timeframes",
        "Inspect items upon delivery and report any issues immediately",
        "Handle furniture with care during the return period",
        "Comply with all applicable laws and regulations",
      ],
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <HeroSlider images={heroImages} title="Terms & Conditions" breadcrumb="Home > Terms & Conditions" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Overview Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-montserrat mb-6">
            Terms & Conditions of Use
          </h2>
          <p className="text-lg text-gray-600 font-poppins max-w-3xl mx-auto">
            Please read these terms and conditions carefully before using our website or purchasing our products. By
            accessing our website, you agree to be bound by these terms.
          </p>
          <p className="text-sm text-gray-500 font-poppins mt-4">Effective Date: January 15, 2024</p>
        </div>

        {/* Key Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {sections.map((section, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 font-montserrat">{section.title}</h3>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-600 font-poppins text-sm flex items-start">
                      <span className="w-2 h-2 bg-[#C53D39] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Terms */}
        <div className="space-y-12">
          {/* Intellectual Property */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Scale className="w-6 h-6 text-[#C53D39] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 font-montserrat">Intellectual Property Rights</h2>
              </div>
              <div className="space-y-4 text-gray-600 font-poppins">
                <p>
                  All content on this website, including but not limited to text, graphics, logos, images, product
                  descriptions, and software, is the property of Revive Furniture or its content suppliers and is
                  protected by Pakistani and international copyright laws.
                </p>
                <p>
                  You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly
                  perform, republish, download, store, or transmit any of the material on our website without our prior
                  written consent.
                </p>
                <p>
                  The Revive Furniture name, logo, and all related names, logos, product and service names, designs, and
                  slogans are trademarks of Revive Furniture. You must not use such marks without our prior written
                  permission.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Product Information */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <FileText className="w-6 h-6 text-[#C53D39] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 font-montserrat">Product Information & Availability</h2>
              </div>
              <div className="space-y-4 text-gray-600 font-poppins">
                <p>
                  We strive to provide accurate product descriptions, specifications, and pricing information. However,
                  we do not warrant that product descriptions or other content is accurate, complete, reliable, current,
                  or error-free.
                </p>
                <p>
                  All products are subject to availability. We reserve the right to discontinue any product at any time
                  without notice. In the event that a product is listed at an incorrect price due to typographical
                  error, we reserve the right to refuse or cancel any orders placed for that product.
                </p>
                <p>
                  Colors of products may vary slightly from those shown on your monitor due to display settings and
                  lighting conditions. We recommend visiting our showroom to see actual colors and textures.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Processing */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <CreditCard className="w-6 h-6 text-[#C53D39] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 font-montserrat">Order Processing & Payment</h2>
              </div>
              <div className="space-y-4 text-gray-600 font-poppins">
                <p>
                  By placing an order, you offer to purchase a product subject to these terms and conditions. All orders
                  are subject to acceptance by us. We may refuse any order for any reason at any time.
                </p>
                <p>
                  Payment must be made in full before delivery unless otherwise agreed. For cash on delivery orders,
                  payment must be made in Pakistani Rupees at the time of delivery. We reserve the right to request
                  additional verification for large orders.
                </p>
                <p>
                  Custom orders require a 50% advance payment before production begins. The remaining balance must be
                  paid before delivery. Custom orders cannot be cancelled once production has started.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Liability Limitations */}
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <AlertTriangle className="w-6 h-6 text-orange-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 font-montserrat">Limitation of Liability</h2>
              </div>
              <div className="space-y-4 text-gray-700 font-poppins">
                <p>
                  To the fullest extent permitted by law, Revive Furniture shall not be liable for any indirect,
                  incidental, special, consequential, or punitive damages, including without limitation, loss of
                  profits, data, use, goodwill, or other intangible losses.
                </p>
                <p>
                  Our total liability to you for any claim arising out of or relating to these terms or our services
                  shall not exceed the amount you paid us for the specific product or service that gave rise to the
                  claim.
                </p>
                <p>
                  We are not responsible for delays or failures in performance resulting from acts beyond our reasonable
                  control, including but not limited to natural disasters, war, terrorism, labor disputes, or government
                  actions.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Warranty Information */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Shield className="w-6 h-6 text-[#C53D39] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 font-montserrat">Warranty & Disclaimers</h2>
              </div>
              <div className="space-y-4 text-gray-600 font-poppins">
                <p>
                  We provide a limited warranty on our furniture products as specified in individual product
                  descriptions. This warranty covers manufacturing defects but does not cover normal wear and tear,
                  misuse, or damage caused by accidents.
                </p>
                <p>
                  Except as expressly stated in our warranty policy, we disclaim all warranties, express or implied,
                  including but not limited to implied warranties of merchantability and fitness for a particular
                  purpose.
                </p>
                <p>
                  Some jurisdictions do not allow the exclusion of certain warranties, so some of the above exclusions
                  may not apply to you. This warranty gives you specific legal rights, and you may also have other
                  rights which vary from jurisdiction to jurisdiction.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Scale className="w-6 h-6 text-[#C53D39] mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 font-montserrat">Governing Law & Disputes</h2>
              </div>
              <div className="space-y-4 text-gray-600 font-poppins">
                <p>
                  These terms and conditions are governed by and construed in accordance with the laws of Pakistan. Any
                  disputes arising out of or relating to these terms shall be subject to the exclusive jurisdiction of
                  the courts of Karachi, Pakistan.
                </p>
                <p>
                  We encourage you to contact us first to resolve any disputes informally. If we cannot resolve a
                  dispute informally, you agree to resolve any claim, dispute, or controversy through binding
                  arbitration in accordance with the Arbitration Act of Pakistan.
                </p>
                <p>
                  If any provision of these terms is found to be unenforceable or invalid, that provision will be
                  limited or eliminated to the minimum extent necessary so that the remaining terms will remain in full
                  force and effect.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold font-montserrat mb-4">Questions About These Terms?</h2>
          <p className="text-lg font-poppins mb-6">
            If you have any questions about these terms and conditions, please contact our legal team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center">
              <Scale className="w-5 h-5 mr-2" />
              <span className="font-poppins">legal@revivefurniture.com</span>
            </div>
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              <span className="font-poppins">+92 300 1234567</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
