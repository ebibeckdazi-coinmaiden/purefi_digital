import { Button } from "@/components/ui/button"
import Image from "next/image"

export function BusinessSection() {
  return (
    <section className="pt-16 md:pt-24 bg-[#9FE870] text-[#163300] overflow-hidden">
      {/* 1. Headline - Full Width */}
      <div className="mb-14 px-4 sm:px-12">
        <h2 className="text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl  leading-[0.9] uppercase max-w-5xl">
          Trusted by busi-<br />nesses small and<br /> large
        </h2>
      </div>
      {/* 2. Content Grid - Cards Left, Text Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:h-110 gap-12 items-end">
        {/* Left: Cards Visual */}
        <div className="relative h-full flex items-end">
          <Image
            src="/assets/images/cards-removebg.png"
            alt="Business Section"
            width={1200}
            height={1200}
            className="w-full h-auto lg:w-300 lg:h-100"
          />
        </div>

        {/* Right: Text & Buttons */}
        <div className="h-full flex flex-col justify-start space-y-8 lg:pb-12 lg:pl-12">
          <p className="text-base font-[450] leading-relaxed max-w-86">
            Go global with the international business account. Pay employees, get paid and manage your cash flow in multiple currencies. Join over 300,000 businesses thriving with PureFi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className=" rounded-full h-9 px-3 text-sm font-medium bg-(--dark-green) text-(--bright-green) hover:bg-(--dark-green)">
              Open a Business account
            </Button>
            <Button variant="outline" className="bg-[#9FE870] rounded-full h-9 px-9 text-(--dark-green) text-sm font-medium border-1 border-(--dark-green)">
              Learn more
            </Button>
          </div>
        </div>

      </div>
    </section>
  )
}
