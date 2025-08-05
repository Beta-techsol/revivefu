import PortfolioHeroSlider from "@/components/portfolio/portfolio-hero-slider"
import PortfolioGrid from "@/components/portfolio/portfolio-grid"

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Slider Section */}
      <PortfolioHeroSlider />

      {/* Portfolio Grid Section */}
      <PortfolioGrid />
    </div>
  )
}
