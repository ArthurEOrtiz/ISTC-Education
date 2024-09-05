'use client';
import { useState } from 'react';

interface ErrorBoundaryProps {
    error: Error & {digest?: string};
    reset: () => void;   
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ error, reset }) => {
    const [showDetails, setShowDetails] = useState<boolean>(false);

    const toggleDetails = () => {
        setShowDetails(prev => !prev);
    };

    return (
        <div className="w-full flex items-center justify-center">
            <div className="p-4 bg-red-100 border border-red-400 rounded-md w-10/12">
                <div className="flex justify-between items-center border border-error rounded-md p-2">
                    <div className='w-full'>
                        <h1 className="text-2xl font-bold text-red-800">An error has occurred!</h1>
                    </div>
                    <div className="w-full flex justify-end space-x-2">
                        <button
                            onClick={reset}
                            className="btn btn-error text-white"
                        >
                            Reset
                        </button>
                        <button
                            onClick={toggleDetails}
                            className="btn btn-error text-white"
                        >
                            {showDetails ? 'Hide Details' : 'Show Details'}
                        </button>
                    </div>
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
