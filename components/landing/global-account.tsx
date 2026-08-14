import { Button } from "@/components/ui/button"
import Image from "next/image"

export function GlobalAccount() {
  return (
    <section className="py-16 mb-10 bg-background overflow-hidden">
      <div className="container mx-auto px-4 lg:px-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-9 items-start">
          
          {/* Content Side */}
          <div className="flex flex-col space-y-8 lg:col-span-3">
            <h2 className="text-4xl font-medium tracking-tighter lg:text-5xl text-black leading-[1.1]">
              Manage all your currencies all over the world
            </h2>
            <p className="text-lg text-gray-600 font-medium max-w-[500px] leading-relaxed">
              Save up to 2x when you send, convert and withdraw 50 currencies, all in one account.
            </p>
            <div className="flex flex-wrap gap-4">
                <Button className="rounded-full h-10 px-3 text-(--dark-green) text-base font-medium hover:scale-105 transition-transform">
                Open an account
              </Button>
              <Button variant="outline" className="rounded-full h-10 px-3 text-(--dark-green) text-base font-medium border-1 border-(--dark-green)">
                Compare savings
              </Button>
            </div>
          </div>

          {/* Visual Side */}
          <div className="relative lg:col-span-6 h-60 lg:h-180">
             {/* Background Image Container */}
             <Image
              src="/assets/images/global-account-img.png"
              alt="Global Account Background"
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
