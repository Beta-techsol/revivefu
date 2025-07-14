import { HeroSlider } from "@/components/common/hero-slider"
export default function PrivacyPolicy() {
  return (
    <div>
      <HeroSlider title="Privacy Policy" breadcrumb={[{ label: "Privacy Policy" }]} />
      <div className="container mx-auto py-12">
        <h2 className="text-2xl font-bold mb-4">Introduction</h2>
        <p className="mb-4">
          Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal
          information when you use our website.
        </p>

        <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
        <p className="mb-4">We may collect the following types of information:</p>
        <ul className="list-disc pl-5 mb-4">
          <li>Personal Information: Name, email address, etc.</li>
          <li>Usage Data: IP address, browser type, pages visited, etc.</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
        <p className="mb-4">We may use your information for the following purposes:</p>
        <ul className="list-disc pl-5 mb-4">
          <li>To provide and improve our services.</li>
          <li>To communicate with you.</li>
          <li>To personalize your experience.</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4">Data Security</h2>
        <p className="mb-4">
          We take reasonable measures to protect your information from unauthorized access, use, or disclosure.
        </p>

        <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
          policy on our website.
        </p>

        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at [Your Contact Information].
        </p>
      </div>
    </div>
  )
}
