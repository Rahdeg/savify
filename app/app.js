// Import express.js
const express = require("express");
const path = require('path');
var session = require("express-session");
const userRoutes = require("./routes/userRoutes");
const goalRoutes = require("./routes/goalRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const { formatDate, formatDateTime } = require("./utils/formatDate");
const Category = require("./models/category");

// Create express app
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: "secretkeysdfjsflyoifasd",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);


app.use((req, res, next) => {
  res.locals.sessionUser = req.session?.user || null;
  next();
});

const _categoriesCache = { data: null, expiresAt: 0 };

app.use(async (req, res, next) => {
  try {
    if (Date.now() > _categoriesCache.expiresAt) {
      _categoriesCache.data = await Category.getAllCategories();
      _categoriesCache.expiresAt = Date.now() + 60_000; // 60-second TTL
    }
    res.locals.categories = _categoriesCache.data;
  } catch (err) {
    res.locals.categories = [];
  }
  next();
});

// Use the Pug templating engine
app.set("view engine", "pug");
app.set("views", "./app/views");

// Make date helpers available in every Pug template
app.locals.formatDate = formatDate;
app.locals.formatDateTime = formatDateTime;

// Use the routes defined in the userRoutes, goalRoutes, and adminRoutes files
app.use("/", userRoutes);
app.use("/goals", goalRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);

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
