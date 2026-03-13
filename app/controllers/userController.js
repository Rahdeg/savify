const userModel = require("../models/userModel");
const goalModel = require("../models/goalModel");

exports.showDashboard = async (req, res) => {
  try {
    const userId = 1;
    const dashboardResult = await userModel.getUserDashboard(userId);
    const goalsResult = await goalModel.getAllGoalsByUser(userId);
    const activityResult = await userModel.getRecentActivity(userId);

    res.render("dashboard", {
      title: "User Dashboard",
      dashboard: dashboardResult[0],
      goals: goalsResult,
      activities: activityResult,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
