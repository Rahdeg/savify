const db = require("../services/db");

exports.getAdminStats = async () => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM users WHERE role = 'user') AS total_users,
      (SELECT COUNT(*) FROM savings_goal) AS total_goals,
      (SELECT COALESCE(SUM(current_amount), 0) FROM savings_goal) AS total_savings,
      (SELECT COUNT(*) FROM withdrawals) AS total_withdrawals
  `;
  return db.query(sql, []);
};

exports.getAllUsersWithGoalStats = async () => {
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
  return db.query(sql, []);
};
