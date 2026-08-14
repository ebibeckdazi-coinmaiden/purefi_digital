import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AltArrowDown } from "@solar-icons/react-perf/BoldDuotone"
import { HamburgerMenu } from "@solar-icons/react-perf/BoldDuotone"

export function Navbar() {
  return (
    <header className="top-0 z-50 w-full bg-background text-green-text">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4 lg:px-12">
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-1 transition-opacity hover:opacity-90">
            <span className="text-3xl font-extrabold italic leading-none tracking-tight">PureFi</span>
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            <Link
              href="#"
              className="inline-flex h-9 items-center text-lg font-semibold text-forest-green transition-opacity hover:opacity-90"
            >
              Personal
            </Link>
            <Link
              href="#"
              className="inline-flex h-9 items-center text-lg font-semibold transition-colors text-forest-green"
            >
              Platform
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-3 md:flex">
            <Link href="#" className="inline-flex items-center gap-1 text-lg font-semibold text-forest-green transition-colors hover:text-primary">
              Features
              <AltArrowDown size={14} />
            </Link>
            <Link href="#" className="text-lg font-semibold text-forest-green transition-colors hover:text-primary">
              help
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-lg font-semibold text-forest-green transition-colors hover:text-primary"
            >
              <span className="h-5 w-5 rounded-full bg-muted" />
              EN
              <AltArrowDown size={12} />
            </button>
            <Link href="/auth/sign-up" className="text-lg font-semibold text-forest-green transition-colors hover:text-primary">
              Register
            </Link>
            <Button
              asChild
              className="h-9 rounded-full bg-primary px-6 font-semibold text-lg text-forest-green transition-opacity hover:opacity-90"
            >
              <Link href="/auth/sign-in">Log in</Link>
            </Button>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Toggle menu">
            <HamburgerMenu size={20} />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
    </header>
  )
}


