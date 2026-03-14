const userModel = require("../models/userModel");
const goalModel = require("../models/goalModel");

exports.showDashboard = async (req, res) => {
  try {
    const userId = 3;
    const profileResult = await userModel.getUserProfile(userId);
    const goalsResult = await goalModel.getAllGoalsByUser(userId);
    const activityResult = await userModel.getRecentActivity(userId);

    res.render("dashboard", {
      title: "Savify ",
      profile: profileResult[0],
      goals: goalsResult,
      activities: activityResult,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
