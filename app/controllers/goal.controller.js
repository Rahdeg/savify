const { Goal } = require("../models/goal");
const { User } = require("../models/user");

exports.listGoals = async (req, res) => {
  try {
    // Step 1: Pick the current user ID (replace later with logged-in user ID).
    const userId = 3;

    // Step 2: Create a collection model and load all goals for this user.
    const user = new User(userId);
    await user.getGoals();

    // Step 3: Send mapped model objects to the view.
    res.render("goals", {
      title: "My Savings Goals",
      fetchedGoals: user.goals,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.showGoalDetails = async (req, res) => {
  try {
    // Step 1: Build one Goal model from route param.
    const goalId = req.params.id;
    const goal = new Goal(goalId);

    // Step 2: Load this goal's details from DB.
    const goalDetails = await goal.getGoalDetails();
    if (!goalDetails) return res.status(404).send("Goal not found");

    // Step 3: Load this goal's related transactions.
    await goal.getTransactions();

    // Step 4: Render single-goal page.
    res.render("goal-details", {
      title: "Goal Details",
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
