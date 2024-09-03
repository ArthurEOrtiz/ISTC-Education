'use client';
import { useState, useEffect } from 'react';

const ErrorBoundary: React.FC<{ error: Error }> = ({ error }) => {
    const [showDetails, setShowDetails] = useState<boolean>(false);

    useEffect(() => {
        setShowDetails(true);
    }, [error]);

    const toggleDetails = () => {
        setShowDetails(prev => !prev);
    };

    return (
        <div className="w-full flex items-center justify-center">
            <div className="p-4 bg-red-100 border border-red-400 rounded-md w-10/12">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-red-800">An error occurred</h1>
                    <button
                        onClick={toggleDetails}
                        className="text-red-500 focus:outline-none"
                    >
                        {showDetails ? 'Hide Details' : 'Show Details'}
                    </button>
                </div>
                {showDetails && (
                    <div className="mt-4">
                        <p className="text-red-600">{error.message}</p>
                        <pre className="mt-2 overflow-x-auto text-sm text-red-800">{error.stack}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ErrorBoundary;
