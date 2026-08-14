import { ArrowRight, Globe, CreditCard, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Features() {
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="flex flex-col space-y-4">
            <div className="p-3 w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mb-2">
                <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">Send money cheaper and easier</h3>
            <p className="text-muted-foreground leading-relaxed">
              Send money at the real exchange rate with no hidden fees. We&apos;re on average 8x cheaper than leading banks.
            </p>
            <Button variant="link" className="p-0 h-auto justify-start font-semibold text-primary hover:text-primary/80">
                Send money <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col space-y-4">
             <div className="p-3 w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mb-2">
                <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">Spend abroad like a local</h3>
            <p className="text-muted-foreground leading-relaxed">
              Get a debit card that auto-converts your money at the best price. Spend in over 50 currencies.
            </p>
             <Button variant="link" className="p-0 h-auto justify-start font-semibold text-primary hover:text-primary/80">
                Get the card <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col space-y-4">
             <div className="p-3 w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mb-2">
                <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">Receive payments like a pro</h3>
            <p className="text-muted-foreground leading-relaxed">
              Get account details for the UK, US, Eurozone, Australia and more. Receive money for free.
            </p>
             <Button variant="link" className="p-0 h-auto justify-start font-semibold text-primary hover:text-primary/80">
                See account details <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
