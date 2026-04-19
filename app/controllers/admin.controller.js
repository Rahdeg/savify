const { AdminDashboard } = require("../models/adminDashboard");

exports.showAdminDashboard = async (req, res) => {
  try {
    const adminDashboard = new AdminDashboard();

    await adminDashboard.getStats();
    await adminDashboard.getUsersWithGoalStats();
    await adminDashboard.getGoalStatusBreakdown();
    await adminDashboard.getMonthlyContributions();

    res.render("admindashboard", {
      title: "Admin Dashboard",
      stats: adminDashboard.stats,
      users: adminDashboard.users,
      goalBreakdown: adminDashboard.goalBreakdown,
      monthlyContributions: adminDashboard.monthlyContributions,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};