"use client"
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import ConfigPanel from './components/ConfigPanel';
import PromptInput from './components/PromptInput';
import RefinedPrompts from './components/RefinedPrompts';
import ProgressIndicator from './components/ProgressIndicator';
import ImageGallery from './components/ImageGallery';
import { refinePromptWithGemini } from './lib/gemini';
import { generateImage } from './lib/backend';
import { RefinedPromptData, DenoiseImage } from './types';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [backendUrl, setBackendUrl] = useState('http://localhost:8000');
  const [refining, setRefining] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [refinedData, setRefinedData] = useState<RefinedPromptData | null>(null);
  const [explanation, setExplanation] = useState('');
  const [denoiseImages, setDenoiseImages] = useState<DenoiseImage[]>([]);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');

  const handleRefine = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }
    setRefining(true);
    setError('');
    setRefinedData(null);
    setExplanation('');
    setDenoiseImages([]);
    setFinalImage(null);

    try {
      const result = await refinePromptWithGemini(prompt);
      setExplanation(result.explanation);
      setRefinedData(result.data);
    } catch (err: any) {
      setError(`Refinement failed: ${err.message}`);
      console.error('Refinement error:', err);
    } finally {
      setRefining(false);
    }
  };

  const handleGenerate = async () => {
    if (!refinedData) {
      setError('Please refine the prompt first');
      return;
    }

    console.log(refinedData);

    setGenerating(true);
    setError('');
    setDenoiseImages([]);
    setFinalImage(null);
    setProgress('Connecting to backend...');

    try {
      // `Array.prototype.at(-1)` may not be available depending on the TS/target
      // and can return undefined for empty arrays. Compute the last prompt
      // in a backwards-compatible, type-safe way and guard against undefined.
      const lastPrompt = refinedData.prompts_list && refinedData.prompts_list.length > 0
        ? refinedData.prompts_list[refinedData.prompts_list.length - 1]
        : // fallback to a top-level prompt if available on refinedData
          // (adjust this fallback to whatever shape `RefinedPromptData` has)
          // Using an empty string is safer than passing `undefined` to the backend
          (refinedData as any).prompt || '';

      for await (const event of generateImage(backendUrl, lastPrompt, refinedData)) {
        if (event.type === 'progress') {
          setProgress(event.message || '');
        } else if (event.type === 'denoise_image') {
          setDenoiseImages(prev => [...prev, {
            step: event.step!,
            image: `data:image/png;base64,${event.image}`
          }]);
          setProgress(`Denoising step ${event.step}...`);
        } else if (event.type === 'final_image') {
          setFinalImage(`data:image/png;base64,${event.image}`);
          setProgress('Generation complete! 🎉');
        } else if (event.type === 'error') {
          setError(event.message || 'Unknown error');
        }
      }
    } catch (err: any) {
      setError(`Generation failed: ${err.message}`);
      console.error('Generation error:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4">
            AI Image Generator
          </h1>
          <p className="text-md text-gray-600 max-w-4xl mx-auto">
            Transform your ideas into stunning images with AI-powered prompt refinement and Stable Diffusion
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Configuration */}
            <ConfigPanel
              backendUrl={backendUrl}
              setBackendUrl={setBackendUrl}
            />

            {/* Prompt Input */}
            <PromptInput
              prompt={prompt}
              setPrompt={setPrompt}
              onRefine={handleRefine}
              refining={refining}
              disabled={!prompt.trim()}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="card border-2 border-red-300 bg-red-50">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900 mb-1">Error</p>
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Refined Prompts */}
          {refinedData && (
            <RefinedPrompts
              refinedData={refinedData}
              explanation={explanation}
              onGenerate={handleGenerate}
              generating={generating}
            />
          )}

          {/* Progress */}
          {progress && generating && (
            <ProgressIndicator message={progress} />
          )}

          {/* Image Gallery */}
          <ImageGallery
            denoiseImages={denoiseImages}
            finalImage={finalImage}
          />
        </div>
      </div>
    </div>
  );
}