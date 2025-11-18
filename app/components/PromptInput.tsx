'use client';

import { Wand2, Loader2, Sparkles } from 'lucide-react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onRefine: () => void;
  refining: boolean;
  disabled: boolean;
}

export default function PromptInput({
  prompt,
  setPrompt,
  onRefine,
  refining,
  disabled
}: PromptInputProps) {
  return (
    <div className="bg-white rounded-xl shadow-xl p-4 backdrop-blur-sm bg-opacity-95 space-y-4 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Your Creative Prompt</h2>
      </div>
      
      <div className="space-y-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to create... (e.g., A fox in a nursery)"
          className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 bg-white resize-none text-sm"
          rows={2}
        />
        
        <button
          onClick={onRefine}
          disabled={refining || disabled}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-2 px-2 rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed w-full flex items-center justify-center gap-3 text-lg"
        >
          {refining ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Refining with AI Magic...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              Refine Prompt with AI
            </>
          )}
        </button>
      </div>
    </div>
  );
}