🚀 Brand Mention Checker – Backend (Node.js + Express)

This backend powers the Brand Mention Checker web app.
It uses the Gemini API to analyze prompts and detect whether a brand is mentioned (exactly or fuzzily), along with its mention position.

✅ Features
1. Gemini API Integration

Uses fixed model: gemini-2.0-flash-lite

Temperature fixed at 0.2

Max tokens fixed at 400

2. Multiple API Key Fallback

Supports up to 4 API keys:

GEMINI_API_KEY_1
GEMINI_API_KEY_2
GEMINI_API_KEY_3
GEMINI_API_KEY_4


If one key fails, the backend automatically tries the next key.
If all fail, it returns a safe fallback response so the frontend still works.

3. Exact + Fuzzy Brand Matching

The backend checks:

Exact match using .includes().

Fuzzy match using Dice Coefficient to catch near matches like:

"mail chimp" → mailchimp

"matoma" → matomo

"saleesforce" → salesforce

Threshold used: >= 0.5.

4. Position Detection

Returns the 1-based index of the first brand mention (exact or fuzzy) inside the generated text.

5. Graceful Error Handling

If every API key fails, response example:

{
  "mentioned": false,
  "position": null,
  "fallback": true,
  "error": "Service temporarily unavailable. Please try again later."
}

📡 API Endpoint
POST /api/check-brand
Request Body:
{
  "prompt": "Give a list of best analytics tools",
  "brandName": "Matomo"
}

Successful Response:
{
  "prompt": "Give a list of best analytics tools",
  "brandName": "Matomo",
  "mentioned": true,
  "position": 3
}

🔧 Environment Variables

Add these to your Render/Railway environment settings:

PORT=5000

GEMINI_API_KEY_1=your_api_key
GEMINI_API_KEY_2=your_api_key
GEMINI_API_KEY_3=your_api_key
GEMINI_API_KEY_4=your_api_key

▶️ Running Locally (optional)
npm install
npm start

🛠 Tech Stack

Node.js

Express

@google/generative-ai

Dice Coefficient fuzzy matching

No database

📄 Model & Temperature (Fixed)

Model: gemini-2.0-flash-lite

Temperature: 0.2

Both are fixed in code as required.