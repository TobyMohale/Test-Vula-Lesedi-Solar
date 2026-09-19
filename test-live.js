import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
try {
  const session = await ai.live.connect({ model: "gemini-3.1-flash-live-preview" });
  console.log("Connected successfully!");
  session.close();
} catch (err) {
  console.error("Failed to connect:", err.message);
}
