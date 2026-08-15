"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function Hero() {
  const router = useRouter()
  return (
    <section className="relative overflow-hidden bg-background pt-8 pb-12 sm:pt-12 sm:pb-16 md:pb-20 lg:pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col space-y-8 justify-center items-center">
          <div className="flex flex-col justify-center space-y-6 text-center items-center">
            <div className="space-y-4 flex flex-col items-center">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight sm:tracking-tighter text-black leading-[1.05] sm:leading-[0.9] uppercase">
                MONEY FOR HERE,<br className="hidden sm:inline" />
                <span> THERE AND</span><br className="hidden sm:inline" />
                {" "}EVERYWHERE
              </h1>
              <p className="w-full max-w-md text-gray-600 text-sm sm:text-base font-normal mx-auto">
                The international account. For over 30 million people and businesses.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto max-w-xs sm:max-w-none">
              <Button onClick={() => router.push("/auth/sign-up")} className="rounded-full h-11 px-7 bg-[#9FE870] hover:bg-[#8ee05c] text-db-text-primary text-sm sm:text-base font-semibold shadow-xs hover:scale-105 transition-all w-full sm:w-auto">
                Open an account
              </Button>
              <Button onClick={() => router.push("/(auth)/home")} variant="outline" className="rounded-full h-11 px-7 border-2 border-db-text-primary bg-transparent hover:bg-db-text-primary/5 text-db-text-primary text-sm sm:text-base font-semibold transition-all w-full sm:w-auto">
                Send money now
              </Button>
            </div>
          </div>
          <div className="relative w-full max-w-2xl aspect-748/385 mx-auto mt-2 sm:mt-6">
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
    </section>
  )
}
