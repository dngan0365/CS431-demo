import { Settings } from 'lucide-react';
import Link from 'next/link';

interface ConfigPanelProps {
  backendUrl: string;
  setBackendUrl: (url: string) => void;
}

export default function ConfigPanel({
  backendUrl,
  setBackendUrl
}: ConfigPanelProps) {
  return (
    <div className="bg-white rounded-xl shadow-xl p-4 backdrop-blur-sm bg-opacity-95 space-y-4 animate-fadeIn">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
          <Settings className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-lg font-bold text-gray-800 tracking-tight">
          Configuration
        </h2>
      </div>

      {/* Responsive Grid: Input on LEFT */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-2">

        {/* Left side (input) */}
        <div className="space-y-2 order-1">
          <label className="block text-sm font-semibold text-gray-700">
            Backend URL
          </label>

          <input
            type="text"
            value={backendUrl}
            onChange={(e) => setBackendUrl(e.target.value)}
            placeholder="http://localhost:8000"
            className="
              w-full px-2 py-2 rounded-lg border border-gray-300 
              bg-gray-50 text-gray-800 placeholder-gray-400
              focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-200 
              transition-all
            "
          />

          <p className="text-xs text-gray-500">
            Enter the URL of your FastAPI server.
          </p>
        </div>

      </div>
    </div>
  );
}
