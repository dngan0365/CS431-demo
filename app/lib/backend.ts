import { GenerationProgress, RefinedPromptData } from '@/app/types';

export async function* generateImage(
  backendUrl: string,
  initialPrompt: string,
  refinedData: RefinedPromptData
): AsyncGenerator<GenerationProgress> {
  const response = await fetch(`${backendUrl}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      initial_prompt: initialPrompt,
      prompts_list: refinedData.prompts_list,
      switch_prompts_steps: refinedData.switch_prompts_steps
    })
  });

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  console.log('Connected to backend, starting to receive SSE...');
  console.log('Response object:', response);

  // Get JSON content
  const data = await response.json();
  console.log('Response JSON:', data);

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const jsonData: GenerationProgress = JSON.parse(line.slice(6));
          yield jsonData;
        } catch (e) {
          console.error('Failed to parse SSE data:', e);
        }
      }
    }
  }
}