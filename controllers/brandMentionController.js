import { GoogleGenerativeAI } from "@google/generative-ai";
import { diceCoefficient } from "../utils/fuzzyMatch.js";

async function tryWithFallback(apiCall) {
  let lastError;

  const API_KEYS = [
    (process.env.GEMINI_API_KEY_1 || "").trim(),
    (process.env.GEMINI_API_KEY_2 || "").trim(),
    (process.env.GEMINI_API_KEY_3 || "").trim(),
    (process.env.GEMINI_API_KEY_4 || "").trim(),
  ];

  const genAIClients = API_KEYS.map((key) => new GoogleGenerativeAI(key));

  for (const client of genAIClients) {
    try {
      return await apiCall(client);
    } catch (error) {
      console.error(`API key failed: ${error.message}`);
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  throw lastError || new Error("No API keys available");
}

export const checkBrandMention = async (req, res) => {
  try {
    const { prompt, brandName } = req.body;

    if (!prompt || !brandName) {
      return res.status(400).json({
        error: "Both prompt and brandName are required",
      });
    }

    try {
      const result = await tryWithFallback(async (genAI) => {
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash-lite",
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 400,
          },
        });

        return await model.generateContent(prompt);
      });

      const text = result.response.text();
      const lowerText = text.toLowerCase();
      const lowerBrand = brandName.toLowerCase();

      let mentioned = false;
      let position = null;

      const words = text.split(/\s+/);

      // Exact match
      if (lowerText.includes(lowerBrand)) {
        mentioned = true;

        const firstBrandWord = brandName.split(/\s+/)[0].toLowerCase();
        for (let i = 0; i < words.length; i++) {
          if (words[i].toLowerCase().includes(firstBrandWord)) {
            position = i + 1;
            break;
          }
        }
      } else {
        // Fuzzy match using dice coefficient
        for (let i = 0; i < words.length; i++) {
          const score = diceCoefficient(words[i], brandName);

          if (score >= 0.5) {
            mentioned = true;
            position = i + 1;
            break;
          }
        }
      }

      return res.json({
        prompt,
        brandName,
        mentioned,
        position,
      });
    } catch (apiError) {
      console.error("All API keys failed:", apiError);

      return res.status(200).json({
        prompt,
        brandName,
        mentioned: false,
        position: null,
        fallback: true,
        error: "Service temporarily unavailable. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Unexpected error:", error);

    return res.status(500).json({
      error: "An unexpected error occurred",
      fallback: true,
    });
  }
};
