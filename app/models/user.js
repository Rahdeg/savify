const db = require("../services/db");
const { Goal } = require("./goal");

class User {
  user_id;
  profile;
  dashboard;
  activities = [];
  goals = [];
  transactions = [];
  hasLoadedActivities = false;
  hasLoadedGoals = false;
  hasLoadedTransactions = false;

  constructor(userId) {
    this.user_id = Number(userId);
  }

  async getProfile() {
    if (!this.profile) {
      const sql = `
        SELECT full_name, email, created_at
        FROM users
        WHERE user_id = ?
      `;
      const results = await db.query(sql, [this.user_id]);
      this.profile = results[0] || null;
    }
    return this.profile;
  }

  async getDashboard() {
    // Reuse model data if already loaded to avoid another query.
    if (this.profile && this.hasLoadedGoals) {
      this.dashboard = {
        full_name: this.profile.full_name || "",
        total_savings: this.goals.reduce(
          (sum, goal) => sum + (Number(goal.current_amount) || 0),
          0,
        ),
        total_goals: this.goals.length,
      };
      return this.dashboard;
    }

    if (!this.dashboard) {
      const sql = `
        SELECT
          u.full_name,
          COALESCE(SUM(g.current_amount), 0) AS total_savings,
          COUNT(g.goal_id) AS total_goals
        FROM users u
        LEFT JOIN savings_goal g ON u.user_id = g.user_id
        WHERE u.user_id = ?
        GROUP BY u.user_id
      `;
      const results = await db.query(sql, [this.user_id]);
      this.dashboard = results[0] || {
        full_name: "",
        total_savings: 0,
        total_goals: 0,
      };
    }
    return this.dashboard;
  }

  async getRecentActivity() {
    if (this.hasLoadedActivities) return this.activities;

    const sql = `
      SELECT activity_type, activity_message, created_at
      FROM activity_log
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 5
    `;
    this.activities = await db.query(sql, [this.user_id]);
    this.hasLoadedActivities = true;
    return this.activities;
  }

  async getGoals() {
    if (this.hasLoadedGoals) return this.goals;

    const sql = `
      SELECT
        g.goal_id,
        g.goal_title,
        gc.category_name,
        g.target_amount,
        g.current_amount,
        g.goal_status,
        g.end_date
      FROM savings_goal g
      JOIN goal_category gc ON g.category_id = gc.category_id
      WHERE g.user_id = ?
      ORDER BY g.created_at DESC
    `;
    const results = await db.query(sql, [this.user_id]);
    this.goals = results.map((row) => Goal.fromRow(row));
    this.hasLoadedGoals = true;
    return this.goals;
  }

  async getTransactions() {
    if (this.hasLoadedTransactions) return this.transactions;

    const sql = `
      SELECT
        t.transaction_id,
        t.transaction_type,
        t.amount,
        t.transaction_reference,
        t.transaction_status,
        t.transaction_date,
        g.goal_id,
        g.goal_title,
        pm.method_name,
        pm.provider_name
      FROM transactions t
      JOIN savings_goal g ON t.goal_id = g.goal_id
      LEFT JOIN payment_method pm ON t.payment_method_id = pm.payment_method_id
      WHERE g.user_id = ?
      ORDER BY t.transaction_date DESC, t.transaction_id DESC
    `;

    this.transactions = await db.query(sql, [this.user_id]);
    this.hasLoadedTransactions = true;
    return this.transactions;
  }
}

module.exports = {
  User,
};
