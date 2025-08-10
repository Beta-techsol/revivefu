"use client";

import dynamic from "next/dynamic";

const WhatsAppWidget = dynamic(() => import("@/components/WhatsAppFloating"), {
  ssr: false,
});

export default function WhatsAppWrapper() {
  return <WhatsAppWidget phoneNumber="923154843593" />;
}
