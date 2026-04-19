const { AdminDashboard } = require("../models/adminDashboard");

exports.showVerifyPage = (req, res) => {
  res.render("admin-verify", {
    title: "Admin Verification",
    error: req.session.adminVerifyError || null,
  });
  delete req.session.adminVerifyError;
};

exports.verifyAdminSecret = (req, res) => {
  const { secret } = req.body;

  if (secret === process.env.ADMIN_SECRET) {
    req.session.adminVerified = true;
    return res.redirect("/admin/dashboard");
  }

  req.session.adminVerifyError = "Incorrect password. Please try again.";
  res.redirect("/admin/verify");
};

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