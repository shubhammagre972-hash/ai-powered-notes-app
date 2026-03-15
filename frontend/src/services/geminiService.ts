
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const summarizeNote = async (content: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Summarize the following lecture notes into key bullet points and a concise overview:\n\n${content}`,
    config: {
      temperature: 0.7,
      topP: 0.95,
    },
  });
  return response.text;
};

export const categorizeNote = async (content: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following content and suggest exactly 3 relevant academic categories or tags. Content: \n\n${content}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          categories: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ['categories']
      }
    }
  });
  try {
    const data = JSON.parse(response.text || '{"categories":[]}');
    return data.categories;
  } catch (e) {
    return ["General", "Lecture", "Academic"];
  }
};

export const getSuggestedResources = async (topic: string, rating: number) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The user has a difficulty level of ${rating}/5 (where 1 is low understanding) in the topic: "${topic}". Suggest 3 high-quality learning resources (videos, articles, or books).`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            url: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['video', 'article', 'book'] }
          },
          required: ['title', 'url', 'type']
        }
      }
    }
  });
  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    return [];
  }
};
