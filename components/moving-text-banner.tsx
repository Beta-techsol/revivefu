"use client"

export function MovingTextBanner() {
  const promotionalTexts = [
    "🔥 MEGA FURNITURE SALE - UP TO 70% OFF ON ALL ITEMS",
    "✨ NEW ARRIVAL COLLECTION - MODERN DESIGNS AT UNBEATABLE PRICES",
    "🚚 FREE DELIVERY ON ORDERS OVER $500 - SHOP NOW",
    "💎 PREMIUM QUALITY FURNITURE - TRANSFORM YOUR SPACE TODAY",
    "⚡ LIMITED TIME OFFER - EXTRA 20% OFF ON BEDROOM SETS",
    "🏠 COMPLETE HOME MAKEOVER - FURNITURE PACKAGES AVAILABLE",
  ]

  return (
    <div className="bg-black text-white py-2 overflow-hidden relative">
      <div className="animate-marquee whitespace-nowrap flex">
        {/* First set of text */}
        <div className="flex items-center space-x-16 px-8">
          {promotionalTexts.map((text, index) => (
            <span key={index} className="text-sm font-medium tracking-wide">
              {text}
            </span>
          ))}
        </div>
        {/* Duplicate set for seamless loop */}
        <div className="flex items-center space-x-16 px-8">
          {promotionalTexts.map((text, index) => (
            <span key={`duplicate-${index}`} className="text-sm font-medium tracking-wide">
              {text}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  )
}
