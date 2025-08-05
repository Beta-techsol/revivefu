"use client"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

interface DualRangeSliderProps {
  value: [number, number]
  onValueChange: (value: [number, number]) => void
  max: number
  min: number
  step?: number
  className?: string
}

export function DualRangeSlider({ value, onValueChange, max, min, step = 1, className }: DualRangeSliderProps) {
  return (
    <div className={cn("relative", className)}>
      <SliderPrimitive.Root
        className="relative flex w-full touch-none select-none items-center"
        value={value}
        onValueChange={onValueChange}
        max={max}
        min={min}
        step={step}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200">
          <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-amber-600 to-orange-600" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-white bg-gradient-to-r from-amber-600 to-orange-600 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-lg" />
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-white bg-gradient-to-r from-amber-600 to-orange-600 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-lg" />
      </SliderPrimitive.Root>
    </div>
  )
}
