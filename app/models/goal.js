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

  get progressPercent() {
    const target = parseFloat(this.target_amount) || 0;
    const current = parseFloat(this.current_amount) || 0;
    if (target <= 0) return 0;
    return Math.min(100, Math.round((current / target) * 100));
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

  async contribute(amount, paymentMethodId) {
    // Step 1: Make sure goal details are loaded
    await this.getGoalDetails();

    // Step 2: Validate
    const contribution = parseFloat(amount);
    if (!contribution || contribution <= 0) {
      const err = new Error("Contribution amount must be greater than zero.");
      err.isUserFacing = true;
      throw err;
    }
    if (this.goal_status !== "active") {
      const err = new Error("Contributions can only be made to active goals.");
      err.isUserFacing = true;
      throw err;
    }

    const reference = "DEP" + Date.now();
    const newTotal = parseFloat(this.current_amount) + contribution;
    const reachedTarget = newTotal >= parseFloat(this.target_amount);
    const newStatus = reachedTarget ? "completed" : "active";

    // Step 3: Update current_amount (and status if target reached)
    await db.query(
      `UPDATE savings_goal
       SET current_amount = ?, goal_status = ?
       WHERE goal_id = ?`,
      [newTotal, newStatus, this.goal_id]
    );

    // Step 4: Record transaction
    await db.query(
      `INSERT INTO transactions
        (transaction_type, amount, transaction_reference, transaction_status, goal_id, payment_method_id)
       VALUES ('deposit', ?, ?, 'completed', ?, ?)`,
      [contribution, reference, this.goal_id, paymentMethodId || null]
    );

    // Step 5: Log activity
    await db.query(
      `INSERT INTO activity_log (user_id, activity_type, activity_message)
       VALUES (?, 'Deposit', ?)`,
      [this.user_id, `Contribution of £${contribution} added to goal "${this.goal_title}"`]
    );

    // Step 6: Update local state
    this.current_amount = newTotal;
    this.goal_status = newStatus;

    return { amount: contribution, reference, newTotal, completed: reachedTarget };
  }

  async checkBonusEligibility() {
    await this.getGoalDetails();

    const BONUS_PERCENTAGE = 3;
    const CONSISTENCY_THRESHOLD = 0.75;

    const deposits = await db.query(
      `SELECT DATE(transaction_date) as contribution_date
       FROM transactions
       WHERE goal_id = ? AND transaction_type = 'deposit'
       ORDER BY transaction_date ASC`,
      [this.goal_id]
    );

    if (!deposits.length) {
      return { eligible: false, bonusAmount: 0, bonusPercentage: BONUS_PERCENTAGE, actualCount: 0, expectedCount: 0 };
    }

    const startDate = new Date(this.start_date);
    const endDate = new Date(this.end_date);
    const expectedCount = this._calculateExpectedPeriods(startDate, endDate, this.saving_frequency);
    const actualCount = this._countUniquePeriods(
      deposits.map(d => new Date(d.contribution_date)),
      this.saving_frequency
    );

    const eligible = expectedCount > 0 && (actualCount / expectedCount) >= CONSISTENCY_THRESHOLD;
    const bonusAmount = eligible
      ? parseFloat((parseFloat(this.current_amount) * BONUS_PERCENTAGE / 100).toFixed(2))
      : 0;

    return { eligible, bonusAmount, bonusPercentage: BONUS_PERCENTAGE, actualCount, expectedCount };
  }

  _calculateExpectedPeriods(startDate, endDate, frequency) {
    const msPerDay = 24 * 60 * 60 * 1000;
    const days = Math.ceil((endDate - startDate) / msPerDay) + 1;

    switch (frequency) {
      case 'daily':
        return days;
      case 'weekly':
        return Math.ceil(days / 7);
      case 'monthly': {
        const months = (endDate.getFullYear() - startDate.getFullYear()) * 12
          + (endDate.getMonth() - startDate.getMonth()) + 1;
        return Math.max(1, months);
      }
      default:
        return 1;
    }
  }

  _countUniquePeriods(dates, frequency) {
    const keys = new Set();
    for (const d of dates) {
      let key;
      switch (frequency) {
        case 'daily':
          key = d.toISOString().slice(0, 10);
          break;
        case 'weekly': {
          const jan4 = new Date(d.getFullYear(), 0, 4);
          const week = Math.ceil(((d - jan4) / 86400000 + jan4.getDay() + 1) / 7);
          key = `${d.getFullYear()}-W${week}`;
          break;
        }
        case 'monthly':
          key = `${d.getFullYear()}-${d.getMonth()}`;
          break;
        default:
          key = d.toISOString().slice(0, 10);
      }
      keys.add(key);
    }
    return keys.size;
  }

  async withdraw(reasonForWithdrawal, userAccountId) {
    // Step 1: Make sure goal details are loaded
    await this.getGoalDetails();

    // Step 2: Check eligibility — must be completed
    if (this.goal_status !== 'completed') {
      const err = new Error('Only completed goals can be withdrawn.');
      err.isUserFacing = true;
      throw err;
    }

    // Step 3: Check bonus eligibility
    const bonus = await this.checkBonusEligibility();
    const baseAmount = parseFloat(this.current_amount);
    const totalAmount = parseFloat((baseAmount + bonus.bonusAmount).toFixed(2));
    const reference = 'WDR' + Date.now();

    // Step 4: Update goal status to withdrawn and reset current amount
    await db.query(
      `UPDATE savings_goal
       SET goal_status = 'withdrawn', current_amount = 0
       WHERE goal_id = ?`,
      [this.goal_id]
    );

    // Step 5: Record in withdrawal table with total payout amount
    await db.query(
      `INSERT INTO withdrawal
        (requested_amount, approved_amount, reason_for_withdrawal, eligibility_status, withdrawal_status, processed_at, goal_id, user_account_id)
       VALUES (?, ?, ?, 'eligible', 'approved', NOW(), ?, ?)`,
      [baseAmount, totalAmount, reasonForWithdrawal || null, this.goal_id, userAccountId || null]
    );

    // Step 6: Record base withdrawal transaction
    await db.query(
      `INSERT INTO transactions
        (transaction_type, amount, transaction_reference, transaction_status, goal_id)
       VALUES ('withdrawal', ?, ?, 'completed', ?)`,
      [baseAmount, reference, this.goal_id]
    );

    // Step 7: If eligible, record bonus in bonus table and transactions
    if (bonus.eligible) {
      await db.query(
        `INSERT INTO bonus (bonus_percentage, bonus_amount, eligibility_status, goal_id)
         VALUES (?, ?, 'eligible', ?)`,
        [bonus.bonusPercentage, bonus.bonusAmount, this.goal_id]
      );

      await db.query(
        `INSERT INTO transactions
          (transaction_type, amount, transaction_reference, transaction_status, goal_id)
         VALUES ('bonus', ?, ?, 'completed', ?)`,
        [bonus.bonusAmount, 'BON' + Date.now(), this.goal_id]
      );
    }

    // Step 8: Log in activity_log
    const logMessage = bonus.eligible
      ? `Withdrawal of £${baseAmount} + £${bonus.bonusAmount} bonus processed for goal "${this.goal_title}"`
      : `Withdrawal of £${baseAmount} processed for goal "${this.goal_title}"`;

    await db.query(
      `INSERT INTO activity_log (user_id, activity_type, activity_message)
       VALUES (?, 'Withdrawal', ?)`,
      [this.user_id, logMessage]
    );

    // Step 9: Update local state
    this.goal_status = 'withdrawn';
    this.current_amount = 0;

    return { amount: baseAmount, bonusAmount: bonus.bonusAmount, totalAmount, bonusEligible: bonus.eligible, reference };
  }
}


module.exports = {
  Goal,
};
