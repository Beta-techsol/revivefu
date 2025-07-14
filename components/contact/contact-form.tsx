"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  subject?: string
  message?: string
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})

  // Pakistani mobile network prefixes
  const pakistaniPrefixes = [
    "300",
    "301",
    "302",
    "303",
    "304",
    "305",
    "306",
    "307",
    "308",
    "309", // Mobilink/Jazz
    "310",
    "311",
    "312",
    "313",
    "314",
    "315",
    "316",
    "317",
    "318",
    "319", // Mobilink/Jazz
    "320",
    "321",
    "322",
    "323",
    "324",
    "325",
    "326",
    "327",
    "328",
    "329", // Warid/Jazz
    "330",
    "331",
    "332",
    "333",
    "334",
    "335",
    "336",
    "337",
    "338",
    "339", // Ufone
    "340",
    "341",
    "342",
    "343",
    "344",
    "345",
    "346",
    "347",
    "348",
    "349", // Ufone
    "355", // Ufone
    "345",
    "346",
    "347", // SCO/Ufone
    "370", // Instaphone
    "390",
    "391",
    "392",
    "393",
    "394",
    "395",
    "396",
    "397",
    "398",
    "399", // China Mobile
  ]

  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return "Name is required"
    if (name.trim().length < 2) return "Name must be at least 2 characters"
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) return "Name can only contain letters and spaces"
    return undefined
  }

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Email is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Please enter a valid email address"
    return undefined
  }

  const validatePhone = (phone: string): string | undefined => {
    if (!phone.trim()) return "Phone number is required"

    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, "")

    // Check if it starts with +92 or 92 or 0
    if (cleanPhone.startsWith("92")) {
      const withoutCountryCode = cleanPhone.substring(2)
      if (withoutCountryCode.length !== 10) return "Phone number must be 10 digits after country code"
      const prefix = withoutCountryCode.substring(0, 3)
      if (!pakistaniPrefixes.includes(prefix)) return "Invalid Pakistani mobile network prefix"
    } else if (cleanPhone.startsWith("0")) {
      const withoutZero = cleanPhone.substring(1)
      if (withoutZero.length !== 10) return "Phone number must be 10 digits after 0"
      const prefix = withoutZero.substring(0, 3)
      if (!pakistaniPrefixes.includes(prefix)) return "Invalid Pakistani mobile network prefix"
    } else {
      return "Phone number must start with +92, 92, or 0"
    }

    return undefined
  }

  const validateSubject = (subject: string): string | undefined => {
    if (!subject.trim()) return "Subject is required"
    if (subject.trim().length < 5) return "Subject must be at least 5 characters"
    return undefined
  }

  const validateMessage = (message: string): string | undefined => {
    if (message.trim().length > 0 && message.trim().length < 10) {
      return "Message must be at least 10 characters if provided"
    }
    return undefined
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    newErrors.name = validateName(formData.name)
    newErrors.email = validateEmail(formData.email)
    newErrors.phone = validatePhone(formData.phone)
    newErrors.subject = validateSubject(formData.subject)
    newErrors.message = validateMessage(formData.message)

    // Remove undefined errors
    Object.keys(newErrors).forEach((key) => {
      if (newErrors[key as keyof FormErrors] === undefined) {
        delete newErrors[key as keyof FormErrors]
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters except +
    const cleaned = value.replace(/[^\d+]/g, "")

    // If it starts with +92, format as +92 XXX XXX XXXX
    if (cleaned.startsWith("+92")) {
      const number = cleaned.substring(3)
      if (number.length <= 3) return `+92 ${number}`
      if (number.length <= 6) return `+92 ${number.substring(0, 3)} ${number.substring(3)}`
      return `+92 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6, 10)}`
    }

    // If it starts with 92, format as +92 XXX XXX XXXX
    if (cleaned.startsWith("92") && !cleaned.startsWith("+92")) {
      const number = cleaned.substring(2)
      if (number.length <= 3) return `+92 ${number}`
      if (number.length <= 6) return `+92 ${number.substring(0, 3)} ${number.substring(3)}`
      return `+92 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6, 10)}`
    }

    // If it starts with 0, format as 0XXX XXX XXXX
    if (cleaned.startsWith("0")) {
      if (cleaned.length <= 4) return cleaned
      if (cleaned.length <= 7) return `${cleaned.substring(0, 4)} ${cleaned.substring(4)}`
      return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7, 11)}`
    }

    return cleaned
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Reset form
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      setErrors({})

      alert("Message sent successfully! We'll get back to you soon.")
    } catch (error) {
      alert("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    let formattedValue = value
    if (name === "phone") {
      formattedValue = formatPhoneNumber(value)
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }))

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    let error: string | undefined

    switch (name) {
      case "name":
        error = validateName(value)
        break
      case "email":
        error = validateEmail(value)
        break
      case "phone":
        error = validatePhone(value)
        break
      case "subject":
        error = validateSubject(value)
        break
      case "message":
        error = validateMessage(value)
        break
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">We would love to hear from you.</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-gray-700">
              Name *
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`mt-1 ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[#C53D39] focus:ring-[#C53D39]"}`}
              placeholder="Your full name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-700">
              Email *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`mt-1 ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[#C53D39] focus:ring-[#C53D39]"}`}
              placeholder="your.email@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="phone" className="text-gray-700">
            Phone Number *
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mt-1 ${errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[#C53D39] focus:ring-[#C53D39]"}`}
            placeholder="+92 XXX XXX XXXX or 0XXX XXX XXXX"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          <p className="mt-1 text-xs text-gray-500">
            Supported networks: Jazz, Ufone, Telenor, Zong, and other Pakistani carriers
          </p>
        </div>

        <div>
          <Label htmlFor="subject" className="text-gray-700">
            Subject *
          </Label>
          <Input
            id="subject"
            name="subject"
            type="text"
            required
            value={formData.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mt-1 ${errors.subject ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[#C53D39] focus:ring-[#C53D39]"}`}
            placeholder="What can we help you with?"
          />
          {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
        </div>

        <div>
          <Label htmlFor="message" className="text-gray-700">
            Message
          </Label>
          <Textarea
            id="message"
            name="message"
            rows={6}
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mt-1 resize-none ${errors.message ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[#C53D39] focus:ring-[#C53D39]"}`}
            placeholder="Tell us more about your furniture needs... (optional)"
          />
          {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#C53D39]/90 hover:to-[#F1BA69]/90 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Message...
            </>
          ) : (
            "SEND MESSAGE"
          )}
        </Button>
      </form>
    </div>
  )
}
