import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-8xl font-bold text-slate-700 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>
                <p className="text-slate-400 mb-8 max-w-md">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/">
                    <Button>
                        <Home size={18} />
                        Go Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
