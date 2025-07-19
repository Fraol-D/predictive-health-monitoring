const mongoose = require("mongoose");
const Notification = require("../models/Notification");

// Helper function to generate notification messages from recommendations
function generateNotificationMessage(recommendation) {
  const { title, category, priority } = recommendation;

  const priorityPrefix =
    priority === "High"
      ? "🔴 High Priority"
      : priority === "Medium"
      ? "🟡 Medium Priority"
      : "🟢 Low Priority";

  const categoryEmoji = {
    diet: "🍎",
    exercise: "💪",
    lifestyle: "🏃‍♂️",
    medication: "💊",
    monitoring: "📊",
    general: "💡",
  };

  const emoji = categoryEmoji[category] || "💡";

  return `${priorityPrefix} ${emoji} ${title} - Check your recommendations for details on how to improve your ${category} habits.`;
}

/**
 * Creates and saves notifications based on a list of recommendations.
 * @param {string} userId - The MongoDB _id of the user.
 * @param {Array} recommendations - The list of recommendation documents that were just saved.
 * @returns {Promise<number>} The number of notifications created.
 */
async function createNotificationsFromRecommendations(userId, recommendations) {
  if (!userId || !recommendations || !Array.isArray(recommendations)) {
    console.warn("Skipping notification generation due to missing data.");
    return 0;
  }

  try {
    const notificationsToCreate = [];

    for (const rec of recommendations) {
      if (rec.priority === "High" || rec.priority === "Medium") {
        const notificationMessage = generateNotificationMessage(rec);

        const notification = new Notification({
          userId,
          notificationId: new mongoose.Types.ObjectId().toHexString(),
          message: notificationMessage,
          type: "recommendation",
          relatedRecommendationId: rec._id, // Link to the recommendation
        });

        notificationsToCreate.push(notification);
      }
    }

    if (notificationsToCreate.length > 0) {
      const savedNotifications = await Notification.insertMany(
        notificationsToCreate
      );
      return savedNotifications.length;
    }

    return 0;
  } catch (err) {
    console.error("Error in createNotificationsFromRecommendations:", err);
    // Don't throw, as this is a non-critical background task
    return 0;
  }
}

module.exports = { createNotificationsFromRecommendations };
