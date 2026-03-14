const db = require("../services/db");

exports.getAllGoalsByUser = async (userId) => {
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
  return db.query(sql, [userId]);
};

exports.getGoalById = async (goalId) => {
  const sql = `
    SELECT 
      g.goal_id,
      g.goal_title,
      g.goal_description,
      gc.category_name,
      g.target_amount,
      g.current_amount,
      g.saving_frequency,
      g.duration_months,
      g.start_date,
      g.end_date,
      g.scheduled_withdrawal_date,
      g.goal_status
    FROM savings_goal g
    JOIN goal_category gc ON g.category_id = gc.category_id
    WHERE g.goal_id = ?
  `;
  return db.query(sql, [goalId]);
};

exports.getTransactionsByGoal = async (goalId) => {
  const sql = `
    SELECT 
      t.transaction_id,
      t.transaction_type,
      t.amount,
      t.transaction_reference,
      t.transaction_status,
      t.transaction_date,
      pm.method_name,
      pm.provider_name
    FROM transactions t
    JOIN payment_methods pm ON t.payment_method_id = pm.payment_method_id
    WHERE t.goal_id = ?
    ORDER BY t.transaction_date DESC
  `;
  return db.query(sql, [goalId]);
};
