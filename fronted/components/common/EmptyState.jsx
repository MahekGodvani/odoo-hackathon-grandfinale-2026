import React from 'react';
import { FolderOpen } from 'lucide-react';

/**
 * PEOPLEPAY360 - EMPTY STATE COMPONENT
 */
const EmptyState = ({ title = 'No items found', description = 'There are no records to display at the moment.', action }) => {
  return (
    <div className="text-center py-12 px-4 bg-white rounded-xl border border-slate-200 shadow-xs">
      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
        <FolderOpen className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mx-auto mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
