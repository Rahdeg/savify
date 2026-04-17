const { User } = require("../models/user");

exports.showDashboard = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.redirect("/");

    const user = new User(userId);
    await user.getProfile();
    await user.getGoals();
    await user.getRecentActivity();

    res.render("dashboard", {
      title: "My Dashboard – Savify",
      profile: user.profile,
      goals: user.goals,
      activities: user.activities,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.showTransactions = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.redirect("/");

    const user = new User(userId);
    await user.getProfile();
    await user.getTransactions();

    res.render("transactions", {
      title: "My Transactions – Savify",
      profile: user.profile,
      transactions: user.transactions,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
