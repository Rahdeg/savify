const db = require("../services/db");

class PaymentMethod {
  constructor(row) {
    this.payment_method_id = row.payment_method_id;
    this.method_name = row.method_name;
    this.provider_name = row.provider_name;
  }

  static async getActive() {
    const rows = await db.query(
      `SELECT payment_method_id, method_name, provider_name
       FROM payment_method
       WHERE status = 'active'
       ORDER BY method_name, provider_name`
    );
    return rows.map((r) => new PaymentMethod(r));
  }
}

module.exports = { PaymentMethod };
