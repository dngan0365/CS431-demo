'use client';

import { ImageIcon, Loader2, Check, Zap } from 'lucide-react';
import { RefinedPromptData } from '../types';

interface RefinedPromptsProps {
  refinedData: RefinedPromptData;
  explanation: string;
  onGenerate: () => void;
  generating: boolean;
  onUpdatePrompt: (index: number, newText: string) => void;
  onUpdateStep: (index: number, newStep: number) => void;  
  onAddPrompt: (newText: string, newStep: number) => void;
}

export default function RefinedPrompts({
  refinedData,
  explanation,
  onGenerate,
  generating, 
  onUpdatePrompt,
  onUpdateStep,
  onAddPrompt,
}: RefinedPromptsProps) {
  const handleAddPrompt = () => {
    // Calculate the next step value
    const lastStep = refinedData.switch_prompts_steps.length > 0
      ? refinedData.switch_prompts_steps[refinedData.switch_prompts_steps.length - 1]
      : 1;
    
    const nextStep = lastStep + 1;
    
    // Call the parent handler with empty string and calculated step
    onAddPrompt("", nextStep);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-4 backdrop-blur-sm bg-opacity-95 space-y-4 animate-fadeIn">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
          <Check className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Refined Prompts</h2>
      </div>
      
      {explanation && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-2 mb-6">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">AI Strategy: There are 50 steps to denoise:</p>
              <p className="text-sm text-blue-800">{explanation}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2 mb-4">
        {refinedData.prompts_list.map((p, idx) => (
            <div key={idx} className="flex items-start gap-4 group">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center font-bold text-white shadow-md">
                {idx + 1}
              </div>

              <div className="flex-1 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-2 border-2 border-blue-100">
                
                {/* prompt text */}
                <textarea
                  value={p}
                  aria-label='proxy-prompt'
                  onChange={(e) => onUpdatePrompt(idx, e.target.value)}
                  rows={1}
                  className="w-full bg-transparent resize-none outline-none text-sm text-gray-800 leading-relaxed"
                />

                {/* step editor — only for all but the last prompt */}
                {idx < refinedData.switch_prompts_steps.length && (
                  <div className="flex items-center mt-2">
                    <label className="text-xs text-gray-600 mr-2">Step:</label>
                    <input
                      aria-label='proxy-prompt-step'
                      type="number"
                      min={1}
                      className="w-24 p-1 border rounded-md text-sm"
                      value={refinedData.switch_prompts_steps[idx]}
                      onChange={(e) =>
                        onUpdateStep(idx, Number(e.target.value))
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-4 border-2 border-purple-200">
        <p className="text-sm font-semibold text-purple-900">
          🎯 Switch steps: {refinedData.switch_prompts_steps.join(' → ')}
        </p>
      </div>
      
      <button
        onClick={handleAddPrompt}
        className="bg-gray-200 hover:bg-gray-300 rounded-md px-4 py-1 text-sm transition-colors duration-200"
      >
        + Add prompt
      </button>
      
      <button
        onClick={onGenerate}
        disabled={generating}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-2 px-2 rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed w-full flex items-center justify-center gap-3 text-lg"
      >
        {generating ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            Generating Your Image...
          </>
        ) : (
          <>
            <ImageIcon className="w-6 h-6" />
            Generate Image
          </>
        )}
      </button>
    </div>
  );
}