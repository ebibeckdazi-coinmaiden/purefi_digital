import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { ScrollArea } from './scroll-area';
import RiIcon from './RiIcon';

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children?: ReactNode;
    actions?: ReactNode;
    type?: 'info' | 'success' | 'warning' | 'error';
    maxWidth?: string;
}

export default function Dialog({ 
    isOpen, 
    onClose, 
    title, 
    description, 
    children, 
    actions,
    type = 'info',
    maxWidth = 'max-w-md'
}: DialogProps) {
    
    const getIcon = () => {
        switch(type) {
            case 'success': return 'ri-checkbox-circle-fill text-[#00D18F]'; // Vibrant Green
            case 'warning': return 'ri-alert-fill text-[#FFB020]'; // Amber
            case 'error': return 'ri-error-warning-fill text-[#FF4B4B]'; // Red
            default: return 'ri-information-fill text-luxury-gold'; // Gold
        }
    };

    const getGradient = () => {
        switch(type) {
            case 'success': return 'from-[#00D18F]/20 to-transparent';
            case 'warning': return 'from-[#FFB020]/20 to-transparent';
            case 'error': return 'from-[#FF4B4B]/20 to-transparent';
            default: return 'from-luxury-gold/20 to-transparent';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:items-center">
                    {/* Backdrop with heavy blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className={`relative w-full ${maxWidth} bg-[#121212] border border-white/10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] overflow-hidden`}
                    >
                        {/* Ambient Glow based on type */}
                        <div className={`absolute top-0 inset-x-0 h-32 bg-linear-to-b ${getGradient()} opacity-50 blur-2xl pointer-events-none`} />

                        {/* Close Button */}
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all z-20 group"
                        >
                            <RiIcon className="ri-close-line text-xl group-hover:rotate-90 transition-transform duration-300" />
                        </button>

                        {/* Header Section - Fixed */}
                        <div className="relative px-8 pt-8 pb-2 shrink-0 z-10">
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-4 relative">
                                    <div className={`absolute inset-0 rounded-full blur-xl opacity-20 ${type === 'info' ? 'bg-luxury-gold' : type === 'success' ? 'bg-[#00D18F]' : type === 'error' ? 'bg-[#FF4B4B]' : 'bg-[#FFB020]'}`}></div>
                                    <div className="relative w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                                        <RiIcon className={`${getIcon()} text-3xl drop-shadow-lg`} />
                                    </div>
                                </div>
                                
                                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{title}</h3>
                                {description && (
                                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                                        {description}
                                    </p>
                                )}
                            </div>
                        </div>
                        
                        {/* Body Content - Scrollable */}
                        <div className="relative z-10">
                            <ScrollArea className="h-80 w-full max-h-[min(20rem,45dvh)]">
                                <div className="px-6 py-2">
                                    {children}
                                </div>
                            </ScrollArea>
                        </div>
                        
                        {/* Actions Footer - Fixed */}
                        {actions ? (
                            <div className="relative px-8 pb-8 pt-4 shrink-0 z-10">
                                <div className="pt-6 border-t border-white/5 flex justify-end gap-3">
                                    {actions}
                                </div>
                            </div>
                        ) : (
                            <div className="pb-8 shrink-0" />
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
