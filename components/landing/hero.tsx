import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-10 pb-12 md:pb-20 lg:pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className=" flex flex-col space-y-8 justify-center items-center">
          <div className="flex flex-col justify-center space-y-6 text-center  items-center">
            <div className="space-y-4 flex flex-col items-center">
              <h1 className="text-4xl text-center font-black tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-black leading-[0.9]">
                MONEY FOR HERE,<br className="hidden sm:inline" />
                <span>THERE AND</span> <br className="hidden sm:inline" />
                 EVERYWHERE
              </h1>
              <p className="w-full max-w-md text-gray-600 text-base font-normal mx-auto lg:mx-0">
                The international account. For over 30 million people and businesses.
              </p>
            </div>
            <div className="flex flex-col gap-3 min-[400px]:flex-row">
              <Button className="rounded-full h-10 px-7 text-(--dark-green) text-base font-medium hover:scale-105 transition-transform">
                Open an account
              </Button>
              <Button variant="outline" className="rounded-full h-10 px-7 text-(--dark-green) text-base font-medium border-1 border-(--dark-green)">
                Send money now
              </Button>
            </div>
          </div>
          <div className="flex justify-center relative w-full h-60 sm:h-110">
            <div className="relative w-[min(100%,30rem)] aspect-square">
              <Image
                src="/assets/images/coins_no_background.png"
                alt="Global currency exchange"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}