import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * PEOPLEPAY360 - LOADING SPINNER COMPONENT
 */
const LoadingSpinner = ({ label = 'Loading data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-400">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
};

export default LoadingSpinner;
