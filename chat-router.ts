import { GoogleGenAI } from "@google/genai";

export async function processChat(
  ai: GoogleGenAI,
  fileData: any,
  processedQuestion: string,
  systemPrompt: string,
  grade: string
) {
  // Model mapping based on requirements (using Gemini models that act as proxies/equivalents)
  let model = "gemini-2.5-flash-lite"; // Default
  let contents: any[] = [];
  let prompt = `System Instruction: ${systemPrompt}\nTarget Audience: ${grade} school student.\nQuestion: ${processedQuestion}`;

  if (fileData) {
    const ext = fileData.name.split('.').pop()?.toLowerCase();

    if (ext === 'png' || ext === 'jpg') {
      // Vision model
      contents.push({
        role: "user",
        parts: [
          { inlineData: { data: fileData.dataUrl.split(',')[1], mimeType: fileData.type } },
          { text: `System Instruction: ${systemPrompt}\nAnalyze this image for Grade R-3. Explain simply. Question: ${processedQuestion}` }
        ]
      });
    } else if (ext === 'py' || ext === 'js') {
      // Code analysis model (Qwen equivalent)
      contents.push({
        role: "user",
        parts: [{ text: `System Instruction: ${systemPrompt}\nFile: ${fileData.name}\nContent: ${fileData.content}\nAnalyze this code for Grade R-3. Explain simply. Question: ${processedQuestion}` }]
      });
    } else {
      // Default / Llama equivalent
      contents.push({
        role: "user",
        parts: [{ text: `System Instruction: ${systemPrompt}\nFile: ${fileData.name}\nContent: ${fileData.content}\nAnalyze this file for Grade R-3. Explain simply. Question: ${processedQuestion}` }]
      });
    }
  } else {
    contents.push({
      role: "user",
      parts: [{ text: prompt }]
    });
  }

  const response = await ai.models.generateContent({
    model: model,
    contents: contents
  });

  return response.text || "";
}
