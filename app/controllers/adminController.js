const adminModel = require("../models/adminModel");

exports.showAdminDashboard = async (req, res) => {
  try {
    const statsResult = await adminModel.getAdminStats();
    const usersResult = await adminModel.getAllUsersWithGoalStats();

    res.render("admin-dashboard", {
      title: "Admin Dashboard",
      stats: statsResult[0],
      users: usersResult,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
