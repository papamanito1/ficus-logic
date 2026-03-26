import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageContainerProps {
  src: string
  alt: string
  aspectRatio?: string
  className?: string
  priority?: boolean
}

export default function ImageContainer({
  src,
  alt,
  aspectRatio = '16/9',
  className,
  priority = false,
}: ImageContainerProps) {
  return (
    <div
      className={cn('relative overflow-hidden rounded-2xl', className)}
      style={{ aspectRatio }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover"
        priority={priority}
      />
    </div>
  )
}
