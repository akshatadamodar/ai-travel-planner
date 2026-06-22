import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const generateWithRetry = async (prompt) => {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      return response.text;
    } catch (error) {
      lastError = error;

      console.log(
        `Gemini request failed. Retry ${attempt}/3`
      );

      if (attempt < 3) {
        await sleep(3000);
      }
    }
  }

  throw lastError;
};

export const generateTravelPlan = async (
  destination,
  days,
  budgetType,
  interests
) => {
  try {
    const prompt = `
Generate a ${days}-day travel itinerary.

Destination: ${destination}

Budget Type: ${budgetType}

Interests:
${interests.join(", ")}

Return ONLY valid JSON in this format:

{
  "itinerary":[
    {
      "day":1,
      "activities":[]
    }
  ],

  "estimatedBudget":{
    "flights":0,
    "accommodation":0,
    "food":0,
    "activities":0,
    "total":0
  },

  "hotels":[
    {
      "name":"",
      "type":""
    }
  ]
}
`;

    const text = await generateWithRetry(prompt);

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error.message);

    throw new Error(
      "AI service is temporarily unavailable. Please try again."
    );
  }
};

export const regenerateDayPlan = async (
  destination,
  day,
  interests,
  instruction
) => {
  try {
    const prompt = `
Destination: ${destination}

Regenerate Day ${day} itinerary.

Interests:
${interests.join(", ")}

Extra instruction:
${instruction}

Return ONLY valid JSON:

{
  "day": ${day},
  "activities":[]
}
`;

    const text = await generateWithRetry(prompt);

    return JSON.parse(text);
  } catch (error) {
    console.error(
      "Regenerate Day Gemini Error:",
      error.message
    );

    throw new Error(
      "Unable to regenerate itinerary right now."
    );
  }
};