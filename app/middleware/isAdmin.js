exports.isAdmin = (req, res, next) => {
  const user = req.session?.user;

  if (!user) {
    return res.redirect("/auth/login?message=Please login to continue.");
  }

  if (user.role !== "admin") {
    return res.status(403).render("403", { title: "Access Denied" });
  }

  next();
};