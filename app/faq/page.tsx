"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, MessageCircle, Phone, Mail, ThumbsUp, ThumbsDown } from "lucide-react"
import { HeroSlider } from "@/components/common/hero-slider"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])
  const [helpfulVotes, setHelpfulVotes] = useState<{ [key: number]: "yes" | "no" | null }>({})

  const heroImages = ["/contact/hero-bg.jpg", "/about/hero-1.jpg", "/contact/furniture-showcase-1.jpg"]

  const breadcrumb = [{ label: "FAQ" }]

  const faqCategories = [
    {
      title: "Products & Materials",
      questions: [
        {
          question: "What materials are your furniture products made from?",
          answer:
            "We use premium materials including solid hardwood (oak, walnut, mahogany), high-grade steel frames, genuine leather, and commercial-grade fabrics. All materials are sourced from certified suppliers and meet international quality standards. We also offer eco-friendly options including reclaimed wood and sustainable bamboo for environmentally conscious customers.",
        },
        {
          question: "Do you offer custom furniture design services?",
          answer:
            "Yes! We specialize in custom furniture design. Our experienced craftsmen can create bespoke pieces tailored to your exact specifications, space requirements, and style preferences. The custom design process typically takes 2-3 weeks for design approval, followed by 6-8 weeks for crafting and finishing.",
        },
        {
          question: "What's the difference between your furniture grades?",
          answer:
            "We offer three quality grades: Premium (solid hardwood with hand-finished details), Standard (engineered wood with veneer finish), and Essential (particle board with laminate). All grades come with our quality guarantee, but Premium offers the longest durability and comes with a lifetime warranty.",
        },
        {
          question: "Are your products suitable for commercial use?",
          answer:
            "Our commercial-grade furniture is designed for high-traffic environments like offices, hotels, and restaurants. These pieces feature reinforced joints, commercial-grade upholstery, and enhanced durability testing. We also offer volume discounts for bulk orders.",
        },
      ],
    },
    {
      title: "Ordering & Delivery",
      questions: [
        {
          question: "How long does delivery take?",
          answer:
            "Delivery times vary by location and product type. Standard items: 5-7 business days within major cities, 7-14 days for remote areas. Custom furniture: 6-8 weeks plus delivery time. We offer expedited shipping for urgent orders at additional cost.",
        },
        {
          question: "Do you offer white glove delivery service?",
          answer:
            "Yes! Our white glove service includes scheduled delivery, unpacking, assembly, placement in your desired room, and removal of all packaging materials. This service is available for an additional fee and includes basic setup instructions.",
        },
        {
          question: "What if my furniture arrives damaged?",
          answer:
            "We take great care in packaging, but if damage occurs during transit, please document it with photos and contact us within 48 hours. We'll arrange for repair, replacement, or full refund depending on the extent of damage. Our insurance covers all shipping-related damages.",
        },
        {
          question: "Can I track my order?",
          answer:
            "Yes! Once your order ships, you'll receive a tracking number via email and SMS. You can also track your order status in real-time through our website or by calling our customer service team.",
        },
      ],
    },
    {
      title: "Returns & Warranty",
      questions: [
        {
          question: "What is your return policy?",
          answer:
            "We offer a 30-day return window for standard items in original condition. Custom furniture cannot be returned unless there's a manufacturing defect. Return shipping costs are covered by us if the item is defective, otherwise customer pays return shipping.",
        },
        {
          question: "Do you provide warranty on your furniture?",
          answer:
            "Yes! We provide comprehensive warranties: 1 year on all moving parts and mechanisms, 5 years on structural components, and lifetime warranty on Premium grade solid wood pieces. Warranty covers manufacturing defects but not normal wear and tear.",
        },
        {
          question: "How do I file a warranty claim?",
          answer:
            "Contact our customer service with your order number, photos of the issue, and description of the problem. Our team will assess the claim and arrange for repair, replacement parts, or full replacement depending on the warranty terms.",
        },
      ],
    },
    {
      title: "Showroom & Services",
      questions: [
        {
          question: "Do you have a physical showroom?",
          answer:
            "Yes! Our main showroom is located in the city center, featuring over 200 furniture pieces across different room settings. We also have satellite locations in major shopping districts. Showroom visits are by appointment to ensure personalized attention.",
        },
        {
          question: "Do you offer interior design consultation?",
          answer:
            "We provide complimentary design consultation for orders over $2,000. Our certified interior designers can help with space planning, color coordination, and furniture selection. Full interior design services are available for an additional fee.",
        },
        {
          question: "Can I see fabric and wood samples before ordering?",
          answer:
            "We can send up to 5 fabric swatches and wood samples free of charge. Samples are typically delivered within 3-5 business days. For custom orders, we recommend reviewing samples before finalizing your design.",
        },
      ],
    },
  ]

  const toggleItem = (categoryIndex: number, questionIndex: number) => {
    const itemId = categoryIndex * 100 + questionIndex
    setOpenItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const handleHelpfulVote = (categoryIndex: number, questionIndex: number, vote: "yes" | "no") => {
    const itemId = categoryIndex * 100 + questionIndex
    setHelpfulVotes((prev) => ({
      ...prev,
      [itemId]: prev[itemId] === vote ? null : vote,
    }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Slider */}
      <HeroSlider title="Frequently Asked Questions" breadcrumb={breadcrumb} images={heroImages} />

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 font-montserrat mb-4">Need More Help?</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <MessageCircle className="w-8 h-8 text-[#C53D39] mx-auto mb-2" />
                    <h4 className="font-semibold font-poppins mb-2">Live Chat</h4>
                    <p className="text-sm text-gray-600 font-poppins mb-3">Chat with our support team</p>
                    <Button className="w-full bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white">
                      Start Chat
                    </Button>
                  </div>

                  <div className="text-center">
                    <Phone className="w-8 h-8 text-[#C53D39] mx-auto mb-2" />
                    <h4 className="font-semibold font-poppins mb-2">Call Us</h4>
                    <p className="text-sm text-gray-600 font-poppins mb-3">Mon-Fri 9AM-6PM</p>
                    <a href="tel:+1234567890" className="text-[#C53D39] font-semibold font-poppins">
                      +1 (234) 567-8900
                    </a>
                  </div>

                  <div className="text-center">
                    <Mail className="w-8 h-8 text-[#C53D39] mx-auto mb-2" />
                    <h4 className="font-semibold font-poppins mb-2">Email Support</h4>
                    <p className="text-sm text-gray-600 font-poppins mb-3">Get help via email</p>
                    <Button asChild variant="outline" className="w-full bg-transparent">
                      <Link href="/contact">Contact Us</Link>
                    </Button>
                  </div>

                  <div className="text-center pt-4 border-t">
                    <h4 className="font-semibold font-poppins mb-2">WhatsApp Support</h4>
                    <p className="text-sm text-gray-600 font-poppins mb-3">Quick responses on WhatsApp</p>
                    <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
                      <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                        Chat on WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 font-montserrat mb-4">How can we help you?</h2>
              <p className="text-gray-600 font-poppins text-lg">
                Find answers to the most commonly asked questions about our furniture, services, and policies.
              </p>
            </div>

            <div className="space-y-8">
              {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h3 className="text-2xl font-bold text-gray-900 font-montserrat mb-6 pb-2 border-b-2 border-[#C53D39]">
                    {category.title}
                  </h3>

                  <div className="space-y-4">
                    {category.questions.map((faq, questionIndex) => {
                      const itemId = categoryIndex * 100 + questionIndex
                      const isOpen = openItems.includes(itemId)
                      const helpfulVote = helpfulVotes[itemId]

                      return (
                        <Card key={questionIndex} className="overflow-hidden">
                          <CardContent className="p-0">
                            <button
                              onClick={() => toggleItem(categoryIndex, questionIndex)}
                              className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                            >
                              <h4 className="text-lg font-semibold text-gray-900 font-poppins pr-4">{faq.question}</h4>
                              {isOpen ? (
                                <ChevronUp className="w-5 h-5 text-[#C53D39] flex-shrink-0" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-[#C53D39] flex-shrink-0" />
                              )}
                            </button>

                            {isOpen && (
                              <div className="px-6 pb-6">
                                <div className="pt-4 border-t border-gray-100">
                                  <p className="text-gray-700 font-poppins leading-relaxed mb-4">{faq.answer}</p>

                                  <div className="flex items-center space-x-4 pt-4 border-t border-gray-50">
                                    <span className="text-sm text-gray-600 font-poppins">Was this answer helpful?</span>
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => handleHelpfulVote(categoryIndex, questionIndex, "yes")}
                                        className={`p-2 rounded-full transition-colors ${
                                          helpfulVote === "yes"
                                            ? "bg-green-100 text-green-600"
                                            : "hover:bg-gray-100 text-gray-400"
                                        }`}
                                      >
                                        <ThumbsUp className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleHelpfulVote(categoryIndex, questionIndex, "no")}
                                        className={`p-2 rounded-full transition-colors ${
                                          helpfulVote === "no"
                                            ? "bg-red-100 text-red-600"
                                            : "hover:bg-gray-100 text-gray-400"
                                        }`}
                                      >
                                        <ThumbsDown className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Still Need Help Section */}
            <Card className="mt-12 bg-gradient-to-r from-[#C53D39]/5 to-[#F1BA69]/5">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 font-montserrat mb-4">Still need help?</h3>
                <p className="text-gray-600 font-poppins mb-6">
                  Can't find the answer you're looking for? Our customer support team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
                  >
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                  <Button asChild variant="outline" className="bg-transparent">
                    <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                      WhatsApp Us
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
