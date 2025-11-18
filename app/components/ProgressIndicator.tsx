'use client';

import { Loader2 } from 'lucide-react';

interface ProgressIndicatorProps {
  message: string;
}

export default function ProgressIndicator({ message }: ProgressIndicatorProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <div className="flex-1">
          <p className="text-lg font-semibold text-gray-800">{message}</p>
          <div className="w-full bg-blue-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}