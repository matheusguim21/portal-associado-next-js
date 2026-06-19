import { cn } from '@/lib/utils'
import Image from 'next/image'
interface SocinproLogoProps {
  className?: string
  size?: number
}

export function SocinproLogo({ className, size = 40 }: SocinproLogoProps) {
  return (
    <div className={cn('shrink-0', className)}>
      <Image src="/logos/logo.svg" alt="SOCINPRO" width={size} height={size} />
    </div>
  )
}
