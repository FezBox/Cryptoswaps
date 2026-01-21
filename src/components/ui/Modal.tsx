import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose?: () => void;
    title?: string;
    showCloseButton?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    children: React.ReactNode;
}

export function Modal({
    isOpen,
    onClose,
    title,
    showCloseButton = true,
    size = 'md',
    children,
}: ModalProps) {
    // Handle escape key
    useEffect(() => {
        function handleEscape(e: KeyboardEvent) {
            if (e.key === 'Escape' && onClose) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal content */}
            <div
                className={`
          relative w-full ${sizes[size]}
          bg-slate-800 rounded-2xl shadow-2xl border border-slate-700
          animate-scale-in
          max-h-[90vh] overflow-hidden flex flex-col
        `}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'modal-title' : undefined}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-4 border-b border-slate-700">
                        {title && (
                            <h2 id="modal-title" className="text-lg font-semibold text-white">
                                {title}
                            </h2>
                        )}
                        {showCloseButton && onClose && (
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
