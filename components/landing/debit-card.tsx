import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { KeyMinimalistic2, LockKeyholeMinimalisticUnlocked } from '@solar-icons/react-perf/Linear'

export function DebitCard() {
    return (
        <section className="py-12 sm:py-16 md:py-20 bg-white overflow-hidden">
            {/* 1. Main Visual & Content */}
            <div className="flex flex-col items-start text-start space-y-4 max-w-5xl mx-auto">
                {/* Image/Visual - Person putting card in pocket */}
                <div className="relative w-full aspect-1536/1011 max-w-4xl mx-auto px-4 sm:px-6">
                    <Image
                        src="/assets/images/pocket-card-img.png"
                        alt="PureFi Debit Card in pocket"
                        fill
                        className="object-contain w-full h-full"
                    />
                </div>

                {/* Text Content */}
                <div className="max-w-xl space-y-6 text-left px-4 sm:px-8 lg:px-12">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-black leading-[1.15] sm:leading-[1.1]">
                        The card that&apos;s always got the right currency
                    </h2>
                    <p className="text-base sm:text-lg text-gray-700 font-normal max-w-md leading-relaxed">
                        Save as you spend and withdraw over 50 currencies at the live rate automatically.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                        <Button className="rounded-full h-11 px-6 bg-[#9FE870] hover:bg-[#8ee05c] text-db-text-primary text-sm sm:text-base font-semibold hover:scale-105 transition-all w-full sm:w-auto">
                            Order your card
                        </Button>
                        <Button variant="outline" className="rounded-full h-11 px-6 border-2 border-db-text-primary bg-transparent hover:bg-db-text-primary/5 text-db-text-primary text-sm sm:text-base font-semibold transition-all w-full sm:w-auto">
                            Learn more
                        </Button>
                    </div>
                </div>
            </div>

            {/* 2. Scrolling Flags Section (Bottom) */}
            <div className="mt-12 lg:mt-16 overflow-hidden">
                <div className="flex items-center gap-3 sm:gap-6">
                    {/* Green arrow pill banner on left */}
                    <div className="bg-[#9FE870] rounded-r-full w-1/2 py-2.5 px-4 sm:py-4 flex items-center justify-end shrink-0">
                        <div className="rounded-full bg-db-text-primary p-2.5 sm:p-4 text-[#9FE870] flex items-center justify-center shadow-xs">
                            <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8" />
                        </div>
                    </div>
                    {/* Flags */}
                    <div className="flex items-center gap-3 sm:gap-6 shrink-0 overflow-x-auto no-scrollbar pr-4">
                        <Image
                            src="/assets/images/euro.png"
                            alt="Euro"
                            width={80}
                            height={80}
                            className="w-12 h-12 lg:w-30 lg:h-30 object-contain rounded-full shadow-xs"
                        />
                        <Image
                            src="/assets/images/india.png"
                            alt="Indian Rupee"
                            width={80}
                            height={80}
                            className="w-12 h-12 lg:w-30 lg:h-30 object-contain rounded-full shadow-xs"
                        />
                        <Image
                            src="/assets/images/usa.png"
                            alt="US Dollar"
                            width={80}
                            height={80}
                            className="w-12 h-12 lg:w-30 lg:h-30 object-contain rounded-full shadow-xs rotate-180"
                        />
                    </div>
                </div>
            </div>

            {/* 3. Footer/Trust Badges */}
            <div className="mt-12 sm:mt-16 border-t border-gray-200 pt-10 sm:pt-12 px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row justify-start gap-6 sm:gap-8 text-sm text-gray-500 max-w-4xl mx-auto">
                <div className="flex gap-4 items-start max-w-md">
                    <div className="p-2.5 bg-gray-100 rounded-full shrink-0">
                        <LockKeyholeMinimalisticUnlocked size={20} className="text-db-text-primary" />
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">We&apos;re registered with the Financial Crimes Enforcement Network (FinCEN) in the US.</p>
                </div>
                <div className="flex gap-4 items-start max-w-md">
                    <div className="p-2.5 bg-gray-100 rounded-full shrink-0">
                        <KeyMinimalistic2 size={20} className="-rotate-130 text-db-text-primary" />
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">We protect your details through <span className="underline cursor-pointer font-semibold">strict standards</span>.</p>
                </div>
            </div>
        </section>
    )
}

