import { Hero } from "@/components/landing/hero"
import { GlobalAccount } from "@/components/landing/global-account"
import { ConverterSection } from "@/components/landing/converter-section"
import { DebitCard } from "@/components/landing/debit-card"
import { BusinessSection } from "@/components/landing/business-section"
import { TravelSection } from "@/components/landing/travel-section"
import { Security } from "@/components/landing/security"

export default function LandingPage() {
  return (
    <>
      <Hero />
      <GlobalAccount />
      <ConverterSection />
      <DebitCard />
      <BusinessSection />
      <TravelSection />
      <Security />
    </>
  )
}