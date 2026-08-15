
import { Button } from "@/components/ui/button"
import Image from "next/image"
import LockIcon from "@/app/components/ui/icons/Lock"
import PhoneLockIcon from "@/app/components/ui/icons/PhoneLock"
import BankIcon from "@/app/components/ui/icons/Bank"

export function Security() {
  return (
    <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-white text-black overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center mb-12 sm:mb-16 lg:mb-24">
          <div className="lg:col-span-6 max-w-xl">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black mb-4 sm:mb-6">
              Disappoint thieves
            </h2>
            <p className="text-base sm:text-lg font-normal sm:font-medium text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-lg">
              Every month, our customers trust us to move over £10 billion of their money. Here are some of the important ways we protect them.
            </p>
            <Button className="rounded-full bg-[#9FE870] hover:bg-[#8ee05c] text-sm sm:text-base text-[#163300] font-semibold h-11 px-7 shadow-xs hover:scale-105 transition-all w-full sm:w-auto">
              How we keep your money safe
            </Button>
          </div>
          
          <div className="lg:col-span-6 flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md aspect-[406/376] mx-auto lg:mx-0">
              <Image
                src="/assets/images/lock.png"
                alt="Security Lock"
                fill
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 pt-8 sm:pt-12 border-t border-gray-100">
          <div className="flex flex-col space-y-3 sm:space-y-4">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-1 text-[#163300]">
              <LockIcon className="w-7 h-7" />
            </div>
            <p className="font-medium text-base sm:text-lg text-gray-800 leading-snug">
              Our dedicated fraud and security teams work to keep your money safe
            </p>
          </div>
          <div className="flex flex-col space-y-3 sm:space-y-4">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-1 text-[#163300]">
              <PhoneLockIcon className="w-7 h-7" />
            </div>
            <p className="font-medium text-base sm:text-lg text-gray-800 leading-snug">
              We use 2-factor authentication to protect your account
            </p>
          </div>
          <div className="flex flex-col space-y-3 sm:space-y-4">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-1 text-[#163300]">
              <BankIcon className="w-7 h-7" />
            </div>
            <p className="font-medium text-base sm:text-lg text-gray-800 leading-snug">
              We hold your money with established financial institutions
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

