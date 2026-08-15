import Image from "next/image"

export function ConverterSection() {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-[#9FE870] text-[#163300]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-12 items-center">
          <div className="flex flex-col space-y-4 sm:space-y-6 lg:col-span-6 max-w-xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-[Inter] tracking-tight text-[#163300] leading-[1.15] sm:leading-[1.1]">
              Save up to 9x when you send currencies
            </h2>
            <p className="text-base sm:text-lg font-normal text-[#163300]/90 leading-relaxed max-w-lg">
              Sending money shouldn&apos;t cost the earth, so we built PureFi to save you money when you transfer and exchange internationally. We charge as little as possible: right now a tiny fee, eventually free.
            </p>
          </div>
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-none lg:col-span-6 aspect-[445/560] mx-auto">
            <Image
              src="/assets/images/convertion-img.png"
              alt="Currency Conversion Details"
              fill
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

