'use client';

import { Download, Image as ImageIcon } from 'lucide-react';
import { DenoiseImage } from '@/app/types';

interface ImageGalleryProps {
  denoiseImages: DenoiseImage[];
  finalImage: string | null;
}

export default function ImageGallery({ denoiseImages, finalImage }: ImageGalleryProps) {
  return (
    <div className="space-y-4">
      {/* Denoise Images */}
      {denoiseImages.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
              <ImageIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Denoising Progress</h2>
              <p className="text-sm text-gray-600">{denoiseImages.length} steps captured</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {denoiseImages.map((img, idx) => (
              <div key={idx} className="relative group">
                <div className="relative overflow-hidden rounded-xl border-2 border-blue-200 shadow-md group-hover:shadow-xl transition-shadow">
                  <img
                    src={img.image}
                    alt={`Denoise step ${img.step}`}
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="absolute bottom-3 left-3 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-lg shadow-lg">
                  Step {img.step}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Final Image */}
      {finalImage && (
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
              <ImageIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Final Generated Image</h2>
              <p className="text-sm text-gray-600">Your creation is ready! 🎉</p>
            </div>
          </div>
          
          <div className="relative group">
            <div className="relative overflow-hidden rounded-2xl border-4 border-blue-300 shadow-2xl">
              <img
                src={finalImage}
                alt="Generated"
                className="w-full h-auto"
              />
            </div>
            <a
              href={finalImage}
              download="generated-image.png"
              className="absolute top-4 right-4 btn-secondary flex items-center gap-2 shadow-xl hover:scale-105 transform transition-transform"
            >
              <Download className="w-4 h-4" />
              Download
            </a>
          </div>
        </div>
      )}
    </div>
  );
}