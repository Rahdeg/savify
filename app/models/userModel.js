const db = require("../services/db");

exports.getUserDashboard = async (userId) => {
  const sql = `
    SELECT 
      u.full_name,
      COALESCE(SUM(g.current_amount), 0) AS total_savings,
      COUNT(g.goal_id) AS total_goals
    FROM users u
    LEFT JOIN savings_goals g ON u.user_id = g.user_id
    WHERE u.user_id = ?
    GROUP BY u.user_id
  `;
  return db.query(sql, [userId]);
};

exports.getRecentActivity = async (userId) => {
  const sql = `
    SELECT activity_type, activity_message, created_at
    FROM activity_logs
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 5
  `;
  return db.query(sql, [userId]);
};
