const { User } = require("../models/user");

exports.showDashboard = async (req, res) => {
  try {
    // Step 1: Get current logged-in user ID from session.
    const userId = req.session?.user?.user_id;
    // const userId = req.session?.user?.user_id || "3"; // this is a temporary hardcoded value for testing until we implement dynamic session user assignment on login
    // console.log("Dashboard accessed by user ID:", userId);
    if (!userId) return res.redirect("/auth/login");
    

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
    // Step 1: Get current logged-in user ID from session.
    const userId = req.session?.user?.user_id;
    if (!userId) return res.redirect("/auth/login");

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

exports.showContributions = async (req, res) => {
  try {
    const userId = req.session?.user?.user_id;
    if (!userId) return res.redirect("/auth/login");

    const user = new User(userId);
    await user.getProfile();
    await user.getContributions();

    // Compute summary stats for the page header
    const totalContributed = user.contributions.reduce(
      (sum, c) => sum + (parseFloat(c.amount) || 0),
      0
    );

    res.render("contributions", {
      title: "My Contributions",
      profile: user.profile,
      contributions: user.contributions,
      totalContributed,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
