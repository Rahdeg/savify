const goalModel = require("../models/goalModel");

exports.listGoals = async (req, res) => {
  try {
    const userId = 3;
    const results = await goalModel.getAllGoalsByUser(userId);
    res.render("goals", {
      title: "My Savings Goals",
      fetchedGoals: results,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.showGoalDetails = async (req, res) => {
  try {
    const goalId = req.params.id;
    const goalResult = await goalModel.getGoalById(goalId);

    if (goalResult.length === 0) return res.status(404).send("Goal not found");

    const transactionResult = await goalModel.getTransactionsByGoal(goalId);

    res.render("goal-details", {
      title: "Goal Details",
      goal: goalResult[0],
      transactions: transactionResult,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.showTransactions = async (req, res) => {
  try {
    const goalId = req.params.id;
    const results = await goalModel.getTransactionsByGoal(goalId);

    res.render("transactions", {
      title: "Transactions",
      transactions: results,
      goalId,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
