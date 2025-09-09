// app/living-room/page.tsx
"use client";

import ProductsGrid from "@/components/product-grid";

export default function LivingRoomPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Living Room Furniture</h1>
      <ProductsGrid search="Living Room" />
    </div>
  );
}
