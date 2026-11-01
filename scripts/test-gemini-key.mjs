import { GoogleGenAI } from "@google/genai";

async function testGeminiFlash() {
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });

  for (const m of ["gemini-flash-latest", "gemini-3.8-flash", "gemini-3.5-flash", "gemini-2.5-flash-lite"]) {
    try {
      console.log(`Testing model: ${m}...`);
      const response = await ai.models.generateContent({
        model: m,
        contents: "Respond with: 'RoboBee AI Agent is Live!'",
      });
      console.log(` SUCCESS with ${m}! Response:\n`, response.text);
      return;
    } catch (err) {
      console.log(`Failed with ${m}:`, err.message);
    }
  }
}

testGeminiFlash();
