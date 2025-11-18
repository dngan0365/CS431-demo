/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from 'next/image';

export default function ImageGenForm() {
  const [prompt, setPrompt] = useState("");
  const [refinedPrompt, setRefinedPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [stepImages, setStepImages] = useState<string[]>([]);
  const [finalImage, setFinalImage] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setStepImages([]);
    setFinalImage("");

    // 1) refine prompt using Gemini
    const refineRes = await fetch("/api/refinePrompt", {
      method: "POST",
      body: JSON.stringify({ prompt }),
      headers: { "Content-Type": "application/json" }
    });

    const { refinedPrompt } = await refineRes.json();
    setRefinedPrompt(refinedPrompt);

    // 2) send to FastAPI backend ----------------------------------
    const backendUrl = "http://localhost:8000/generate"; // update to your backend

    const genRes = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: refinedPrompt })
    });

    const data = await genRes.json();

    // expected format:
    // data = { final_image: "base64...", steps: ["b64...", "b64...", ...] }

    setStepImages(data.steps || []);
    setFinalImage(data.final_image || "");
    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-lg mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">AI Image Generator</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full border p-3 rounded-lg"
          rows={3}
          placeholder="Describe your image..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition"
        >
          {loading ? "Generating..." : "Generate Image"}
        </button>
      </form>

      {refinedPrompt && (
        <div className="mt-6 p-3 bg-gray-100 rounded-xl text-sm">
          <strong>Refined Prompt:</strong>
          <p>{refinedPrompt}</p>
        </div>
      )}

      {loading && (
        <div className="mt-4 text-center text-gray-500">
          Generating... please wait
        </div>
      )}

      {stepImages.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Denoising Steps</h2>
          <div className="grid grid-cols-2 gap-3">
            {stepImages.map((img, i) => (
              <Image
                key={i}
                src={`data:image/png;base64,${img}`}
                alt={`Denoising step ${i + 1}`}
                width={300}
                height={300}
                className="rounded-lg border"
              />
            ))}
          </div>
        </div>
      )}

      {finalImage && (
        <div className="mt-8">
          <h2 className="font-semibold mb-2">Final Image</h2>
          <Image
            src={`data:image/png;base64,${finalImage}`}
            alt="Final generated image"
            width={600}
            height={600}
            className="rounded-xl shadow-lg w-full"
          />
        </div>
      )}
    </div>
  );
}
