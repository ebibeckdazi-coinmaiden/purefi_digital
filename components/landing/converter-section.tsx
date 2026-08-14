import Image from "next/image"

export function ConverterSection() {
  return (
    <section className="py-16 bg-[#9FE870] text-black">
      <div className="container mx-auto px-4 lg:px-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 items-center">
          <div className="flex flex-col space-y-6 max-w-130">
            <h2 className="text-5xl font-bold font-[Inter] tracking-tight text-green-950/90">
              Save up to 9x when you send currencies
            </h2>
            <p className="text-base max-w-70 font-normal text-green-950  leading-relaxed font-[Inter]">
              Sending money shouldn&apos;t cost the earth, so we built PureFi to save you money when you transfer and exchange internationally. We charge as little as possible: right now a tiny fee, eventually free.
            </p>
          </div>
          <div className="relative w-full h-60 sm:h-80 lg:h-140 lg:w-120">
            <Image
              src="/assets/images/convertion-img.png"
              alt="convertion-img"
              layout="fill"
              objectFit="contain" 
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
