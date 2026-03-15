const { AdminDashboard } = require("../models/adminDashboard");

exports.showAdminDashboard = async (req, res) => {
  try {
    // Step 5: Create one model object that represents the whole dashboard.
    const adminDashboard = new AdminDashboard();

    // Step 6: Populate object properties using model methods.
    // Controller does not need to know SQL details.
    await adminDashboard.getStats();
    await adminDashboard.getUsersWithGoalStats();

    // Step 7: Pass clean model data to the view.
    res.render("admindashboard", {
      title: "Admin Dashboard",
      stats: adminDashboard.stats,
      users: adminDashboard.users,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
