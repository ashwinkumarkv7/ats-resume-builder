import { FileText } from 'lucide-react';
import Button from './Button';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                            ATSResume
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard">
                            <Button variant="ghost" className="hidden sm:inline-flex">Dashboard</Button>
                        </Link>
                        <Link to="/dashboard">
                            <Button variant="primary">Build Resume Free</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
