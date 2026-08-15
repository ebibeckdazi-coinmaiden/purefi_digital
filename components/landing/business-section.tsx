import { Button } from "@/components/ui/button"
import Image from "next/image"

export function BusinessSection() {
  return (
    <section className="pt-12 sm:pt-16 md:pt-24 pb-12 sm:pb-16 lg:pb-0 bg-[#9FE870] text-[#163300] overflow-hidden">
      {/* 1. Headline - Full Width */}
      <div className="mb-8 sm:mb-12 lg:mb-14 px-4 sm:px-8 lg:px-12">
        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight sm:tracking-tighter leading-[1.05] sm:leading-[0.9] uppercase max-w-5xl">
          Trusted by busi-<br />nesses small and<br /> large
        </h2>
      </div>

      {/* 2. Content Grid - Cards Left, Text Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:h-110 gap-8 lg:gap-12 items-end">
        {/* Left: Cards Visual */}
        <div className="relative h-full flex items-end px-4 sm:px-8 lg:px-0">
          <Image
            src="/assets/images/cards-removebg.png"
            alt="Business Section"
            width={1200}
            height={1200}
            className="w-full h-auto max-w-md sm:max-w-lg lg:max-w-none mx-auto lg:w-300 lg:h-100 object-contain"
          />
        </div>

        {/* Right: Text & Buttons */}
        <div className="h-full flex flex-col justify-start space-y-6 sm:space-y-8 px-4 sm:px-8 lg:px-0 lg:pb-12 lg:pl-12">
          <p className="text-base sm:text-lg font-medium leading-relaxed max-w-lg text-[#163300]/90">
            Go global with the international business account. Pay employees, get paid and manage your cash flow in multiple currencies. Join over 300,000 businesses thriving with PureFi.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Button className="rounded-full h-11 px-7 text-sm sm:text-base font-semibold bg-[#163300] text-[#9FE870] hover:bg-[#163300]/90 transition-all w-full sm:w-auto">
              Open a Business account
            </Button>
            <Button variant="outline" className="bg-[#9FE870] hover:bg-[#8ee05c] rounded-full h-11 px-7 text-[#163300] text-sm sm:text-base font-semibold border-2 border-[#163300] transition-all w-full sm:w-auto">
              Learn more
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

