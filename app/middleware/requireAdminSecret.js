exports.requireAdminSecret = (req, res, next) => {
  if (req.session?.adminVerified) return next();
  res.redirect("/admin/verify");
};
