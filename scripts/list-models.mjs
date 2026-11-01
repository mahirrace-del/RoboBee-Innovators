import { GoogleGenAI } from "@google/genai";

async function listAllModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });

  try {
    const list = await ai.models.list();
    console.log("Available models:");
    for await (const m of list) {
      if (m.name.includes("gemini")) {
        console.log("-", m.name, m.displayName);
      }
    }
  } catch (err) {
    console.error("List models error:", err.message);
  }
}

listAllModels();
