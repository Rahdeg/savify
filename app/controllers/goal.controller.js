const { Goal } = require("../models/goal");
const { User } = require("../models/user");
const { UserAccount } = require("../models/userAccount");
const { PaymentMethod } = require("../models/paymentMethod");

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

    if (new Date(end_date) <= startDateObj) {
      return res.status(400).json({ error: "End date must be after start date." });
    }

    const goal = new Goal();
    await goal.createGoal({
      userId,
      goal_title: title,
      goal_description: description,
      scheduled_withdrawal_date: withdrawal_date_formatted,
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

exports.showContributePage = async (req, res) => {
  try {
    const goalId = req.params.id;
    const sessionUserId = req.session?.user?.user_id;

    const goal = new Goal(goalId);
    const goalDetails = await goal.getGoalDetails();

    if (!goalDetails) return res.status(404).send("Goal not found");

    if (goal.user_id !== sessionUserId) {
      return res.redirect(`/goals/${goalId}`);
    }

    if (goal.goal_status !== "active") {
      req.session.errorMessage = "Contributions can only be made to active goals.";
      return res.redirect(`/goals/${goalId}`);
    }

    const paymentMethods = await PaymentMethod.getActive();

    res.render("contribute-goal", {
      title: "Add Contribution",
      goal,
      paymentMethods,
      session: req.session,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.addContribution = async (req, res) => {
  try {
    const goalId = req.params.id;
    const { amount, payment_method_id } = req.body;
    const sessionUserId = req.session?.user?.user_id;

    const goal = new Goal(goalId);
    const goalDetails = await goal.getGoalDetails();

    if (!goalDetails) {
      req.session.errorMessage = "Goal not found.";
      return res.redirect("/goals");
    }

    if (goal.user_id !== sessionUserId) {
      req.session.errorMessage = "You are not authorised to contribute to this goal.";
      return res.redirect(`/goals/${goalId}`);
    }

    const result = await goal.contribute(amount, payment_method_id);

    req.session.successMessage = result.completed
      ? `£${result.amount} added — goal complete! Reference: ${result.reference}`
      : `£${result.amount} added successfully. Reference: ${result.reference}`;

    res.redirect(`/goals/${goalId}`);
  } catch (err) {
    console.error(err);
    req.session.errorMessage = err.isUserFacing
      ? err.message
      : "Unable to process contribution, please try again later.";
    res.redirect(`/goals/${req.params.id}`);
  }
};

exports.showWithdrawPage = async (req, res) => {
  try {
    const goalId = req.params.id;
    const sessionUserId = req.session?.user?.user_id;

    const goal = new Goal(goalId);
    const goalDetails = await goal.getGoalDetails();

    if (!goalDetails) return res.status(404).send("Goal not found");

    if (goal.user_id !== sessionUserId) {
      return res.status(403).redirect(`/goals/${goalId}`);
    }

    if (goal.goal_status !== "completed") {
      req.session.errorMessage = "Only completed goals can be withdrawn.";
      return res.redirect(`/goals/${goalId}`);
    }

    const accounts = await UserAccount.getByUser(sessionUserId);
    const bonus = await goal.checkBonusEligibility();

    res.render("withdraw-goal", {
      title: "Withdraw Goal",
      goal,
      accounts,
      bonus,
      session: req.session,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.withdrawGoal = async (req, res) => {
  try {
    // Step 1: Get goal ID from URL and reason from form body
    const goalId = req.params.id;
    const { reason_for_withdrawal, user_account_id } = req.body;
    const sessionUserId = req.session?.user?.user_id;

    // Step 2: Load the goal and verify ownership
    const goal = new Goal(goalId);
    const goalDetails = await goal.getGoalDetails();

    if (!goalDetails) {
      req.session.errorMessage = "Goal not found.";
      return res.redirect(`/goals`);
    }

    if (goal.user_id !== sessionUserId) {
      req.session.errorMessage = "You are not authorised to withdraw this goal.";
      return res.redirect(`/goals/${goalId}`);
    }

    // Step 3: Call the withdraw method — handles all DB logic
    const result = await goal.withdraw(reason_for_withdrawal, user_account_id);

    // Step 4: Redirect back to goal details with success message
    // req.session.successMessage = `Withdrawal of £${result.amount} successful! Reference: ${result.reference}`;
    req.session.successMessage = result.bonusEligible
      ? `Withdrawal successful! £${result.amount} + £${result.bonusAmount} bonus = £${result.totalAmount} total. Reference: ${result.reference}`
      : `Withdrawal of £${result.amount} successful! Reference: ${result.reference}`;
    res.redirect(`/goals/${goalId}`);

  } catch (err) {
    console.error(err);
    req.session.errorMessage = err.isUserFacing
      ? err.message
      : "Unable to complete that action right now, please try again later.";
    res.redirect(`/goals/${req.params.id}`);
  }
};
