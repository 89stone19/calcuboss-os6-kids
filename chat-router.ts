import { GoogleGenAI } from "@google/genai";

/**
 * chat-router.ts - Server-side AI Router for Calcuboss OS6
 * 
 * ORACLE FREE VPS OLLAMA ENDPOINT: https://YOUR_VPS/api/chat
 * (Configure your Oracle Cloud Free ARM Ampere / x86 VPS running Ollama)
 * 
 * Routing Rules:
 * 1. Image (.png, .jpg, .jpeg) -> Gemini Vision OCR & Multimodal Analysis for Grade R-3
 * 2. Coding (.py, .js, bug, error, Scratch, robot) -> Qwen2 0.5B Code Expert (or Gemini Lite fallback)
 * 3. General (Science, Math, Logic) -> TinyLlama 1.1B Deep Reasoning for Grade R-3 (or Gemini Lite fallback)
 * 4. Low confidence (< 0.7) or VPS timeout -> Fallback to Gemini 2.5 Flash Lite
 */

// Place to plug Oracle Free VPS Ollama endpoint:
// https://YOUR_VPS/api/chat
export const ORACLE_VPS_CHAT_ENDPOINT = process.env.VPS_OLLAMA_URL || "https://YOUR_VPS/api/chat";

export async function processChat(
  ai: GoogleGenAI,
  fileData: any,
  processedQuestion: string,
  systemPrompt: string,
  grade: string
) {
  // Default fallback model: Gemini 2.5 Flash Lite
  let model = "gemini-2.5-flash-lite";
  let contents: any[] = [];
  const qLower = (processedQuestion || "").toLowerCase();

  const isCoding = 
    qLower.includes("code") ||
    qLower.includes(".py") ||
    qLower.includes("bug") ||
    qLower.includes("error") ||
    qLower.includes("scratch") ||
    qLower.includes("robot") ||
    fileData?.name?.endsWith(".py") ||
    fileData?.name?.endsWith(".js") ||
    fileData?.name?.endsWith(".sb3");

  // Format tailored for 5-9 year old primary students (Grade R-3)
  const childGuidancePrompt = `Target Audience: South African Grade R-3 learners (ages 5-9).
Instruction: Keep responses deep with rich reasoning, but using crystal-clear, simple English and relatable analogies.
${isCoding ? "Include Demki's 3-Step Debugger Checklist (Line number, int vs str, 4-space indent) and working examples." : "Include relatable everyday examples (like sharing sweets, toy building blocks, nature)."}
System: ${systemPrompt}`;

  if (fileData) {
    const ext = fileData.name.split('.').pop()?.toLowerCase();

    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || fileData.type?.startsWith('image/')) {
      // Vision model for OCR & Diagram/Code Screenshot extraction
      const base64Data = fileData.dataUrl ? fileData.dataUrl.split(',')[1] || fileData.dataUrl : '';
      contents.push({
        role: "user",
        parts: [
          { inlineData: { data: base64Data, mimeType: fileData.type || 'image/png' } },
          { text: `${childGuidancePrompt}\n\nAnalyze this uploaded image for Grade R-3. Extract any code or text (OCR), explain it simply, and answer the question: ${processedQuestion || "Explain this image step-by-step for a primary school student."}` }
        ]
      });
    } else if (ext === 'py' || ext === 'js' || ext === 'sb3' || ext === 'html') {
      // Qwen2 0.5B Code Analysis Prompt
      contents.push({
        role: "user",
        parts: [{ 
          text: `${childGuidancePrompt}\n[Role: Qwen2 0.5B Code Expert]\nFile Name: ${fileData.name}\nCode Content:\n\`\`\`\n${fileData.content || 'Code file attached'}\n\`\`\`\nAnalyze this code for Grade R-3. Explain simply with examples. Question: ${processedQuestion || "Explain how this code works and check for any bugs."}` 
        }]
      });
    } else {
      // TinyLlama 1.1B General Analysis Prompt
      contents.push({
        role: "user",
        parts: [{ 
          text: `${childGuidancePrompt}\n[Role: TinyLlama 1.1B Deep Teacher]\nFile Name: ${fileData.name}\nContent: ${fileData.content || ''}\nAnalyze this homework file for Grade R-3. Explain simply. Question: ${processedQuestion || "Help me understand this lesson."}` 
        }]
      });
    }
  } else {
    contents.push({
      role: "user",
      parts: [{ 
        text: `${childGuidancePrompt}\n[Routing: ${isCoding ? "Qwen2 0.5B Code Expert" : "TinyLlama 1.1B Deep Reasoning"}]\nQuestion: ${processedQuestion}` 
      }]
    });
  }

  const response = await ai.models.generateContent({
    model: model,
    contents: contents
  });

  return response.text || "";
}
