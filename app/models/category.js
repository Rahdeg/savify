const db = require("../services/db");

class Category {
  constructor(categoryId) {
    this.category_id = Number(categoryId);
  }

  static fromRow(row) {
    const cat = new Category(row.category_id);
    cat.category_name = row.category_name;
    cat.description = row.description;
    return cat;
  }

  static async getAllCategories() {
    const sql = `
      SELECT *
      FROM goal_category
    `;
    const results = await db.query(sql);
    return results.map(row => Category.fromRow(row));
  }

  // Get a single category by id
  async getCategory() {
    if (this.category_name) return this;

    const sql = `
      SELECT *
      FROM goal_category
      WHERE category_id = ?
    `;
    const results = await db.query(sql, [this.category_id]);
    console.log("Category query results:", results); // Debug log
    if (!results.length) return null;

    Object.assign(this, Category.fromRow(results[0]));
    return this;
  }
}

module.exports = Category;