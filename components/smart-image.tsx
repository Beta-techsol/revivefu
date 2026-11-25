"use client"

import Image, { type ImageProps } from "next/image"
import { cloudinaryImageLoader, isCloudinaryUrl } from "@/lib/cloudinary-image"

export function SmartImage({ loader, src, ...props }: ImageProps) {
  const effectiveLoader = loader ?? (isCloudinaryUrl(src) ? cloudinaryImageLoader : undefined)
  return <Image src={src} loader={effectiveLoader} {...props} />
}

export default SmartImage
