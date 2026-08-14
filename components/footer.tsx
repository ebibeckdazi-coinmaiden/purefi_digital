import Link from "next/link"
import { Facebook, Twitter, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted pt-24 pb-12 text-gray-500">
      <div className="container mx-auto px-4 lg:px-24 items-center">
        {/* Top Section - 4 Columns */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 mb-16">
          
          {/* Column 1 */}
          <div className="pl-10">
            <h3 className="mb-6 text-[13px] font-bold text-gray-700">Company and team</h3>
            <ul className="space-y-3 text-[14px] text-gray-500 font-medium">
              <li><Link href="#" className="hover:text-gray-600 underline decoration-gray-600/30 underline-offset-4">Company and team</Link></li>
              <li><Link href="#" className="hover:text-gray-600 underline decoration-gray-600/30 underline-offset-4">Press</Link></li>
              <li><Link href="#" className="hover:text-gray-600 underline decoration-gray-600/30 underline-offset-4">Careers</Link></li>
              <li><Link href="#" className="hover:text-gray-600 underline decoration-gray-600/30 underline-offset-4">Service status</Link></li>
              <li><Link href="#" className="hover:text-gray-600 underline decoration-gray-600/30 underline-offset-4">Investor relations</Link></li>
              <li><Link href="#" className="hover:text-gray-600 underline decoration-gray-600/30 underline-offset-4">Mission roadmap</Link></li>
              <li><Link href="#" className="hover:text-gray-600 underline decoration-gray-600/30 underline-offset-4">Affiliates and partnerships</Link></li>
              <li><Link href="#" className="hover:text-gray-600 underline decoration-gray-600/30 underline-offset-4">Help centre</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="pl-10">
            <h3 className="mb-6 text-[13px] font-bold text-gray-700">Wise Products</h3>
            <ul className="space-y-3 text-[14px] text-gray-500 font-medium">
              <li><Link href="#" className="hover:text-gray-600 underline decoration-gray-600/30 underline-offset-4">International money transfer</Link></li>
              <li><Link href="#" className="hover:text-gray-600 underline decoration-gray-600/30 underline-offset-4">Wise account</Link></li>
              <li><Link href="#" className="hover:text-gray-600 underline decoration-gray-600/30 underline-offset-4">International debit card</Link></li>
              <li><Link href="#" className="hover:text-gray-600 underline decoration-gray-600/30 underline-offset-4">Travel money card</Link></li>
              <li><Link href="#" className="hover:text-gray-600 underline decoration-gray-600/30 underline-offset-4">Large amount transfer</Link></li>
              <li><Link href="#" className="hover:text-gray-600 underline decoration-gray-600/30 underline-offset-4">Receive money</Link></li>
              <li><Link href="#" className="hover:text-gray-600 underline decoration-gray-600/30 underline-offset-4">Wise Platform</Link></li>
              <li><Link href="#" className="hover:text-gray-600 underline decoration-gray-600/30 underline-offset-4">Wise Business</Link></li>
              <li><Link href="#" className="hover:text-gray-600 underline decoration-gray-600/30 underline-offset-4">Business debit card</Link></li>
              <li><Link href="#" className="hover:text-gray-600 underline decoration-gray-600/30 underline-offset-4">Mass payments</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="pl-10">
            <h3 className="mb-6 text-[13px] font-bold text-gray-700">Resources</h3>
            <ul className="space-y-3 text-[14px] text-gray-500 font-medium">
              <li><Link href="#" className="hover:text-gray-600 underline decoration-gray-600/30 underline-offset-4">News and blog</Link></li>
              <li><Link href="#" className="hover:text-gray-600 underline decoration-gray-600/30 underline-offset-4">Currency converter</Link></li>
              <li><Link href="#" className="hover:text-gray-600 underline decoration-gray-600/30 underline-offset-4">Swift/BIC codes</Link></li>
              <li><Link href="#" className="hover:text-gray-600 underline decoration-gray-600/30 underline-offset-4">IBAN codes</Link></li>
              <li><Link href="#" className="hover:text-gray-600 underline decoration-gray-600/30 underline-offset-4">Rate alerts</Link></li>
              <li><Link href="#" className="hover:text-gray-600 underline decoration-gray-600/30 underline-offset-4">Compare exchange rates</Link></li>
              <li><Link href="#" className="hover:text-gray-600 underline decoration-gray-600/30 underline-offset-4">Invoice generator</Link></li>
              <li><Link href="#" className="hover:text-gray-600 underline decoration-gray-600/30 underline-offset-4">Business Calculators</Link></li>
            </ul>
          </div>

          {/* Column 4 (Social) */}
          <div className="pl-10">
            <h3 className="mb-6 text-[13px] font-bold text-gray-700">Follow us</h3>
            <div className="flex gap-4 text-gray-600/80">
                <Link href="#" className="hover:text-gray-600 transition-colors"><Facebook className="w-5 h-5 text-gray-600" /></Link>
                <Link href="#" className="hover:text-gray-600 transition-colors"><Twitter className="w-5 h-5 text-gray-600" /></Link>
                <Link href="#" className="hover:text-gray-600 transition-colors"><Instagram className="w-5 h-5 text-gray-600" /></Link>
            </div>
          </div>
        </div>

        {/* Middle Section - Logo & Legal Links */}
        <div className="border-t border-gray-200/10 pt-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-32 px-10">
                <Link href="/" className="flex items-center justify-between gap-0.5 text-gray-600 hover:opacity-90 transition-opacity">
                    {/* <span className="text-xl font-black italic leading-none">7</span> */}
                    <span className="text-2xl font-black italic leading-none tracking-tight text-(--dark-green)">PureFi</span>
                </Link>
                
                <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-x-12 gap-y-4 text-[14px] text-gray-600 font-bold px-20">
                    <div className="flex flex-col gap-4 place-self-end">
                        <Link href="#" className="underline decoration-gray-600/30 underline-offset-4">Legal</Link>
                        <Link href="#" className="underline decoration-gray-600/30 underline-offset-4">Country site map</Link>
                    </div>
                    <div className="flex flex-col gap-4 place-self-end">
                        <Link href="#" className="underline decoration-gray-600/30 underline-offset-4">Privacy policy</Link>
                        <Link href="#" className="underline decoration-gray-600/30 underline-offset-4">Modern slavery statement</Link>
                    </div>
                    <div className="flex flex-col gap-4 place-self-end">
                        <Link href="#" className="underline decoration-gray-600/30 underline-offset-4">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </div>

        {/* Bottom Section - Copyright & Disclaimer */}
        <div className="flex flex-col items-center text-center gap-4 pt-8">
          <p className="text-[13px] font-bold text-gray-600/70">
            © PUREFI US Inc 2023
          </p>
          <p className="text-[13px] text-gray-600/70 max-w-3xl leading-relaxed font-medium">
            PuerFi US Inc is authorized to operate in <Link href="#" className="underline decoration-gray-600/30 underline-offset-4">most states</Link>. In the other states, the program is sponsored by Community Federal Savings Bank, to which we&apos;re a service provider.
          </p>
        </div>

      </div>
    </footer>
  )
}
