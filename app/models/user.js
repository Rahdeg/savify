const db = require("../services/db");
const bcrypt = require("bcryptjs");
const { Goal } = require("./goal");

class User {
  user_id;
  email;
  profile;
  dashboard;
  activities = [];
  goals = [];
  transactions = [];
  contributions = [];
  hasLoadedActivities = false;
  hasLoadedGoals = false;
  hasLoadedTransactions = false;
  hasLoadedContributions = false;

  constructor(userIdentifier) {
    const parsedId = Number(userIdentifier);
    if (Number.isInteger(parsedId) && parsedId > 0) {
      this.user_id = parsedId;
      this.email = null;
      return;
    }

    this.user_id = null;
    this.email =
      typeof userIdentifier === "string"
        ? userIdentifier.trim().toLowerCase()
        : null;
  }

  async getProfile() {
    if (!this.profile) {
      if (!this.user_id && !this.email) return null;

      const sql = this.user_id
        ? "SELECT * FROM users WHERE user_id = ?"
        : "SELECT * FROM users WHERE email = ?";
      const params = [this.user_id || this.email];

      const results = await db.query(sql, params);
      this.profile = results[0] || null;

      if (this.profile) {
        this.user_id = this.profile.user_id;
        this.email = this.profile.email;
      }
    }
    return this.profile;
  }

  // Get an existing user id from an email address, or return false if not found
  async getIdFromEmail() {
    var sql = "SELECT id FROM Users WHERE Users.email = ?";
    const result = await db.query(sql, [this.email]);
    // TODO LOTS OF ERROR CHECKS HERE..
    if (JSON.stringify(result) != "[]") {
      this.id = result[0].id;
      return this.id;
    } else {
      return false;
    }
  }

  // Add a password to an existing user
  async setUserPassword(password) {
    const pw = await bcrypt.hash(password, 10);
    var sql = "UPDATE Users SET password = ? WHERE Users.id = ?";
    const result = await db.query(sql, [pw, this.id]);
    return true;
  }

  // Add a new record to the users table
  async addUser(password, fullName = null, occupation = null) {
    if (!this.email || !password) return false;

    const existingSql = "SELECT user_id FROM users WHERE email = ? LIMIT 1";
    const existing = await db.query(existingSql, [this.email]);
    if (existing.length > 0) return false;

    const pw = await bcrypt.hash(password, 10);
    const defaultName = fullName || this.email.split("@")[0] || "New User";

    const sql = `
      INSERT INTO users (full_name, email, occupation, password_hash, role, is_verified)
      VALUES (?, ?, ?, ?, 'user', 0)
    `;
    const result = await db.query(sql, [defaultName, this.email, occupation, pw]);
    this.user_id = result.insertId;
    return true;
  }

  // Test a submitted password against a stored password
  async authenticate(submitted) {}

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

  async getContributions() {
    if (this.hasLoadedContributions) return this.contributions;

    const sql = `
      SELECT
        t.transaction_id,
        t.amount,
        t.transaction_reference,
        t.transaction_status,
        t.transaction_date,
        g.goal_id,
        g.goal_title,
        gc.category_name,
        pm.method_name,
        pm.provider_name
      FROM transactions t
      JOIN savings_goal g ON t.goal_id = g.goal_id
      JOIN goal_category gc ON g.category_id = gc.category_id
      LEFT JOIN payment_method pm ON t.payment_method_id = pm.payment_method_id
      WHERE g.user_id = ?
        AND t.transaction_type = 'deposit'
      ORDER BY t.transaction_date DESC, t.transaction_id DESC
    `;

    this.contributions = await db.query(sql, [this.user_id]);
    this.hasLoadedContributions = true;
    return this.contributions;
  }

  async updateProfile({ full_name, occupation }) {
    await db.query(
      `UPDATE users SET full_name = ?, occupation = ? WHERE user_id = ?`,
      [full_name, occupation || null, this.user_id]
    );
    if (this.profile) {
      this.profile.full_name = full_name;
      this.profile.occupation = occupation;
    }
  }

  /**
   * Returns a blocking reason string if the account cannot be deleted, or null if safe to proceed.
   * Blocks if the user has: pending transactions, pending withdrawals, active goals, or completed goals not yet withdrawn.
   */
  async getDeletionBlockReason() {
    const [txRow] = await db.query(
      `SELECT COUNT(*) AS cnt FROM transactions t
       JOIN savings_goal g ON t.goal_id = g.goal_id
       WHERE g.user_id = ? AND t.transaction_status = 'pending'`,
      [this.user_id]
    );
    if (txRow.cnt > 0) return 'You have pending transactions. Please wait for them to complete before deleting your account.';

    const [wdRow] = await db.query(
      `SELECT COUNT(*) AS cnt FROM withdrawal w
       JOIN savings_goal g ON w.goal_id = g.goal_id
       WHERE g.user_id = ? AND w.withdrawal_status = 'pending'`,
      [this.user_id]
    );
    if (wdRow.cnt > 0) return 'You have a pending withdrawal in progress. Please wait for it to be processed first.';

    const [activeRow] = await db.query(
      `SELECT COUNT(*) AS cnt FROM savings_goal WHERE user_id = ? AND goal_status = 'active'`,
      [this.user_id]
    );
    if (activeRow.cnt > 0) return 'You have active savings goals. Please complete or cancel them before deleting your account.';

    const [completedRow] = await db.query(
      `SELECT COUNT(*) AS cnt FROM savings_goal WHERE user_id = ? AND goal_status = 'completed'`,
      [this.user_id]
    );
    if (completedRow.cnt > 0) return 'You have completed goals awaiting withdrawal. Please withdraw your funds before deleting your account.';

    return null;
  }

  async deleteAccount() {
    await db.query(
      `DELETE FROM bonus WHERE goal_id IN (SELECT goal_id FROM savings_goal WHERE user_id = ?)`,
      [this.user_id]
    );
    await db.query(
      `DELETE FROM transactions WHERE goal_id IN (SELECT goal_id FROM savings_goal WHERE user_id = ?)`,
      [this.user_id]
    );
    await db.query(
      `DELETE FROM withdrawal WHERE goal_id IN (SELECT goal_id FROM savings_goal WHERE user_id = ?)`,
      [this.user_id]
    );
    await db.query(`DELETE FROM activity_log WHERE user_id = ?`, [this.user_id]);
    await db.query(`DELETE FROM savings_goal WHERE user_id = ?`, [this.user_id]);
    await db.query(`DELETE FROM user_account WHERE user_id = ?`, [this.user_id]);
    await db.query(`DELETE FROM email_verifications WHERE user_id = ?`, [this.user_id]);
    await db.query(`DELETE FROM users WHERE user_id = ?`, [this.user_id]);
  }
}

module.exports = {
  User,
};
