import { useStore } from '../../store/appStore';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
    const { toasts, removeToast } = useStore();

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    {...toast}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}

interface ToastProps {
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
    onClose: () => void;
}

function Toast({ type, message, onClose }: ToastProps) {
    const icons = {
        success: <CheckCircle className="text-green-400" size={20} />,
        error: <XCircle className="text-red-400" size={20} />,
        info: <Info className="text-blue-400" size={20} />,
    };

    const backgrounds = {
        success: 'bg-green-500/10 border-green-500/30',
        error: 'bg-red-500/10 border-red-500/30',
        info: 'bg-blue-500/10 border-blue-500/30',
    };

    return (
        <div
            className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border
        backdrop-blur-sm shadow-xl
        animate-slide-up
        ${backgrounds[type]}
      `}
            role="alert"
        >
            {icons[type]}
            <p className="flex-1 text-sm text-white">{message}</p>
            <button
                onClick={onClose}
                className="p-1 rounded hover:bg-white/10 transition-colors"
                aria-label="Dismiss"
            >
                <X size={16} className="text-slate-400" />
            </button>
        </div>
    );
}
