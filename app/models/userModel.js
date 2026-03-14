const db = require("../services/db");

exports.getUserDashboard = async (userId) => {
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
  return db.query(sql, [userId]);
};

exports.getRecentActivity = async (userId) => {
  const sql = `
    SELECT activity_type, activity_message, created_at
    FROM activity_log
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 5
  `;
  return db.query(sql, [userId]);
};

exports.getUserProfile = async (userId) => {
  const sql = `
    SELECT full_name, email, created_at
    FROM users
    WHERE user_id = ?
  `;
  return db.query(sql, [userId]);
};

//user savings goal model
exports.getAllGoalsByUser = async (userId) => {
  const sql = `
    SELECT goal_id, goal_name, target_amount, current_amount, created_at
    FROM savings_goal
    WHERE user_id = ?
  `;
  return db.query(sql, [userId]);
};
