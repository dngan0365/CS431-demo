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
  total_steps?: number;
  image?: string;
}

export interface SimpleGenerationProgress {
  type: 'progress' | 'final_image' | 'error';
  message?: string;
  image?: string;
}

export interface GeminiResponse {
  explanation: string;
  prompts_list: string[];
  switch_prompts_steps: number[];
}