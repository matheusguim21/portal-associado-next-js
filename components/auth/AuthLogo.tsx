import Image from 'next/image'
import { cn } from '@/lib/utils'

interface AuthLogoProps {
  className?: string
}

export function AuthLogo({ className }: AuthLogoProps) {
  return (
    <Image
      src="/logos/logo.svg"
      alt="SOCINPRO"
      width={200}
      height={45}
      priority
      className={cn(
        'mx-auto block h-[2.8125rem] w-auto max-w-[min(12.5rem,100%)] object-contain object-center',
        className,
      )}
    />
  )
}
