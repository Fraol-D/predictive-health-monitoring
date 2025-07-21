const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Google Generative AI client with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates a structured health report and recommendations.
 * @param {object} assessmentData - The user's assessment data.
 * @param {Array<object>} chatHistory - The user's recent chat history.
 * @returns {Promise<{report: object, recommendations: Array<object>}>} - The generated report and recommendations.
 */
async function generateInsights(assessmentData, chatHistory) {
  console.log("🤖 Starting Gemini AI insights generation...");
  console.log("📊 Assessment data keys:", Object.keys(assessmentData));
  console.log("💬 Chat history length:", chatHistory.length);

  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is not set in environment variables");
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const chatMessages = chatHistory
    .map((chat) => `User: ${chat.userMessage}\nAI: ${chat.aiMessage}`)
    .join("\n");
  console.log("💬 Formatted chat messages length:", chatMessages.length);

  const prompt = `
You are a health assistant. Based on the data below:

1. Health Assessment:
${JSON.stringify(assessmentData, null, 2)}

2. Chat History:
${chatMessages}

➡️ Return a single minified JSON object with two keys: "report" and "recommendations".
- "report": A structured JSON object of health risks including scorecards, risk levels, and a summary.
- "recommendations": An array of personalized health recommendations, each with a title, category, advice, and priority.

Example format:
{"report": {"riskSummary": "...", "scorecards": [...]}, "recommendations": [{"title": "...", "category": "...", "advice": "...", "priority": "High"}]}

⚠️ Focus ONLY on health-relevant information. Ignore casual or unrelated conversations in the chat. The output must be a single minified JSON object.
`;

  console.log("📝 Prompt length:", prompt.length);

  try {
    console.log("🔍 Calling Gemini API...");
    const result = await model.generateContent(prompt);
    console.log("✅ Gemini API call completed");

    const response = await result.response;
    const text = response.text();
    console.log("📄 Raw response length:", text.length);
    console.log("📄 Raw response preview:", text.substring(0, 200) + "...");

    // Clean the text to ensure it is valid JSON
    const cleanedText = text.replace(/^```json\s*|```\s*$/g, "").trim();
    console.log("🧹 Cleaned text length:", cleanedText.length);
    console.log(
      "🧹 Cleaned text preview:",
      cleanedText.substring(0, 200) + "..."
    );

    console.log("🔍 Parsing JSON response...");
    const parsedJson = JSON.parse(cleanedText);
    console.log("✅ JSON parsed successfully");
    console.log("📊 Parsed JSON structure:", {
      hasReport: !!parsedJson.report,
      hasRecommendations: !!parsedJson.recommendations,
      recommendationCount: parsedJson.recommendations?.length || 0,
      reportKeys: parsedJson.report ? Object.keys(parsedJson.report) : [],
    });

    return parsedJson;
  } catch (error) {
    console.error("❌ Error generating insights from Gemini:", error);
    console.error("❌ Error type:", error.constructor.name);
    console.error("❌ Error message:", error.message);
    if (error.stack) {
      console.error("❌ Error stack:", error.stack);
    }
    throw new Error(
      "Failed to generate insights from AI model: " + error.message
    );
  }
}

module.exports = {
  generateInsights,
};
