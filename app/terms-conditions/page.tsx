import { AlertTriangle, CreditCard, FileText, Scale, Shield, Users } from "lucide-react"

export default function TermsConditionsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* ---------- HERO ---------- */}
      <section className="relative h-64 flex items-center justify-center overflow-hidden">
        {/* background image */}
        <div
          className="absolute inset-0 bg-center bg-cover opacity-30"
          style={{
            backgroundImage: "url('/contact/furniture-showcase-1.jpg')",
          }}
        />
        {/* overlay content */}
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Terms &amp; Conditions</h1>
          <p className="opacity-90">Home / Terms &amp; Conditions</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* ---------- INTRODUCTION ---------- */}
        <section>
          <header className="flex items-center mb-6">
            <FileText className="w-6 h-6 text-red-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Introduction</h2>
          </header>
          <div className="bg-white rounded-lg shadow-md p-8 space-y-4">
            <p className="text-gray-600 leading-relaxed">
              Welcome to Revive Furniture. These terms and conditions outline the rules and regulations for the use of
              our website and services. By accessing this website, you accept these terms in full. If you disagree with
              any part, please do not use our site.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We may update these terms from time to time. Your continued use of the website constitutes acceptance of
              any changes.
            </p>
          </div>
        </section>

        {/* ---------- TERMS OF USE ---------- */}
        <section>
          <header className="flex items-center mb-6">
            <Users className="w-6 h-6 text-red-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Terms of Use</h2>
          </header>
          <div className="bg-white rounded-lg shadow-md p-8 space-y-4">
            <p className="text-gray-600 leading-relaxed">
              You must be at least 18 years old to purchase from our website. When placing an order, you agree to
              provide accurate information and keep your account details confidential.
            </p>
            <p className="text-gray-600 leading-relaxed">
              All prices are listed in PKR and include applicable taxes. Payment must be made at the time of order
              placement unless otherwise agreed.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You agree to use our website only for lawful purposes and in accordance with these terms.
            </p>
          </div>
        </section>

        {/* ---------- INTELLECTUAL PROPERTY ---------- */}
        <section>
          <header className="flex items-center mb-6">
            <Scale className="w-6 h-6 text-red-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Intellectual Property</h2>
          </header>
          <div className="bg-white rounded-lg shadow-md p-8 space-y-4">
            <p className="text-gray-600 leading-relaxed">
              All content on this website is the property of Revive Furniture or its content suppliers and is protected
              by applicable copyright laws.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You may not reproduce or distribute any material without our prior written consent. Our trademarks may not
              be used without permission.
            </p>
          </div>
        </section>

        {/* ---------- PAYMENT TERMS ---------- */}
        <section>
          <header className="flex items-center mb-6">
            <CreditCard className="w-6 h-6 text-red-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Payment Terms</h2>
          </header>
          <div className="bg-white rounded-lg shadow-md p-8 space-y-4">
            <p className="text-gray-600 leading-relaxed">
              We accept cash on delivery, bank transfers, and selected digital payments. All transactions are processed
              securely.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Custom orders require a 50% advance payment before production begins; the balance is due before delivery.
            </p>
          </div>
        </section>

        {/* ---------- LIMITATION OF LIABILITY ---------- */}
        <section>
          <header className="flex items-center mb-6">
            <AlertTriangle className="w-6 h-6 text-orange-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Limitation of Liability</h2>
          </header>
          <div className="bg-orange-50 border border-orange-200 rounded-lg shadow-md p-8 space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Revive Furniture shall not be liable for any indirect, incidental, special, or consequential damages
              resulting from the use of our services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our total liability shall not exceed the amount paid for the product giving rise to the claim.
            </p>
          </div>
        </section>

        {/* ---------- GOVERNING LAW ---------- */}
        <section>
          <header className="flex items-center mb-6">
            <Shield className="w-6 h-6 text-red-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Governing Law</h2>
          </header>
          <div className="bg-white rounded-lg shadow-md p-8 space-y-4">
            <p className="text-gray-600 leading-relaxed">
              These terms are governed by the laws of Pakistan. Any disputes shall be resolved in the courts of Karachi.
            </p>
            <p className="text-gray-600 leading-relaxed">
              If any provision is deemed unenforceable, the remaining terms will remain in effect.
            </p>
          </div>
        </section>

        {/* ---------- CONTACT US ---------- */}
        <section>
          <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
            <p className="text-lg mb-6 opacity-90">For questions regarding these terms, reach out to our legal team.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                <span>legal@revivefurniture.com</span>
              </div>
              <div className="flex items-center">
                <Scale className="w-5 h-5 mr-2" />
                <span>+92&nbsp;300&nbsp;1234567</span>
              </div>
            </div>
          </div>
        </section>

        <p className="text-center text-gray-500 text-sm">Last updated: January&nbsp;15,&nbsp;2024</p>
      </div>
    </main>
  )
}
