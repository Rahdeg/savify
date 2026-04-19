const db = require("../services/db");

class UserAccount {
  constructor(row) {
    this.account_id = row.account_id;
    this.user_id = row.user_id;
    this.account_name = row.account_name;
    this.bank_name = row.bank_name;
    this.account_number = row.account_number;
    this.sort_code = row.sort_code;
    this.account_type = row.account_type;
  }

  static async getByUser(userId) {
    const rows = await db.query(
      `SELECT account_id, user_id, account_name, bank_name, account_number, sort_code, account_type
       FROM user_account WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    return rows.map((r) => new UserAccount(r));
  }

  static async create({ userId, account_name, bank_name, account_number, sort_code, account_type }) {
    const result = await db.query(
      `INSERT INTO user_account (user_id, account_name, bank_name, account_number, sort_code, account_type)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, account_name, bank_name, account_number, sort_code, account_type || "current"]
    );
    return result.insertId;
  }
}

module.exports = { UserAccount };
