const { Goal } = require("../models/goal");
const { User } = require("../models/user");

exports.listGoals = async (req, res) => {
  try {
    const userId = req.session?.user?.user_id;

    if (!userId) {
      return res.redirect("/auth/login");
    }

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
      session: req.session,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.createGoal = async (req, res) => {
  try {
    // const userId = req.session?.user?.user_id || 3; // this is a temporary hardcoded value for testing until we implement dynamic session user assignment on login
    const userId = req.session?.user?.user_id;
    const { title, description, amount, category, saving_frequency, start_date, end_date, agreed_terms } = req.body;

    if (!title || !description || !amount || !category || !saving_frequency || !start_date || !end_date || !agreed_terms) {
      // return res.status(400).send("All fields are required.");
      return res.status(400).json({ error: "All fields are required." });
    }

    // convert string to Date object once
    const startDateObj = new Date(start_date);

    const validFrequencies = ["daily", "weekly", "monthly"];
    if (!validFrequencies.includes(saving_frequency)) {
      return res.status(400).json({ error: "Invalid saving frequency selected." });
    }

    // The withdrawal date is when the goal matures — that's the end date the user chose.
    // saving_frequency only describes how often the user makes deposits.
    const withdrawal_date_formatted = end_date;

    // if (new Date(end_date) <= startDateObj) {
    //   return res.status(400).json({ error: "End date must be after start date." });
    // } //  this will be uncommented later once we implement the withdrawal flow and can use the actual end date as the scheduled withdrawal date

    const goal = new Goal();
    await goal.createGoal({
      userId,
      goal_title: title,
      goal_description: description,
      // scheduled_withdrawal_date: withdrawal_date_formatted,
      scheduled_withdrawal_date: "2026-04-17", // this is hardcoded for testing purposes until we implement the withdrawal flow and can use the actual end date as the scheduled withdrawal date
      category_id: category,
      current_amount: 0,
      target_amount: amount,
      saving_frequency,
      start_date,
      end_date,
      goal_status: "active",
    });

    // return res.status(201).send({ 
    //   message: "Goal created successfully",
    //   status: "success", 
    //   goalId: goal.goal_id, 
    //   goal_title: title, 
    //   scheduled_withdrawal_date: withdrawal_date_formatted 
    // });

    return res.status(201).json({ 
      message: "Goal created successfully",
      status: "success",
      goalId: goal.goal_id,
      goal_title: title,
      scheduled_withdrawal_date: withdrawal_date_formatted
    });

    // req.session.success = "Goal created successfully";
    // req.session.withdrawal_date = withdrawal_date_formatted;

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
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

exports.withdrawGoal = async (req, res) => {
  try {
    // Step 1: Get goal ID from URL and reason from form body
    const goalId = req.params.id;
    const { reason_for_withdrawal } = req.body;

    // Step 2: Load the goal model
    const goal = new Goal(goalId);

    // Step 3: Call the withdraw method — handles all DB logic
    const result = await goal.withdraw(reason_for_withdrawal);

    // Step 4: Redirect back to goal details with success message
    req.session.successMessage = `Withdrawal of £${result.amount} successful! Reference: ${result.reference}`;
    res.redirect(`/goals/${goalId}`);

  } catch (err) {
    // If not eligible or DB error, redirect back with error
    req.session.errorMessage = err.message;
    res.redirect(`/goals/${req.params.id}`);
  }
};
