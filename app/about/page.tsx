import HeroSlider from "@/components/about/hero-slider"
import WelcomeSection from "@/components/about/welcome-section"
import TimelineSection from "@/components/about/timeline-section"
import AwardsSection from "@/components/about/awards-section"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <HeroSlider />
      <WelcomeSection />
      <TimelineSection />
      <AwardsSection />
    </div>
  )
}
