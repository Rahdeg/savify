// Import express.js
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const goalRoutes = require("./routes/goalRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Create express app
var app = express();
// Use the Pug templating engine
app.set("view engine", "pug");
app.set("views", "./app/views");

// Use the routes defined in the userRoutes, goalRoutes, and adminRoutes files
app.use("/", userRoutes);
app.use("/goals", goalRoutes);
app.use("/admin", adminRoutes);

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require("./services/db");

//render the index page when the user visits the home page
app.get("/", (req, res) => {
  res.render("index", { title: "SAVIFY Home" });
});
// Create a route for testing the db
app.get("/db_test", function (req, res) {
  // Assumes a table called test_table exists in your database
  sql = "select * from activity_log";
  db.query(sql).then((results) => {
    console.log(results);
    res.send(results);
  });
});

// Start server on port 3000
app.listen(3000, function () {
  console.log(`Server running at http://127.0.0.1:3000/`);
});
