const ActivityLog = require("../models/activitylog");

const logActivity = async ({ req, userId, action, details = {} }) => {
  try {
    await ActivityLog.create({
      userId,
      action,
      details,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};

module.exports = logActivity;
