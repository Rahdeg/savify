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

exports.showProfile = async (req, res) => {
  try {
    const userId = req.session?.user?.user_id;
    if (!userId) return res.redirect("/auth/login");

    const user = new User(userId);
    await user.getProfile();

    res.render("profile", {
      title: "My Profile",
      profile: user.profile,
      session: req.session,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.session?.user?.user_id;
    const { full_name, occupation } = req.body;

    if (!full_name || !full_name.trim()) {
      req.session.errorMessage = "Full name is required.";
      return res.redirect("/profile");
    }

    const user = new User(userId);
    await user.updateProfile({ full_name: full_name.trim(), occupation });

    req.session.user.full_name = full_name.trim();
    req.session.successMessage = "Profile updated successfully.";
    res.redirect("/profile");
  } catch (err) {
    console.error(err);
    req.session.errorMessage = "Unable to update profile, please try again.";
    res.redirect("/profile");
  }
};

exports.deleteUserAccount = async (req, res) => {
  try {
    const userId = req.session?.user?.user_id;
    const user = new User(userId);

    const blockReason = await user.getDeletionBlockReason();
    if (blockReason) {
      req.session.errorMessage = blockReason;
      return res.redirect("/profile");
    }

    await user.deleteAccount();

    req.session.destroy(() => {
      res.redirect("/");
    });
  } catch (err) {
    console.error(err);
    req.session.errorMessage = "Unable to delete account, please try again.";
    res.redirect("/profile");
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
