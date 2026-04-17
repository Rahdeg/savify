const { Goal } = require("../models/goal");
const { User } = require("../models/user");

exports.listGoals = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.redirect("/");

    const user = new User(userId);
    await user.getGoals();

    res.render("goals", {
      title: "My Savings Goals – Savify",
      fetchedGoals: user.goals,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.showGoalDetails = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.redirect("/");

    const goalId = req.params.id;
    const goal = new Goal(goalId);

    const goalDetails = await goal.getGoalDetails();
    if (!goalDetails) return res.status(404).send("Goal not found");

    // Ensure the goal belongs to the logged-in user
    if (goalDetails.user_id && goalDetails.user_id !== userId) {
      return res.status(403).send("Access denied");
    }

    await goal.getTransactions();

    res.render("goal-details", {
      title: `${goal.goal_title} – Savify`,
      goal,
      transactions: goal.transactions,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.showTransactions = async (req, res) => {
  try {
    // Step 1: Create one Goal model using goal ID from URL.
    const goalId = req.params.id;
    const goal = new Goal(goalId);

    // Step 2: Load transactions only.
    await goal.getTransactions();

    // Step 3: Render transactions page.
    res.render("transactions", {
      title: "Transactions",
      transactions: goal.transactions,
      goalId,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
