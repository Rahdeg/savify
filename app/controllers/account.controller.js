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

exports.showEditAccount = async (req, res) => {
  try {
    const userId = req.session?.user?.user_id;
    const account = await UserAccount.getById(req.params.id, userId);

    if (!account) {
      req.session.errorMessage = "Account not found.";
      return res.redirect("/accounts");
    }

    res.render("edit-account", {
      title: "Edit Account",
      account,
      session: req.session,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

exports.updateAccount = async (req, res) => {
  try {
    const userId = req.session?.user?.user_id;
    const { account_name, bank_name, account_number, sort_code, account_type } = req.body;

    if (!account_name || !bank_name || !account_number || !sort_code) {
      req.session.errorMessage = "All fields are required.";
      return res.redirect(`/accounts/${req.params.id}/edit`);
    }

    const updated = await UserAccount.update(req.params.id, userId, {
      account_name, bank_name, account_number, sort_code, account_type,
    });

    req.session.successMessage = updated ? "Account updated successfully." : "Account not found.";
    res.redirect("/accounts");
  } catch (err) {
    console.error(err);
    req.session.errorMessage = "Unable to update account, please try again.";
    res.redirect(`/accounts/${req.params.id}/edit`);
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.session?.user?.user_id;
    const accountId = req.params.id;

    const deleted = await UserAccount.delete(accountId, userId);

    req.session.successMessage = deleted
      ? "Account removed successfully."
      : "Account not found or you do not have permission to remove it.";

    res.redirect("/accounts");
  } catch (err) {
    console.error(err);
    req.session.errorMessage = "Unable to remove account, please try again.";
    res.redirect("/accounts");
  }
};
