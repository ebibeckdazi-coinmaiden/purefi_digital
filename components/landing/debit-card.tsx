import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { KeyMinimalistic2, LockKeyholeMinimalisticUnlocked } from '@solar-icons/react-perf/Linear'

export function DebitCard() {
    return (
        <section className="py-16 bg-white overflow-hidden">
            {/* 1. Main Visual & Content */}
            <div className="flex flex-col items-start text-start space-y-2 max-w-5xl mx-auto">
                {/* Image/Visual - Person putting card in pocket */}
                <div className="relative w-full h-170">
                    <Image
                        src="/assets/images/pocket-card-img.png"
                        alt="pocket-card-img"
                        layout="fill"
                        objectFit="contain"
                        className="w-full h-full"
                    />
                </div>

                {/* Text Content */}
                <div className="max-w-sm space-y-6 text-left px-4 sm:px-12">
                    <h2 className="text-4xl font-medium tracking-tighter lg:text-5xl text-black leading-[1.1]">
                        The card that&apos;s always got the right currency
                    </h2>
                    <p className="text-lg text-gray-700 font-normal max-w-xs leading-relaxed">
                        Save as you spend and withdraw over 50 currencies at the live rate automatically.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Button className="rounded-full h-10 px-3 text-(--dark-green) text-base font-medium hover:scale-105 transition-transform">
                            Order your card
                        </Button>
                        <Button variant="outline" className="rounded-full h-10 px-3 text-(--dark-green) text-base font-medium border-1 border-(--dark-green)">
                            Learn more
                        </Button>
                    </div>
                </div>
            </div>
            {/* 2. Scrolling Flags Section (Bottom) */}
            <div className="mt-20">
                {/* Green fade/cta circle on left */}
                <div className="grid grid-cols-1 sm:grid-cols-5">
                    <div className="w-full p-2 sm:col-span-3 bg-[#9FE870] rounded-r-full flex items-center justify-end">
                        <div className="rounded-full bg-[#163300] flex items-center text-[#9FE870]">
                            <ArrowRight className="w-24 h-24 sm:w-38 sm:h-38" />
                        </div>
                    </div>
                    {/* Flags */}
                    <div className="sm:col-span-2 mt-2 sm:mt-0">
                        <div className="w-full flex justify-between sm:pl-3">
                            <Image
                                src="/assets/images/euro.png"
                                alt="flags"
                                width={100}
                                height={100}
                                className="w-24 h-24 sm:w-38 sm:h-38"
                            />
                            <Image
                                src="/assets/images/india.png"
                                alt="flags"
                                width={100}
                                height={100}
                                className="w-24 h-24 sm:w-38 sm:h-38"
                            />
                            <Image
                                src="/assets/images/usa.png"
                                alt="flags"
                                width={100}
                                height={100}
                                className="w-24 h-24 sm:w-37 sm:h-37 rotate-180"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Footer/Trust Badges */}
            <div className="mt-16 border-t border-gray-200 pt-12 flex flex-col md:flex-row justify-start gap-8 text-sm text-gray-500 max-w-4xl mx-auto">
                <div className="flex gap-4 items-start">
                    <div className="p-2 bg-gray-100 rounded-full">
                        <LockKeyholeMinimalisticUnlocked size={20} />
                    </div>
                    <p className="w-59 text-gray-700">We&apos;re registered with the Financial Crimes Enforcement Network (FinCEN) in the US.</p>
                </div>
                <div className="flex gap-4 items-start">
                    <div className="p-2 bg-gray-100 rounded-full">
                        <KeyMinimalistic2 size={20} className="-rotate-130" />
                    </div>
                    <p className="w-59 text-gray-700">We protect your details through <span className="underline cursor-pointer font-semibold">strict standards</span>.</p>
                </div>
            </div>
        </section>
    )
}
