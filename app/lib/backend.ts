import { GenerationProgress, RefinedPromptData, SimpleGenerationProgress } from '@/app/types';

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
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith("data: ")) {
        try {
          const jsonData: GenerationProgress = JSON.parse(trimmed.slice(6));
          yield jsonData;
        } catch (e) {
          console.error("Failed to parse SSE data:", e, trimmed);
        }
      }
    }
  }
}


export async function* generateSimpleImage(
  backendUrl: string,
  prompt: string
): AsyncGenerator<SimpleGenerationProgress> {

  const response = await fetch(`${backendUrl}/generate_simple`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initial_prompt: prompt })
  });

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }

  console.log("Connected to backend for simple generation...");

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body from backend");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // SSE events end with "\n\n"
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? ""; // giữ lại đoạn incomplete

    for (const event of events) {
      const line = event.trim();
      if (!line.startsWith("data:")) continue;

      const jsonStr = line.slice(5).trim(); // remove "data:"

      try {
        const parsed: SimpleGenerationProgress = JSON.parse(jsonStr);
        yield parsed;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        console.error("❌ Failed to parse SSE JSON:", jsonStr);
      }
    }
  }
}