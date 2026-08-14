import { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import RiIcon from '@/app/components/ui/RiIcon';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'min-h-11 font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap inline-flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-green disabled:cursor-not-allowed disabled:opacity-60';
  
  const variants = {
    primary: 'bg-db-primary hover:bg-db-primary-hover text-db-text-primary shadow-sm',
    secondary: 'bg-db-text-primary hover:bg-forest-green/90 text-white',
    outline: 'border border-db-border bg-white text-db-text-primary hover:bg-db-hover',
    ghost: 'text-db-text-secondary hover:text-db-text-primary hover:bg-db-hover',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && <RiIcon className={icon} />}
      {children}
    </motion.button>
  );
}
