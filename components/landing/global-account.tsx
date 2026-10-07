import { Button } from "@/components/ui/button";
import Image from "next/image";

export function GlobalAccount() {
  return (
    <section className="py-12 sm:py-16 md:py-20 mb-6 sm:mb-10 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-12 items-center">
          {/* Content Side */}
          <div className="flex flex-col space-y-6 sm:space-y-8 lg:col-span-5">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-black leading-[1.15] sm:leading-[1.1]">
              Manage all your currencies all over the world
            </h2>
            <p className="text-base sm:text-lg text-gray-600 font-normal sm:font-medium max-w-lg leading-relaxed">
              Save up to 2x when you send, convert and withdraw 50 currencies,
              all in one account.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Button className="rounded-full h-11 px-6 bg-[#9FE870] hover:bg-[#8ee05c] text-[#163300] text-sm sm:text-base font-semibold hover:scale-105 transition-all w-full sm:w-auto">
                Open an account
              </Button>
              <Button
                variant="outline"
                className="rounded-full h-11 px-6 border-2 border-[#163300] bg-transparent hover:bg-[#163300]/5 text-[#163300] text-sm sm:text-base font-semibold transition-all w-full sm:w-auto"
              >
                Compare savings
              </Button>
            </div>
          </div>

          {/* Visual Side */}
          <div className="relative lg:col-span-7 w-full max-w-md sm:max-w-lg lg:max-w-none mx-auto aspect-[907/1029]">
            <Image
              src="/assets/images/global-account-img.png"
              alt="Global Account Interface"
              fill
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
