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
    <section className="w-full overflow-hidden bg-white py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-center justify-end gap-x-5 gap-y-12">
        <div className="lg:col-span-7 place-items-end">
          <div className="w-fit flex flex-col items-start ">
            <h2 className="max-w-xl font-extrabold uppercase tracking-tighter text-black text-5xl sm:text-6xl lg:text-7xl">
              For people
              <br />
              going places
            </h2>
            <div className="w-full mt-12 flex items-center gap-5">
              <button
                className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-600"
                onClick={() => api?.scrollPrev()}
              >
                <ArrowLeft className="w-11 h-11" />
              </button>
              <button
                className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-600"
                onClick={() => api?.scrollNext()}
              >
                <ArrowRight className="w-11 h-11" />
              </button>
            </div>
          </div>
        </div>
        <div className="lg:col-span-5">
          <Carousel
            setApi={setApi}
            opts={{ align: "start", loop: true }}
          >
            <CarouselContent>
              {storyCards.map((story) => (
                <CarouselItem key={story.cta} className="basis-3/4">
                  <article
                    className={`flex h-150 flex-col justify-between rounded-4xl p-8 ${story.surface === "primary"
                      ? "bg-[#9FE870] text-foreground"
                      : "bg-(--dark-green) text-secondary-foreground"
                      }`}
                  >
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-background text-5xl">
                      {story.flag}
                    </div>
                    <p
                      className={`mt-8 text-4xl font-black leading-[1.1] ${story.text === "foreground"
                        ? "text-foreground"
                        : "text-secondary-foreground"
                        }`}
                    >
                      {story.quote}
                    </p>
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
