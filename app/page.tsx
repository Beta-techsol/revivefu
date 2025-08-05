import { ShopByRoom } from "@/components/shop-by-room"
import { RoomShowcaseSection } from "@/components/room-showcase-section"

export default function Home() {
  return (
    <div>
      {/* Shop by Room Section */}
      <ShopByRoom />

      {/* Room Showcase Section */}
      <RoomShowcaseSection />
    </div>
  )
}
