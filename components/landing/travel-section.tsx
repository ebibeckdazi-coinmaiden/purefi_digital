"use client"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { ArrowLeft, ArrowRight } from "@solar-icons/react-perf/Linear"
import type { CarouselApi } from "@/components/ui/carousel"
import { JSX, useState } from "react"

type StoryCard = {
  flag: string
  quote: string
  cta: string
  surface: "primary" | "secondary"
  text: "foreground" | "secondary-foreground"
}

const storyCards: StoryCard[] = [
  {
    flag: "🌍",
    quote:
      "“PureFi has changed the game in terms of simplicity, and certainly been a lifesaver for expat living.”",
    cta: "Watch video",
    surface: "primary",
    text: "foreground",
  },
  {
    flag: "🇬🇧",
    quote:
      "“I use PureFi for my mortgage payments in the UK every month. It is fast, easy and much cheaper.”",
    cta: "Gerald on Trustpilot",
    surface: "secondary",
    text: "secondary-foreground",
  },
]

export function TravelSection(): JSX.Element {
  const [api, setApi] = useState<CarouselApi>()

  return (
    <section className="w-full overflow-hidden bg-white py-12 sm:py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-center gap-y-8 sm:gap-y-12 gap-x-8">
        <div className="lg:col-span-6 flex flex-col items-start lg:items-end px-4 sm:px-8 lg:px-12">
          <div className="w-full max-w-xl flex flex-col items-start">
            <h2 className="font-black uppercase tracking-tight sm:tracking-tighter text-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] sm:leading-[0.9]">
              For people
              <br />
              going places
            </h2>
            <div className="flex items-center gap-4 mt-6 sm:mt-10">
              <button
                type="button"
                aria-label="Previous story"
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 flex items-center justify-center text-gray-700 transition-all cursor-pointer"
                onClick={() => api?.scrollPrev()}
              >
                <ArrowLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
              <button
                type="button"
                aria-label="Next story"
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 flex items-center justify-center text-gray-700 transition-all cursor-pointer"
                onClick={() => api?.scrollNext()}
              >
                <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </div>
          </div>
        </div>
        <div className="lg:col-span-6 pl-4 sm:pl-8 lg:pl-0">
          <Carousel
            setApi={setApi}
            opts={{ align: "start", loop: true }}
          >
            <CarouselContent>
              {storyCards.map((story) => (
                <CarouselItem key={story.cta} className="basis-[85%] sm:basis-[70%] lg:basis-[80%] pl-4">
                  <article
                    className={`flex min-h-90 sm:min-h-105 lg:h-125 flex-col justify-between rounded-3xl sm:rounded-4xl p-6 sm:p-8 transition-transform ${
                      story.surface === "primary"
                        ? "bg-[#9FE870] text-db-text-primary"
                        : "bg-db-text-primary text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-14 w-14 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-white/90 shadow-xs text-2xl sm:text-4xl">
                        {story.flag}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold opacity-75 uppercase tracking-wider">
                        Customer Story
                      </span>
                    </div>

                    <p className="my-6 text-xl sm:text-2xl lg:text-3xl font-black leading-snug tracking-tight">
                      {story.quote}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-current/10">
                      <span className="text-sm sm:text-base font-semibold underline underline-offset-4 cursor-pointer hover:opacity-80">
                        {story.cta} →
                      </span>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  )
}

