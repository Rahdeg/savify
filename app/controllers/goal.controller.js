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

exports.createGoal = async (req, res) => {
  let goal_status = false;
  let withdrawal_date;

  try {
    // const userId = req.session?.user?.user_id || 3; // this is a temporary hardcoded value for testing until we implement dynamic session user assignment on login
    const userId = req.session?.user?.user_id;
    const { title, description, amount, category, duration, start_date, end_date, agreed_terms } = req.body;
    const agreed_terms_boolean = agreed_terms === "on" ? true : false;

    if (!title || !description || !amount || !category || !duration || !start_date || !end_date || !agreed_terms) {
      // return res.status(400).send("All fields are required.");
      return res.status(400).json({ error: "All fields are required." });
    }

    // convert string to Date object once
    const startDateObj = new Date(start_date);

    if (duration === "weekly") {
      withdrawal_date = new Date(startDateObj);
      withdrawal_date.setDate(startDateObj.getDate() + 7);
    } else if (duration === "monthly") {
      withdrawal_date = new Date(startDateObj);
      withdrawal_date.setDate(startDateObj.getDate() + 30);
    } else if (duration === "quarterly") {
      withdrawal_date = new Date(startDateObj);
      withdrawal_date.setDate(startDateObj.getDate() + 90);
    } else if (duration === "yearly") {
      withdrawal_date = new Date(startDateObj);
      withdrawal_date.setDate(startDateObj.getDate() + 365);
    } else {
      return res.status(400).json({ error: "Invalid duration selected." });
      // return res.status(400).send("Invalid duration selected.");
    }

    const withdrawal_date_formatted = withdrawal_date.toISOString().split("T")[0];

    if (new Date(end_date) <= startDateObj) {
      // return res.status(400).send("End date must be after start date.");
      return res.status(400).json({ error: "End date must be after start date." });
    } else {
      goal_status = true;
    }

    const goal = new Goal();
    await goal.createGoal({
      userId,
      goal_title: title,
      goal_description: description,
      scheduled_withdrawal_date: withdrawal_date_formatted,
      category_id: category,
      current_amount: amount,
      target_amount: amount,
      saving_frequency: duration,
      start_date,
      end_date,
      agreed_terms: agreed_terms_boolean,
      goal_status
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
