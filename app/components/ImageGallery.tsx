'use client';

import { Download, Image as ImageIcon } from 'lucide-react';
import { DenoiseImage } from '../types';
import Image from 'next/image';

interface ImageGalleryProps {
  denoiseImages?: DenoiseImage[];
  finalImage?: string | null;
  simpleImage?: string | null;
}

export default function ImageGallery({ 
  denoiseImages = [], 
  finalImage, 
  simpleImage 
}: ImageGalleryProps) {
  const showDenoiseProgress = denoiseImages.length > 0;
  const hasAnyImage = finalImage || simpleImage;

  return (
    <div className="space-y-6">
      {/* Simple Generated Image */}
      {simpleImage && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Quick Generation</h2>
                  <p className="text-sm text-cyan-100">Fast generation ⚡</p>
                </div>
              </div>
              <a
                href={simpleImage}
                download={`simple-image-${Date.now()}.png`}
                className="bg-white text-cyan-600 hover:bg-cyan-50 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          </div>
          
          <div className="p-8">
            <div className="max-w-2xl mx-auto">
              <div className="relative overflow-hidden rounded-xl shadow-2xl border border-gray-200">
                <Image
                  src={simpleImage}
                  alt="Simple Generated Image"
                  width={800}
                  height={800}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Final Generated Image */}
      {finalImage && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Final Generated Image</h2>
                  <p className="text-sm text-purple-100">High quality result 🎨</p>
                </div>
              </div>
              <a
                href={finalImage}
                download={`final-image-${Date.now()}.png`}
                className="bg-white text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          </div>
          
          <div className="p-8">
            <div className="max-w-2xl mx-auto">
              <div className="relative overflow-hidden rounded-xl shadow-2xl border border-gray-200">
                <Image
                  src={finalImage}
                  alt="Final Generated Image"
                  width={800}
                  height={800}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generation Progress Timeline */}
      {showDenoiseProgress && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Generation Progress</h2>
                <p className="text-sm text-orange-100">
                  {denoiseImages.length} denoising steps
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {denoiseImages.map((img, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-orange-400 transition-all duration-200 shadow-sm hover:shadow-md">
                    <Image
                      src={img.image}
                      alt={`Step ${img.step}`}
                      width={200}
                      height={200}
                      className="w-full h-auto"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-2 left-2 right-2 text-center">
                        <span className="text-white text-xs font-medium">
                          Step {img.step}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-xs text-gray-600 font-medium">
                      Step {img.step}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!hasAnyImage && !showDenoiseProgress && (
        <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No images yet</h3>
          <p className="text-gray-500">Generate an image to see it here</p>
        </div>
      )}
    </div>
  );
}