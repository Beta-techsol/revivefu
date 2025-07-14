import HeroSlider from "@/components/HeroSlider"

const heroImages = ["/images/privacy-policy-hero.jpg"]

const breadcrumb = [{ label: "Privacy Policy" }]

export default function PrivacyPolicy() {
  return (
    <>
      <HeroSlider images={heroImages} title="Privacy Policy" breadcrumb={breadcrumb} />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-5">Privacy Policy</h1>
        <p className="mb-5">
          Your privacy is important to us. It is our policy to respect your privacy regarding any information we may
          collect from you across our website, <a href="https://example.com">https://example.com</a>, and other sites we
          own and operate.
        </p>
        <h2 className="text-2xl font-bold mb-3">Information We Collect</h2>
        <p className="mb-5">
          We collect information from you when you register on our site, place an order, subscribe to our newsletter,
          respond to a survey or fill out a form.
        </p>
        <p className="mb-5">
          When ordering or registering on our site, as appropriate, you may be asked to enter your: name, e-mail
          address, mailing address, phone number or credit card information. You may, however, visit our site
          anonymously.
        </p>
        <h2 className="text-2xl font-bold mb-3">How We Use Your Information</h2>
        <p className="mb-5">Any of the information we collect from you may be used in one of the following ways:</p>
        <ul className="list-disc pl-5 mb-5">
          <li>To personalize your experience</li>
          <li>To improve our website</li>
          <li>To improve customer service</li>
          <li>To process transactions</li>
          <li>To send periodic emails</li>
        </ul>
        <h2 className="text-2xl font-bold mb-3">How We Protect Your Information</h2>
        <p className="mb-5">
          We implement a variety of security measures to maintain the safety of your personal information when you place
          an order or enter, submit, or access your personal information.
        </p>
        <h2 className="text-2xl font-bold mb-3">Do We Use Cookies?</h2>
        <p className="mb-5">
          Yes (Cookies are small files that a site or its service provider transfers to your computers hard drive
          through your Web browser (if you allow) that enables the sites or service providers systems to recognize your
          browser and capture and remember certain information.
        </p>
        <h2 className="text-2xl font-bold mb-3">Third Party Links</h2>
        <p className="mb-5">
          Occasionally, at our discretion, we may include or offer third party products or services on our website.
          These third party sites have separate and independent privacy policies. We therefore have no responsibility or
          liability for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity
          of our site and welcome any feedback about these sites.
        </p>
        <h2 className="text-2xl font-bold mb-3">Childrens Online Privacy Protection Act Compliance</h2>
        <p className="mb-5">
          We are in compliance with the requirements of COPPA (Childrens Online Privacy Protection Act), we do not
          collect any information from anyone under 13 years of age. Our website, products and services are all directed
          to people who are at least 13 years old or older.
        </p>
        <h2 className="text-2xl font-bold mb-3">Online Privacy Policy Only</h2>
        <p className="mb-5">
          This online privacy policy applies only to information collected through our website and not to information
          collected offline.
        </p>
        <h2 className="text-2xl font-bold mb-3">Terms and Conditions</h2>
        <p className="mb-5">
          Please also visit our Terms and Conditions section establishing the use, disclaimers, and limitations of
          liability governing the use of our website at <a href="#">Terms and Conditions</a>.
        </p>
        <h2 className="text-2xl font-bold mb-3">Your Consent</h2>
        <p className="mb-5">By using our site, you consent to our web site privacy policy.</p>
        <h2 className="text-2xl font-bold mb-3">Changes to our Privacy Policy</h2>
        <p className="mb-5">If we decide to change our privacy policy, we will post those changes on this page.</p>
        <h2 className="text-2xl font-bold mb-3">Contacting Us</h2>
        <p className="mb-5">
          If there are any questions regarding this privacy policy you may contact us using the information below.
        </p>
        <p className="mb-5">
          <a href="https://example.com">https://example.com</a>
        </p>
      </div>
    </>
  )
}
