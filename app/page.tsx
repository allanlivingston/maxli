import Image from 'next/image'
import { LandingPageComponent } from '@/components/landing-page'

export default function Home() {
  return (
    <>
      <Image
        src="/images/homebackground.webp"
        alt="Home background"
        priority
        fill
        className="object-cover z-[-1]"
      />
      <LandingPageComponent />
    </>
  )
}