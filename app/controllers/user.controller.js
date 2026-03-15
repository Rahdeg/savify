const { User } = require("../models/user");

exports.showDashboard = async (req, res) => {
  try {
    // Step 1: Pick current user ID (replace with auth user later).
    const userId = 3;

    // Step 2: Create one User model object.
    const user = new User(userId);

    // Step 3: Load all related dashboard data through model methods.
    await user.getProfile();
    await user.getGoals();
    await user.getRecentActivity();

    // Step 4: Render view with clean model properties.
    res.render("dashboard", {
      title: "Savify ",
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
    // Step 1: Pick current user ID (replace with auth user later).
    const userId = 3;

    // Step 2: Create one User model object.
    const user = new User(userId);

    // Step 3: Load profile and all user transactions.
    await user.getProfile();
    await user.getTransactions();

    // Step 4: Render transactions page.
    res.render("transactions", {
      title: "My Transactions",
      profile: user.profile,
      transactions: user.transactions,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
