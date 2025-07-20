const Assessment = require("../models/Assessment");
const Chat = require("../models/Chat");
const User = require("../models/User");
const Report = require("../models/Report");
const Recommendation = require("../models/Recommendation");
const { generateInsights } = require("../utils/geminiService");
const {
  createNotificationsFromRecommendations,
} = require("../utils/notificationGenerator");
const mongoose = require("mongoose");

exports.generateNewInsights = async (req, res) => {
  // --- AUTHENTICATION: Check Authorization header and verify Firebase token ---
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ [AUTH] Authorization header missing or malformed');
    return res.status(401).json({ message: 'Unauthorized: No token provided.' });
  }
  const idToken = authHeader.split(' ')[1];
  let firebaseUID;
  try {
    const admin = require('../utils/firebaseAdmin');
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    firebaseUID = decodedToken.uid;
    console.log('✅ [AUTH] Token verified, UID:', firebaseUID);
  } catch (err) {
    console.log('❌ [AUTH] Invalid or expired token:', err.message);
    return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
  }

  const { assessmentId } = req.body;
  console.log("🔍 [INSIGHTS] Starting insights generation:", { assessmentId, firebaseUID });

  if (!assessmentId) {
    console.log("❌ [INSIGHTS] Missing required parameters");
    return res.status(400).json({ message: "Assessment ID is required." });
  }

  if (!mongoose.Types.ObjectId.isValid(assessmentId)) {
    console.log("❌ [INSIGHTS] Invalid Assessment ID format:", assessmentId);
    return res.status(400).json({ message: "Invalid Assessment ID format." });
  }

  try {
    // 1. Fetch User to get the Mongo _id
    console.log("🔍 [INSIGHTS] Fetching user with firebaseUID:", firebaseUID);
    const user = await User.findOne({ firebaseUID });
    if (!user) {
      console.log("❌ [INSIGHTS] User not found for firebaseUID:", firebaseUID);
      return res.status(404).json({ message: "User not found." });
    }
    const userId = user._id;
    console.log("✅ [INSIGHTS] Found user:", { userId, firebaseUID });

    // 2. Fetch Assessment Data
    console.log("🔍 [INSIGHTS] Fetching assessment with ID:", assessmentId);
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      console.log("❌ [INSIGHTS] Assessment not found for ID:", assessmentId);
      return res.status(404).json({ message: "Assessment not found." });
    }
    console.log("✅ [INSIGHTS] Found assessment:", {
      id: assessment._id,
      userId: assessment.userId,
      hasFullData: !!assessment.fullAssessmentData,
      hasRiskScores: !!assessment.riskScores,
    });

    // 3. Fetch recent chat history (last 15 messages)
    console.log("🔍 [INSIGHTS] Fetching chat history for user:", userId);
    const chatHistory = await Chat.find({ userId })
      .sort({ createdAt: -1 })
      .limit(15);
    console.log("✅ [INSIGHTS] Found chat history:", { messageCount: chatHistory.length });

    // 4. Call AI model
    console.log("🔍 [INSIGHTS] Calling AI model for insights generation...");
    const assessmentData =
      assessment.fullAssessmentData || assessment.toObject();
    console.log("📊 [INSIGHTS] Assessment data structure:", {
      hasVitalSigns: !!assessmentData.vitalSigns,
      hasLifestyle: !!assessmentData.lifestyle,
      hasDiet: !!assessmentData.diet,
      hasMedicalHistory: !!assessmentData.medicalHistory,
    });

    // Add more detailed logging for inputs to generateInsights
    console.log("DEBUG: generateInsights - assessmentData preview:", JSON.stringify(assessmentData.vitalSigns || {}, null, 2));
    console.log("DEBUG: generateInsights - chatHistory length:", chatHistory.length);

    const { report, recommendations } = await generateInsights(
      assessmentData,
      chatHistory
    );
    console.log("✅ [INSIGHTS] AI insights generated:", {
      hasReport: !!report,
      hasRecommendations: !!recommendations,
      recommendationCount: recommendations?.length || 0,
    });

    // Add more detailed logging for outputs from generateInsights
    console.log("DEBUG: generateInsights - report preview:", JSON.stringify(report || {}, null, 2));
    console.log("DEBUG: generateInsights - recommendations preview:", JSON.stringify(recommendations?.[0] || {}, null, 2));

    // 5. Save the generated report
    console.log("🔍 [INSIGHTS] Saving report to database...");
    const savedReport = await Report.findOneAndUpdate(
      { assessmentId },
      {
        assessmentId,
        userId,
        reportData: report,
        generatedAt: new Date(),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    console.log("✅ [INSIGHTS] Report saved:", { reportId: savedReport._id });

    // 6. Delete old recommendations for this user and save new ones
    console.log("🔍 [INSIGHTS] Deleting old recommendations for user:", userId);
    const deleteResult = await Recommendation.deleteMany({ userId });
    console.log("✅ [INSIGHTS] Deleted old recommendations:", {
      deletedCount: deleteResult.deletedCount,
    });

    console.log("🔍 [INSIGHTS] Saving new recommendations...");
    const recommendationDocs = recommendations.map((rec) => {
      // Normalize category to match our schema
      let normalizedCategory = rec.category
        ? rec.category.toLowerCase()
        : "general";

      // Map common AI categories to our schema
      const categoryMap = {
        nutrition: "diet",
        "physical activity": "exercise",
        exercise: "exercise",
        lifestyle: "lifestyle",
        medication: "medication",
        monitoring: "monitoring",
        health: "general",
        wellness: "general",
        diet: "diet",
        general: "general",
        "cardiovascular health": "monitoring",
        "preventive care": "monitoring",
        "general health": "general",
        "heart health": "monitoring",
        "mental health": "lifestyle",
        nutrition: "diet",
        fitness: "exercise",
        wellness: "general",
        screening: "monitoring",
        checkup: "monitoring",
        checkups: "monitoring",
        prevention: "monitoring",
        preventive: "monitoring",
      };

      normalizedCategory = categoryMap[normalizedCategory] || "general";

      return {
        title: rec.title || "Health Recommendation",
        category: normalizedCategory,
        advice:
          rec.advice ||
          rec.description ||
          "Follow this recommendation for better health",
        priority: rec.priority || "Medium",
        userId,
        assessmentId,
        recommendationId: new mongoose.Types.ObjectId().toHexString(),
      };
    });
    console.log("📊 [INSIGHTS] Recommendation docs to save:", {
      count: recommendationDocs.length,
      sample: recommendationDocs[0] || "none",
    });

    const savedRecommendations = await Recommendation.insertMany(
      recommendationDocs
    );
    console.log("✅ [INSIGHTS] Recommendations saved:", {
      count: savedRecommendations.length,
    });

    // 7. Generate notifications from high/medium priority recommendations
    console.log("🔔 [INSIGHTS] Generating notifications...");
    const notificationCount = await createNotificationsFromRecommendations(
      userId,
      savedRecommendations
    );
    console.log(`✅ [INSIGHTS] ${notificationCount} notifications generated.`);

    console.log("🎉 [INSIGHTS] Insights generation completed successfully!");
    res
      .status(201)
      .json({ report: savedReport, recommendations: savedRecommendations });
  } catch (error) {
    console.error("❌ [INSIGHTS] Error generating new insights:", error);
    console.error("❌ [INSIGHTS] Error stack:", error.stack);
    res
      .status(500)
      .json({ message: "Failed to generate insights.", error: error.message });
  }
}; 