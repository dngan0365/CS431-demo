export interface RefinedPromptData {
  prompts_list: string[];
  switch_prompts_steps: number[];
}

export interface DenoiseImage {
  step: number;
  image: string;
}

export interface GenerationProgress {
  type: 'progress' | 'denoise_image' | 'final_image' | 'error';
  message?: string;
  step?: number;
  image?: string;
}

export interface GeminiResponse {
  explanation: string;
  prompts_list: string[];
  switch_prompts_steps: number[];
}