import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  SchemaType, // Import SchemaType
} from '@google/generative-ai';

// Your type definition might still be useful for the function's return signature
import { GeminiResponse } from '@/app/types';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Define the native schema for the expected JSON output
const promptSchema = {
  type: SchemaType.OBJECT,
  properties: {
    explanation: {
      type: SchemaType.STRING,
      description: 'A short sentence explaining why decomposition is needed.',
    },
    final_dictionary: {
      type: SchemaType.OBJECT,
      properties: {
        prompts_list: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.STRING,
          },
        },
        switch_prompts_steps: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.NUMBER, // Use SchemaType.NUMBER for z.number()
          },
        },
      },
      required: ['prompts_list', 'switch_prompts_steps'],
    },
  },
  required: ['explanation', 'final_dictionary'],
};

// Define the expected type for the parsed result (optional but good practice)
type PromptSchemaType = {
  explanation: string;
  final_dictionary: {
    prompts_list: string[];
    switch_prompts_steps: number[];
  };
};

export async function refinePromptWithGemini(
  prompt: string,
): Promise<{
  explanation: string;
  data: { prompts_list: string[]; switch_prompts_steps: number[] };
}> {
  if (!apiKey) {
    throw new Error('Missing NEXT_PUBLIC_GEMINI_API_KEY in .env');
  }

  // Initialize the GoogleGenerativeAI client
  const ai = new GoogleGenerativeAI(apiKey);

  // Define the full prompt template (same as before)
  const promptTemplate = `
You are an expert assistant in time step dependent prompt conditioning for diffusion models.
Your task is to decompose a complex or contextually contradictory prompt into up to **three** intermediate prompts
that align with the model’s denoising stages — from background layout to object identity to fine detail.
Only introduce prompt transitions when needed.

**Diffusion Semantics (Low → High Frequency Progression):**
**Steps 0–2:** Scene layout and dominant color regions (e.g., sky, forest, sand tone)
**Steps 3–6:** Object shape, size, pose, and position
**Steps 7–10:** Object identity, material, and surface type (e.g., glass vs. rubber)
**Steps 11–13+:** Fine features and local details (e.g., tattoos, insects, facial detail)

Since denoising progresses from coarse to fine, it is crucial to stabilize large scale visual structures (such as body shape, pose, and background) before introducing small or semantically charged elements (such as facial details, objects in hand, or surreal features).

**Substitution Strategy:**
1. Begin with high-level layout (background, geometry).
2. Use **placeholder concepts** if needed to stabilize layout before detailed insertions.
3. Substitutes must match in shape, size, and visual function.
4. Replace placeholders as soon as fidelity permits.
5. Do not maintain substitutions longer than needed.
6. If the prompt is visually coherent, return a **single prompt** with no decomposition.
7. Do not have syntax errors.

**Output Format:**
{
  "explanation": "A short sentence explaining why decomposition is needed.",
  "final_dictionary": {
    "prompts_list": [
      "<prompt1>",
      "<prompt2>",
      "...",
      "<target prompt>"
    ],
    "switch_prompts_steps": ["<step1>", "<step2>", "..."]
  }
}
- **The length of switch_prompts_steps must be one less than prompts_list**.
- Do not include any text outside this structure.

Example Input/Output pairs:
Input: "A polar bear in a desert"
Output:
{
  "explanation": "A polar bear is common in snowy scenes, not deserts. Since no suitable object proxy exists, the prompt starts with the desert alone before introducing the unlikely animal.",
  "final_dictionary": {
    "prompts_list": [
      "A desert",
      "A polar bear in a desert"
    ],
    "switch_prompts_steps": [2]
  }
}

Input: "A fox in a nursery"
Output:
{
  "explanation": "A fox is uncommon in indoor scenes. Starting with a dog, then a visually similar breed (Shiba Inu), provides a natural proxy before introducing the fox in a childlike setting.",
  "final_dictionary": {
    "prompts_list": [
      "A dog in a nursery",
      "A Shiba Inu dog in a nursery",
      "A fox in a baby room"
    ],
    "switch_prompts_steps": [4, 7]
  }
}

Input: ${prompt}
Output:
`;

  // Get the generative model
  const model = ai.getGenerativeModel({
    model: 'gemini-2.5-flash', // Using 1.5 Flash as in the example, but 'gemini-2.5-flash' works too
    // Use generationConfig and responseSchema, as in your example
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: promptSchema, // Pass the native schema object
      temperature: 0.1,
    },
  });

  // Send the full prompt to the model
  const genAIResult = await model.generateContent(promptTemplate);

  // Correctly access the response
  const response = genAIResult.response;
  
  // Use response.text() and parse it, as shown in your example.
  // The API guarantees this text matches the schema.
  const jsonText = response.text();
  let parsedResult: PromptSchemaType;

  if (!jsonText) {
    console.error(
      'No text returned from Gemini:',
      JSON.stringify(response, null, 2),
    );
    throw new Error('Failed to refine prompt: No text response from API');
  }

  try {
    parsedResult = JSON.parse(jsonText);
  } catch (e) {
    console.error('Failed to parse JSON response from Gemini:', jsonText);
    throw new Error('Failed to refine prompt: Invalid JSON response');
  }

  // No need for Zod .parse() validation, as the API has already
  // conformed the output to the schema.
  console.log('Gemini Parsed Result:', parsedResult);

  // Return the structured data
  return {
    explanation: parsedResult.explanation,
    data: {
      prompts_list: parsedResult.final_dictionary.prompts_list,
      switch_prompts_steps: parsedResult.final_dictionary.switch_prompts_steps,
    },
  };
}