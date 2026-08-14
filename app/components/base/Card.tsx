import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from "@/lib/utils";

type CardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
} & HTMLMotionProps<"div">;

export default function Card({
  children,
  className = '',
  hover = false,
  delay,
  ...props
}: CardProps) {
  const hasEntranceAnimation = typeof delay === "number";

  return (
    <motion.div
      initial={hasEntranceAnimation ? { opacity: 0, y: 16 } : undefined}
      animate={hasEntranceAnimation ? { opacity: 1, y: 0 } : undefined}
      transition={hasEntranceAnimation ? { delay, duration: 0.4, ease: "easeOut" } : undefined}
      whileHover={hover ? { scale: 1.01 } : undefined}
      className={cn(
        "bg-white rounded-2xl border border-db-border p-5 transition-colors duration-200",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
