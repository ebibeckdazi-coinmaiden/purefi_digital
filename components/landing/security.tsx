
import { Button } from "@/components/ui/button"
import Image from "next/image"
import LockIcon from "@/app/components/ui/icons/Lock"
import PhoneLockIcon from "@/app/components/ui/icons/PhoneLock"
import BankIcon from "@/app/components/ui/icons/Bank"

export function Security() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white text-black overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="max-w-xl">
            <h2 className="text-4xl font-[550] tracking-tight sm:text-5xl md:text-6xl mb-6">
              Disappoint thieves
            </h2>
            <p className="text-base font-medium w-sm text-gray-600 mb-8 leading-relaxed">
              Every month, our customers trust us to move over £10 billion of their money. Here are some of the important ways we protect them.
            </p>
            <Button className="rounded-full bg-[#9FE870] text-sm text-(--dark-green) hover:bg-[#8CD760] h-12 px-6 font-normal">
              How we keep your money safe
            </Button>
          </div>
          
          <div className="flex justify-center lg:justify-start relative">
             <div className="relative w-full max-w-md aspect-square lg:w-100 lg:h-100 ">
              <Image src="/assets/images/lock.png" alt="Security" 
              width={640}
              height={440}
              className="w-full h-full object-cover" />
             </div>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-start md:space-x-10 space-y-10 md:space-y-0">
            <div className="space-y-4">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                   <LockIcon className="w-7 h-7" />
                </div>
                <p className="font-medium text-base text-gray-700 leading-snug w-full max-w-60">
                    Our dedicated fraud and security teams work to keep your money safe
                </p>
            </div>
            <div className="space-y-4">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                   <PhoneLockIcon className="w-7 h-7" />
                </div>
                <p className="font-medium text-base text-gray-700 leading-snug w-full max-w-50">
                    We use 2-factor authentication to protect your account
                </p>
            </div>
            <div className="space-y-4">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                   <BankIcon className="w-7 h-7" />
                </div>
                <p className="font-medium text-base text-gray-700 leading-snug w-full max-w-50">
                    We hold your money with established financial institutions
                </p>
            </div>
        </div>
      </div>
    </section>
  )
}
