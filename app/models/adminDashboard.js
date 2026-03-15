const db = require("../services/db");

class AdminUserSummary {
  user_id;
  full_name;
  email;
  total_goals;
  active_goals;
  inactive_goals;

  constructor(row) {
    this.user_id = row.user_id;
    this.full_name = row.full_name;
    this.email = row.email;
    this.total_goals = Number(row.total_goals || 0);
    this.active_goals = Number(row.active_goals || 0);
    this.inactive_goals = Number(row.inactive_goals || 0);
  }
}

class AdminDashboard {
  stats;
  users = [];

  async getStats() {
    if (!this.stats) {
      const sql = `
        SELECT
          (SELECT COUNT(*) FROM users WHERE role = 'user') AS total_users,
          (SELECT COUNT(*) FROM savings_goal) AS total_goals,
          (SELECT COALESCE(SUM(current_amount), 0) FROM savings_goal) AS total_savings,
          (SELECT COUNT(*) FROM withdrawals) AS total_withdrawals
      `;

      const results = await db.query(sql, []);
      this.stats = results[0] || {
        total_users: 0,
        total_goals: 0,
        total_savings: 0,
        total_withdrawals: 0,
      };
    }

    return this.stats;
  }

  async getUsersWithGoalStats() {
    if (!this.users.length) {
      const sql = `
        SELECT
          u.user_id,
          u.full_name,
          u.email,
          COUNT(g.goal_id) AS total_goals,
          SUM(CASE WHEN g.goal_status = 'active' THEN 1 ELSE 0 END) AS active_goals,
          SUM(CASE WHEN g.goal_status IN ('completed', 'withdrawn') THEN 1 ELSE 0 END) AS inactive_goals
        FROM users u
        LEFT JOIN savings_goal g ON u.user_id = g.user_id
        WHERE u.role = 'user'
        GROUP BY u.user_id
        ORDER BY u.full_name ASC
      `;

      const results = await db.query(sql, []);
      this.users = results.map((row) => new AdminUserSummary(row));
    }

    return this.users;
  }
}

module.exports = {
  AdminDashboard,
};
