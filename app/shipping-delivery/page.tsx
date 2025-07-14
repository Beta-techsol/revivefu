import HeroSlider from "@/components/HeroSlider";

const heroImages = [
  "/images/shipping-delivery/shipping-delivery-hero.webp",
];

const breadcrumb = [{ label: "Shipping & Delivery" }]

export default function ShippingDelivery() {
  return (
    <div>
      <HeroSlider images={heroImages} title="Shipping & Delivery" breadcrumb={breadcrumb} />
    </div>
  );
}
