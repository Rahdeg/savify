const db = require("../services/db");

class Goal {
  goal_id;
  user_id;
  goal_title;
  goal_description;
  category_name;
  target_amount;
  current_amount;
  saving_frequency;
  duration_months;
  start_date;
  end_date;
  scheduled_withdrawal_date;
  goal_status;
  transactions = [];

  constructor(goalId) {
    this.goal_id = Number(goalId);
  }

  static fromRow(row) {
    const goal = new Goal(row.goal_id);
    goal.user_id = row.user_id;
    goal.goal_title = row.goal_title;
    goal.goal_description = row.goal_description;
    goal.category_name = row.category_name;
    goal.target_amount = row.target_amount;
    goal.current_amount = row.current_amount;
    goal.saving_frequency = row.saving_frequency;
    goal.duration_months = row.duration_months;
    goal.start_date = row.start_date;
    goal.end_date = row.end_date;
    goal.scheduled_withdrawal_date = row.scheduled_withdrawal_date;
    goal.goal_status = row.goal_status;
    return goal;
  }

  async getGoalDetails() {
    if (this.goal_title) return this;

    const sql = `
      SELECT
        g.goal_id,
        g.user_id,
        g.goal_title,
        g.goal_description,
        gc.category_name,
        g.target_amount,
        g.current_amount,
        g.saving_frequency,
        g.start_date,
        g.end_date,
        g.scheduled_withdrawal_date,
        g.goal_status
      FROM savings_goal g
      JOIN goal_category gc ON g.category_id = gc.category_id
      WHERE g.goal_id = ?
    `;

    const results = await db.query(sql, [this.goal_id]);
    if (!results.length) return null;

    Object.assign(this, Goal.fromRow(results[0]));
    return this;
  }


async createGoal({ userId, goal_title, goal_description, scheduled_withdrawal_date, category_id, current_amount, target_amount, saving_frequency, start_date, end_date }) {
  const sql = `
    INSERT INTO savings_goal (user_id, goal_title, goal_description, scheduled_withdrawal_date, category_id, current_amount, target_amount, saving_frequency, start_date, end_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    userId,
    goal_title,
    goal_description,
    scheduled_withdrawal_date,
    category_id,
    current_amount,
    target_amount,
    saving_frequency,
    start_date,
    end_date,
  ].map((p) => (p === undefined ? null : p));

  const result = await db.query(sql, params);
  this.goal_id = result.insertId;
  return this.goal_id;
}

  async getTransactions() {
    if (this.transactions.length) return this.transactions;

    const sql = `
      SELECT
        t.transaction_id,
        t.goal_id,
        t.transaction_type,
        t.amount,
        t.transaction_reference,
        t.transaction_status,
        t.transaction_date,
        g.goal_title,
        pm.method_name,
        pm.provider_name
      FROM transactions t
      JOIN savings_goal g ON t.goal_id = g.goal_id
      LEFT JOIN payment_method pm ON t.payment_method_id = pm.payment_method_id
      WHERE t.goal_id = ?
      ORDER BY t.transaction_date DESC
    `;

    this.transactions = await db.query(sql, [this.goal_id]);
    return this.transactions;
  }

  async withdraw(reasonForWithdrawal, userAccountId) {
  // Step 1: Make sure goal details are loaded
  await this.getGoalDetails();

  // Step 2: Check eligibility — must be completed
  // if (this.goal_status !== 'completed') {
  //   throw new Error('Goal is not eligible for withdrawal. It must be completed first.');
  // } //   this will be uncommented later.

  const amount = this.current_amount;
  const reference = 'WDR' + Date.now();

  // Step 3: Update goal status to withdrawn and reset current amount
  await db.query(
    `UPDATE savings_goal
     SET goal_status = 'withdrawn', current_amount = 0
     WHERE goal_id = ?`,
    [this.goal_id]
  );

  // Step 4: Record in withdrawal table including the user's chosen payout account
  await db.query(
    `INSERT INTO withdrawal
      (requested_amount, approved_amount, reason_for_withdrawal, eligibility_status, withdrawal_status, processed_at, goal_id, user_account_id)
     VALUES (?, ?, ?, 'eligible', 'approved', NOW(), ?, ?)`,
    [amount, amount, reasonForWithdrawal || null, this.goal_id, userAccountId || null]
  );

  // Step 5: Record in transactions table
  await db.query(
    `INSERT INTO transactions
      (transaction_type, amount, transaction_reference, transaction_status, goal_id)
     VALUES ('withdrawal', ?, ?, 'completed', ?)`,
    [amount, reference, this.goal_id]
  );

  // Step 6: Log in activity_log
  await db.query(
    `INSERT INTO activity_log (user_id, activity_type, activity_message)
     VALUES (?, 'Withdrawal', ?)`,
    [this.user_id, `Withdrawal of ${amount} processed for goal ID ${this.goal_id}`]
  );

  // Step 7: Update local state
  this.goal_status = 'withdrawn';
  this.current_amount = 0;

  return { amount, reference };
}
}


module.exports = {
  Goal,
};
