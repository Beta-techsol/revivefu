import { MobileHeader } from "./header/mobile-header"

import { EnhancedHeader } from "./header/enhanced-header"
import { TopBar } from "./top-bar"

export const Header = () => {
  return (
    <>
      <TopBar />
      <MobileHeader />
      <div className="hidden lg:block">
        <EnhancedHeader />
      </div>
    </>
  )
}
