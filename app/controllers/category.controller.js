const Category = require("../models/category");

async function showCategories(req, res) {
  try {
    const categories = await Category.getAllCategories();
    console.log(categories); // check this prints in your terminal
    res.render("create-savings-goal", { 
      title: "Create Goal",
      categories 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
}

module.exports = { showCategories };