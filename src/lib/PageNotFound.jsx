import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';


export default function PageNotFound({}) {
    const location = useLocation();
    const pageName = location.pathname.substring(1);
    
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0a]">
            <div className="max-w-md w-full">
                <div className="text-center space-y-6">
                    {/* 404 Error Code */}
                    <div className="space-y-2 bg-[#0a0a0a]/90 backdrop-blur-md">
                        <h1 className="text-7xl font-light text-[#00ff41]">404</h1>
                        <div className="h-0.5 w-16 bg-[#00ff41] mx-auto"></div>
                    </div>
                    
                    {/* Main Message */}
                    <div className="space-y-3">
                        <h2 className="text-2xl font-medium text-[#e0e0e0]">
                            Page Not Found
                        </h2>
                        <p className="text-[#b0b0b0] leading-relaxed">
                            The page <span className="font-medium text-[#e0e0e0]">"{pageName}"</span> could not be found.
                        </p>
                    </div>
                    
                    {/* Action Button */}
                    <div className="pt-6">
                        <button 
                            onClick={() => window.location.href = '/'} 
                            className="text-xs px-4 py-2 bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/20 rounded hover:bg-[#00ff41]/20 transition-all inline-flex items-center gap-2"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}