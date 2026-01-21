import { GoogleGenAI } from "@google/genai";
import { ProductionRecord } from "../types";

export const getAIInsights = async (records: ProductionRecord[]) => {
  if (records.length === 0) return "మరింత డేటా నమోదు చేయండి.";

  try {
    // Correct initialization using named parameter
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    
    const last5 = records.slice(-5).map(r => ({
      machine: r.machineName,
      total: r.hourlyProduction.reduce((sum, h) => sum + h.count, 0),
      breakdown: r.breakdown.durationMinutes
    }));

    // Correct method: ai.models.generateContent
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [{
          text: `Context: Egg tray manufacturing plant. Data: ${JSON.stringify(last5)}. 
          Action: Give a 2-sentence expert advice to the plant owner in Telugu. Be specific about production efficiency.`
        }]
      }],
    });

    // Accessing .text property directly
    return response.text || "విశ్లేషణ విఫలమైంది.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI ప్రస్తుతం అందుబాటులో లేదు.";
  }
};
