const { UserAccount } = require("../models/userAccount");

exports.showAddAccount = (req, res) => {
  res.render("add-account", {
    title: "Add Payout Account",
    session: req.session,
  });
};

exports.addAccount = async (req, res) => {
  try {
    const userId = req.session?.user?.user_id;
    const { account_name, bank_name, account_number, sort_code, account_type } = req.body;

    if (!account_name || !bank_name || !account_number || !sort_code) {
      req.session.errorMessage = "All fields are required.";
      return res.redirect("/accounts/add");
    }

    await UserAccount.create({ userId, account_name, bank_name, account_number, sort_code, account_type });

    req.session.successMessage = "Account added successfully.";
    res.redirect("/accounts");
  } catch (err) {
    console.error(err);
    req.session.errorMessage = "Unable to save account, please try again.";
    res.redirect("/accounts/add");
  }
};

exports.showAccounts = async (req, res) => {
  try {
    const userId = req.session?.user?.user_id;
    const accounts = await UserAccount.getByUser(userId);

    res.render("accounts", {
      title: "My Payout Accounts",
      accounts,
      session: req.session,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
