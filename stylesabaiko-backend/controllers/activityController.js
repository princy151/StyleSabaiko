const ActivityLog = require("../models/activitylog");

const getActivityLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.find({})
            .populate("userId", "email username")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, logs });
    } catch (error) {
        console.error("Failed to fetch logs:", error);
        res.status(500).json({ success: false, message: "Failed to fetch logs" });
    }
};


module.exports = { getActivityLogs };
