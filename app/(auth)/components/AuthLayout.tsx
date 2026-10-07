"use client";

import RiIcon from "@/app/components/ui/RiIcon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: ReactNode;
  showBackToWebsite?: boolean;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  showBackToWebsite = true,
}: AuthLayoutProps) {
  return (
    <div className="w-full h-dvh bg-rich-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-262.5 h-full bg-[#0a0a0a] rounded-3xl overflow-hidden flex shadow-2xl border border-white/5"
      >
        {/* Left Side - Image/Brand */}
        <div className="hidden lg:flex w-1/2 relative bg-[#0a0a0a] flex-col justify-between p-10 overflow-hidden">
          {/* Background Gradient/Image */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-linear-to-b from-rich-black/50 via-transparent to-rich-black/90"></div>

            {/* Animated Glow */}
            <motion.div
              className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-radial-gradient from-luxury-gold/20 to-transparent blur-3xl opacity-30"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <Image
                src="/logo.png"
                alt="Purefi Bank"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="text-2xl font-bold text-white tracking-wide">
                Purefi
              </span>
            </Link>
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                Capturing Moments,
                <br />
                <span className="text-luxury-gold">Creating Wealth.</span>
              </h2>
              <p className="text-gray-400 text-base max-w-md">
                Join millions of users who trust Purefi for their daily
                financial needs and investment journey.
              </p>
            </motion.div>

            {/* Carousel Indicators (Visual only) */}
            <div className="flex gap-2 mt-6">
              <div className="w-8 h-1 bg-luxury-gold rounded-full"></div>
              <div className="w-2 h-1 bg-white/20 rounded-full"></div>
              <div className="w-2 h-1 bg-white/20 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <ScrollArea className="flex-1 h-full relative z-10">
          <div className="p-5 sm:p-8 lg:p-10 flex flex-col justify-center min-h-full relative">
            {showBackToWebsite && (
              <Link
                href="/"
                className="absolute top-6 right-8 text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                Back to Home <RiIcon className="ri-arrow-right-line" />
              </Link>
            )}

            <div className="w-full mx-auto">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
                <p className="text-gray-400 mb-6 text-sm">{subtitle}</p>

                {children}
              </motion.div>
            </div>
          </div>
        </ScrollArea>
      </motion.div>
    </div>
  );
}
