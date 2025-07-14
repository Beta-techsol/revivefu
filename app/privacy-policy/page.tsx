import { Shield, Eye, Lock, Users, Database, Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  const dataTypes = [
    {
      title: "Personal Information",
      items: [
        "Name, email address, phone number",
        "Billing and shipping addresses",
        "Payment information (processed securely)",
      ],
      icon: Users,
    },
    {
      title: "Order Information",
      items: ["Purchase history and preferences", "Product reviews and ratings", "Customer service interactions"],
      icon: Database,
    },
    {
      title: "Technical Data",
      items: [
        "IP address and browser information",
        "Device type and operating system",
        "Website usage patterns and analytics",
      ],
      icon: Globe,
    },
  ]

  const customerRights = [
    "Access your personal data we hold about you",
    "Request correction of inaccurate personal data",
    "Request deletion of your personal data",
    "Object to processing of your personal data",
    "Request restriction of processing your personal data",
    "Request transfer of your personal data to another service",
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg opacity-90">Home / Privacy Policy</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Overview Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Your Privacy Matters to Us</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            At Revive Furniture, we are committed to protecting your privacy and ensuring the security of your personal
            information. This policy explains how we collect, use, and safeguard your data.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: January 15, 2024</p>
        </div>

        {/* Data Collection */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Information We Collect</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dataTypes.map((type, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-r from-red-600 to-orange-500 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                      <type.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{type.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {type.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-600 text-sm flex items-start">
                        <span className="w-2 h-2 bg-red-600 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How We Use Data */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How We Use Your Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Shield className="w-6 h-6 text-red-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">Order Processing</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Process and fulfill your furniture orders</li>
                  <li>• Communicate order status and delivery updates</li>
                  <li>• Handle payments and billing</li>
                  <li>• Provide customer support and assistance</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Eye className="w-6 h-6 text-red-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">Service Improvement</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• Personalize your shopping experience</li>
                  <li>• Analyze website usage and performance</li>
                  <li>• Develop new products and services</li>
                  <li>• Send relevant marketing communications</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Data Protection */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How We Protect Your Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-r from-red-600 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">SSL Encryption</h3>
              <p className="text-gray-600 text-sm">All data transmitted is encrypted using industry-standard SSL</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-red-600 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Storage</h3>
              <p className="text-gray-600 text-sm">Data stored on secure servers with restricted access</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-red-600 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Control</h3>
              <p className="text-gray-600 text-sm">Limited employee access on need-to-know basis</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-red-600 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Regular Backups</h3>
              <p className="text-gray-600 text-sm">Regular data backups to prevent loss</p>
            </div>
          </div>
        </div>

        {/* Customer Rights */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Your Rights & Choices</h2>
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <p className="text-gray-600 mb-6">You have the right to control your personal information. You can:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customerRights.map((right, index) => (
                  <div key={index} className="flex items-start">
                    <Shield className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{right}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-sm">
                  To exercise any of these rights, please contact us at privacy@revivefurniture.com or call +92 300
                  1234567. We will respond to your request within 30 days.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Questions About Privacy?</h2>
          <p className="text-lg mb-6">
            If you have any questions about this privacy policy or how we handle your data, please don't hesitate to
            contact us.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              <span>privacy@revivefurniture.com</span>
            </div>
            <div className="flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              <span>Data Protection Officer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
